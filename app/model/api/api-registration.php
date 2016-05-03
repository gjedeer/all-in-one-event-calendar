<?php

/**
 * Class for Timely API communication for Registration.
 *
 * @author     Time.ly Network, Inc.
 * @since      2.4
 * @package    Ai1EC
 * @subpackage Ai1EC.Model
 */
class Ai1ec_Api_Registration extends Ai1ec_Api_Abstract {

	/**
	 * Post construction routine.
	 *
	 * Override this method to perform post-construction tasks.
	 *
	 * @return void Return from this method is ignored.
	 */
	protected function _initialize() {
		parent::_initialize();
	}

	/**
	 * @return object Response body in JSON.
	 */
	public function signin() {
		$body['email']    = $_POST['ai1ec_email'];
		$body['password'] = $_POST['ai1ec_password'];
		$response         = $this->request_api( 'POST', AI1EC_API_URL . 'auth/authenticate', json_encode( $body ), true, array( 'Authorization' => null ) );
		if ( $this->is_response_success( $response ) ) {
			$response_body = (array) $response->body;
			$this->save_ticketing_settings( $response_body['message'], true, $response_body['auth_token'], $this->_find_user_calendar(), $body['email'] );
			$this->has_payment_settings();
			$this->sync_api_settings();
		} else {
			$error_message = $this->save_error_notification( $response, __( 'We were unable to Sign you In for Time.ly Network', AI1EC_PLUGIN_NAME ) );
			$this->save_ticketing_settings( $error_message, false, '', 0, null );
		}
		return $response;
	}

	/**
	 * @return object Response body in JSON.
	 */
	public function signup() {
		$body['name']                  = $_POST['ai1ec_name'];
		$body['email']                 = $_POST['ai1ec_email'];
		$body['password']              = $_POST['ai1ec_password'];
		$body['password_confirmation'] = $_POST['ai1ec_password_confirmation'];
		$body['phone']                 = $_POST['ai1ec_phone'];
		$body['terms']                 = $_POST['ai1ec_terms'];
		$response                      = $this->request_api( 'POST', AI1EC_API_URL . 'auth/register', json_encode( $body ), true );
		if ( $this->is_response_success( $response ) ) {
			$response_body = (array) $response->body;
			$this->save_ticketing_settings( $response_body['Registration'], true, $response_body['auth_token'] , $this->_create_calendar(), $body['email'] );
		} else {
			$error_message = $this->save_error_notification( $response, __( 'We were unable to Sign you Up for Time.ly Network', AI1EC_PLUGIN_NAME ) );
			$this->save_ticketing_settings( $error_message, false, '', 0, null );
		}
		return $response;
	}

	/**
	 * @return object Response body in JSON.
	 */
	protected function availability() {
		$api_features = get_site_transient( 'ai1ec_api_features' );

		if ( false === $api_features || ( defined( 'AI1EC_DEBUG' ) && AI1EC_DEBUG ) ) {
			$response = $this->request_api( 'GET', AI1EC_API_URL . 'feature/availability', null, true );

			if ( $this->is_response_success( $response ) ) {
				$api_features = (array) $response->body;
			} else {
				$api_features = array();
			}

			// Save for 30 minutes
			$minutes = 30;
			set_site_transient( 'ai1ec_api_features', $api_features, $minutes * 60 );
		}

		return $api_features;
	}

	protected function is_feature_available( $feature_code ) {
		$availability = $this->availability();

		if ( ! is_null( $availability ) ) {
			foreach ( $availability as $value ) {
				if ( isset( $value->code ) && $feature_code === $value->code
					&& isset( $value->available ) && true === $value->available ) {
					return true;
				}
			}
		}
		return false;
	}

	public function is_api_sign_up_available() {
	    return $this->is_feature_available( Ai1ec_Api_Features::CODE_API_ACCESS );
	}

	public function is_ticket_available() {
		return $this->is_feature_available( Ai1ec_Api_Features::CODE_TICKETING );
	}

	/**
	 * @return array List of subscriptions and limits
	 */
	protected function get_subscriptions() {
		$subscriptions = get_site_transient( 'ai1ec_subscriptions' );

		if ( false === $subscriptions ) {
			$response = $this->request_api( 'GET', AI1EC_API_URL . 'calendars/' . $this->_get_ticket_calendar() . '/subscriptions',
					null,
					true
					);
			if ( $this->is_response_success( $response ) ) {
				$subscriptions = (array) $response->body;
			} else {
				$subscriptions = array();
			}

			// Save for 30 minutes
			$minutes = 30;
			set_site_transient( 'ai1ec_subscriptions', $subscriptions, $minutes * 60 );
		}

		return $subscriptions;
	}

	public function has_subscription_active( $feature ) {
		$subscriptions = $this->get_subscriptions();

		return array_key_exists( $feature, $subscriptions );
	}
 
 	/**
	 * Clean the ticketing settings on WP database only
	 */
	public function signout() {
		$calendar_id = $this->_get_ticket_calendar();
		if ( 0 >= $calendar_id ) {
			return false;
		}
		$response = $this->request_api( 'GET', AI1EC_API_URL . "calendars/$calendar_id/signout", null, true );
		if ( $this->is_response_success( $response ) ) {
			$this->clear_ticketing_settings();
			return array( 'message' => '' );
		} else {
			$error_message = $this->save_error_notification( $response, __( 'We were unable to Sign you Out of Time.ly Network', AI1EC_PLUGIN_NAME ) );
			return array( 'message' => $error_message );
		}				
	}

	/**
	 * @return object Response body from API.
	 */
	public function save_payment_preferences() {
		$calendar_id = $this->_get_ticket_calendar();
		if ( 0 >= $calendar_id ) {
			return false;
		}
		$settings  = array(
			'payment_method' => $_POST['ai1ec_payment_method'],
			'paypal_email'   => $_POST['ai1ec_paypal_email'],
			'first_name'     => $_POST['ai1ec_first_name'],
			'last_name'      => $_POST['ai1ec_last_name'],
			'currency'       => $_POST['ai1ec_currency']
		);
		$custom_headers['content-type'] = 'application/x-www-form-urlencoded';
		$response = $this->request_api( 'PUT', AI1EC_API_URL . 'calendars/' . $calendar_id . '/payment', 
			$settings, 
			true, //decode response body
			$custom_headers 
		);
		if ( $this->is_response_success( $response ) ) {
			$this->save_payment_settings( $settings );
			$notification  = $this->_registry->get( 'notification.admin' );
			$notification->store( 
				__( 'Payment preferences were saved.', AI1EC_PLUGIN_NAME ), 
				'updated', 
				0, 
				array( Ai1ec_Notification_Admin::RCPT_ADMIN ), 
				false 
			);
			return $response->body;
		} else {
			$this->save_error_notification( $response, 
				__( 'Payment preferences were not saved.', AI1EC_PLUGIN_NAME )
			);
			return false;
		}
	}

	public function _order_comparator( $order1, $order2 ) {
		return strcmp( $order1->created_at, $order2->created_at ) * -1;
	}

	/**
	 * @return object Response body in JSON.
	 */
	public function get_purchases() {
		$response = $this->request_api( 'GET', AI1EC_API_URL . 'calendars/' . $this->_get_ticket_calendar() . '/sales', 
			null, //body
			true //decode response body
			);
		if ( $this->is_response_success( $response ) ) {
			$result = $response->body;
			if ( isset( $result->orders ) ) {
				usort( $result->orders, array( "Ai1ec_Api_Registration", "_order_comparator" ) );
				return $result->orders;
			} else {
				return array();
			}
		} else {
			$this->save_error_notification( $response, 
				__( 'We were unable to get the Sales information from Time.ly Network', AI1EC_PLUGIN_NAME )
			);
			return array();
		}
	}

	/**
	 * Sync settings from API after signing in
	 */
	public function sync_api_settings() {
		// Sync feeds subscriptions
		$api_feed = $this->_registry->get( 'model.api.api-feeds' );
		$api_feed->get_and_sync_feed_subscriptions();
	}

}
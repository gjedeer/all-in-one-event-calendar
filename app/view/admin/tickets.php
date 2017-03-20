<?php

/**
 * Tickets page.
 *
 * @author     Time.ly Network Inc.
 * @since      2.4
 *
 * @package    AI1EC
 * @subpackage AI1EC.View
 */
class Ai1ec_View_Tickets extends Ai1ec_View_Admin_Abstract {

	/**
	 * @var string The nonce action
	 */
	const NONCE_ACTION = 'ai1ec_api_ticketing_signup';

	/**
	 * @var string The nonce name
	 */
	const NONCE_NAME  = 'ai1ec_api_ticketing_nonce';

	/**
	 * @var string The id/name of the submit button.
	 */
	const SUBMIT_ID = 'ai1ec_api_ticketing_signup';

	/**
	 * Adds the page to the correct menu.
	 */
	public function add_page() {
		add_submenu_page(
			AI1EC_ADMIN_BASE_URL,
			__( 'Ticketing', AI1EC_PLUGIN_NAME ),
			__( 'Ticketing', AI1EC_PLUGIN_NAME ),
			'manage_ai1ec_feeds',
			AI1EC_PLUGIN_NAME . '-tickets',
			array( $this, 'display_page' )
		);
	}

	/**
	 * Add meta box for page.
	 *
	 * @wp_hook admin_init
	 *
	 * @return void
	 */
	public function add_meta_box() {}

	/**
	 * Display the page html
	 */
	public function display_page() {

		$signed_to_api       = $this->_api_registration->is_signed();
		$signup_available    = $this->_api_registration->is_api_sign_up_available();
		$ticketing_available = $this->_api_registration->is_ticket_available();
		$ticketing_enabled   = $this->_api_registration->has_subscription_active( Ai1ec_Api_Features::CODE_TICKETING );
		$ticketing_message   = $this->_api_registration->get_sign_message();
		$loader              = $this->_registry->get( 'theme.loader' );

		if ( ! $signed_to_api ) {

			if ( false === ai1ec_is_blank( $ticketing_message ) ) {
				$this->_api_registration->clear_sign_message();
			}

			$args = array(
				'title' => Ai1ec_I18n::_trans(
					'Time.ly Ticketing'
				),
				'sign_up_text' => 'Please, <a href="edit.php?post_type=ai1ec_event&page=all-in-one-event-calendar-settings">Sign Up for a Timely Network account</a> to use Ticketing or Import Feeds.',
				'signup_form'  => Ai1ec_I18n::_trans( 'You need to sign up for a Timely Network account in order to use Ticketing or Import Feeds<br /><br />' ) .
					(
						$signup_available
						? Ai1ec_I18n::_trans( '<a href="edit.php?post_type=ai1ec_event&page=all-in-one-event-calendar-settings" class="ai1ec-btn ai1ec-btn-primary ai1ec-btn-lg">Sign In to Timely Network</a>' )
						: Ai1ec_I18n::_trans( '<b>Signing up for a Timely Network account is currently unavailable. Please, try again later.</b>' )
					)

			);
			$file = $loader->get_file( 'ticketing/signup.twig', $args, true );
		} elseif ( ! $ticketing_available ) {
			$args = array(
				'title' => Ai1ec_I18n::_trans(
					'Time.ly Ticketing'
				),
				'sign_up_text' => '',
				'signup_form'  => 'Ticketing is currently not available for this website. Please, try again later.'

			);
			$file = $loader->get_file( 'ticketing/signup.twig', $args, true );
		} elseif ( ! $ticketing_enabled ) {
			$args = array(
					'title' => Ai1ec_I18n::_trans(
							'Time.ly Ticketing'
							),
					'sign_up_text' => '',
					'signup_form'  => 'Timely Ticketing saves time & money. Create ticketing/registration right here and now. You do not pay any ticketing fees (other than regular PayPal transaction costs). Create as many ticketing/registration as you\'d like.<br /><br />Ticketing feature is not enabled for this website. Please sign up for Ticketing plan <a href="https://time.ly/tickets-existing-users/" target="_blank">here</a>.'
			);
			$file = $loader->get_file( 'ticketing/signup.twig', $args, true );
		} else {
			$response  = $this->_api_registration->get_payment_preferences();
			$purchases = $this->_api_registration->get_purchases();
			$args      = array(
				'title'                             => Ai1ec_I18n::_trans(
					'Time.ly Ticketing'
				),
				'settings_text'                     => Ai1ec_I18n::_trans( 'Settings' ),
				'sales_text'                        => Ai1ec_I18n::_trans( 'Sales' ),
				'select_payment_text'               => Ai1ec_I18n::_trans( 'Please provide your PayPal details.' ),
				'cheque_text'                       => Ai1ec_I18n::_trans( 'Cheque' ),
				'paypal_text'                       => Ai1ec_I18n::_trans( 'PayPal' ),
				'currency_text'                     => Ai1ec_I18n::_trans( 'Preferred currency for tickets:' ),
				'required_text'                     => Ai1ec_I18n::_trans( 'This field is required.' ),
				'save_changes_text'                 => Ai1ec_I18n::_trans( 'Save Changes' ),
				'date_text'                         => Ai1ec_I18n::_trans( 'Date' ),
				'event_text'                        => Ai1ec_I18n::_trans( 'Event' ),
				'purchaser_text'                    => Ai1ec_I18n::_trans( 'Purchaser' ),
				'tickets_text'                      => Ai1ec_I18n::_trans( 'Tickets' ),
				'email_text'                        => Ai1ec_I18n::_trans( 'Email' ),
				'status_text'                       => Ai1ec_I18n::_trans( 'Status' ),
				'total_text'                        => Ai1ec_I18n::_trans( 'Total' ),
				'sign_out_button_text'              => Ai1ec_I18n::_trans( 'Sign Out' ),
				'payment_method'                    => $response->payment_method,
				'paypal_email'                      => $response->paypal_email,
				'first_name'                        => $response->first_name,
				'last_name'                         => $response->last_name,
				'currency'  	                    => $response->currency,
				'nonce'                             => array(
					'action'   => self::NONCE_ACTION,
					'name'     => self::NONCE_NAME,
					'referrer' => false,
				),
				'action'                            =>
					'?controller=front&action=ai1ec_api_ticketing_signup&plugin=' .
					AI1EC_PLUGIN_NAME,
				'purchases'                         => $purchases,
				'paypal_currencies'					=> array (
					array( 'description' => Ai1ec_I18n::_trans( 'United States Dollar' ), 'code' => 'USD' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Canadian Dollar' ), 'code' => 'CAD' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Australian Dollar' ), 'code' => 'AUD' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Brazilian Real' ), 'code' => 'BRL', 'note' => Ai1ec_I18n::_trans( 'Note: This currency is supported as a payment currency and a currency balance for in-country PayPal accounts only.' ) ),
					array( 'description' => Ai1ec_I18n::_trans( 'Czech Koruna' ), 'code' => 'CZK' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Danish Krone' ), 'code' => 'DKK' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Euro' ), 'code' => 'EUR' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Hong Kong Dollar' ), 'code' => 'HKD' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Hungarian Forint' ), 'code' => 'HUF', 'note' => Ai1ec_I18n::_trans( 'Note: Decimal amounts are not supported for this currency. Passing a decimal amount will throw an error.' ) ),
					array( 'description' => Ai1ec_I18n::_trans( 'Israeli New Sheqel' ), 'code' => 'ILS' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Japanese Yen' ), 'code' => 'JPY', 'note' => Ai1ec_I18n::_trans( 'Note: This currency does not support decimals. Passing a decimal amount will throw an error. 1,000,000' ) ),
					array( 'description' => Ai1ec_I18n::_trans( 'Malaysian Ringgit' ), 'code' => 'MYR', 'note' => Ai1ec_I18n::_trans( 'Note: This currency is supported as a payment currency and a currency balance for in-country PayPal accounts only.' ) ),
					array( 'description' => Ai1ec_I18n::_trans( 'Mexican Peso' ), 'code' => 'MXN' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Norwegian Krone' ), 'code' => 'NOK' ),
					array( 'description' => Ai1ec_I18n::_trans( 'New Zealand Dollar' ), 'code' => 'NZD' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Philippine Peso' ), 'code' => 'PHP' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Polish Zloty' ), 'code' => 'PLN' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Pound Sterling' ), 'code' => 'GBP' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Russian Ruble' ), 'code' => 'RUB', 'note' => Ai1ec_I18n::_trans( 'For in-border payments (payments made within Russia), the Russian Ruble is the only accepted currency. If you use another currency for in-border payments, the transaction will fail' ) ),
					array( 'description' => Ai1ec_I18n::_trans( 'Singapore Dollar' ), 'code' => 'SGD' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Swedish Krona' ), 'code' => 'SEK' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Swiss Franc' ), 'code' => 'CHF' ),
					array( 'description' => Ai1ec_I18n::_trans( 'Taiwan New Dollar' ), 'code' => 'TWD', 'note' => Ai1ec_I18n::_trans( 'Note: Decimal amounts are not supported for this currency. Passing a decimal amount will throw an error.' ) ),
					array( 'description' => Ai1ec_I18n::_trans( 'Thai Baht' ), 'code' => 'THB' ),
				)
			);
			$file = $loader->get_file( 'ticketing/manage.twig', $args, true );
		}

		$this->_registry->get( 'css.admin' )->admin_enqueue_scripts(
			'ai1ec_event_page_all-in-one-event-calendar-settings'
		);
		$this->_registry->get( 'css.admin' )->process_enqueue(
			array(
				array( 'style', 'ticketing.css', ),
			)
		);
		if ( isset( $_POST['ai1ec_save_settings'] ) ) {
			$response = $this->_api_registration->save_payment_preferences();

			// this redirect makes sure that the error messages appear on the screen
			header( "Location: " . $_SERVER['HTTP_REFERER'] );
		}
		return $file->render();
	}

	/**
	 * Handle post, likely to be deprecated to use commands.
	 */
	public function handle_post(){}

}

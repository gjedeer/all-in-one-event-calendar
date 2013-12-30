<?php

/**
 * The concrete class for the calendar page.
 *
 * @author     Time.ly Network Inc.
 * @since      2.0
 *
 * @package    AI1EC
 * @subpackage AI1EC.View
 */
class Ai1ec_Calendar_Page extends Ai1ec_Base {

	/**
	 * @var Ai1ec_Memory_Utility Instance of memory to hold exact dates
	 */
	protected $_exact_dates = NULL;

	
	/**
	 * Public constructor
	 * 
	 * @param Ai1ec_Registry_Object $registry The registry object
	 */
	public function __construct( Ai1ec_Registry_Object $registry ) {
		parent::__construct( $registry );
		$this->_exact_dates = $registry->get( 'cache.memory' );
	}

	/**
	 * Get the content if the calendar page
	 * 
	 * @param Ai1ec_Request_Parser $request
	 */
	public function get_content( Ai1ec_Request_Parser $request ) {
		// Are we loading a shortcode?
		$shortcode       = $request->get( 'shortcode' );
		
		$view_args  = $this->get_view_args_for_view( $request );
		$action     = $view_args['action'];
		$type       = $request->get( 'request_type' );
		
		$exact_date = $this->get_exact_date( $request );
		$view = $this->_registry->get( 'view.calendar.view.oneday', $request );
		$view_args = $view->get_extra_arguments( $view_args, $exact_date );
		$view = $view->get_content( $view_args );
		$args = array(
			'view' => $view,
			'version' => AI1EC_VERSION,
			'subscribe_buttons' => '',
		);
		$taxonomy = $this->_registry->get( 'view.calendar.taxonomy' );
		$categories = $taxonomy->get_html_for_categories(
			$view_args
		);

		$tags = $taxonomy->get_html_for_tags(
			$view_args,
			true
		);
		$dropdown_args = $view_args;
		if (
			isset( $dropdown_args['time_limit'] ) &&
			false !== $exact_date
		) {
			$dropdown_args['exact_date'] = $exact_date;
		}
		$views_dropdown =
			$this->get_html_for_views_dropdown( $dropdown_args );
		$subscribe_buttons =
			$this->get_html_for_subscribe_buttons( $view_args );

		if (
			( $view_args['no_navigation'] || $type !== 'html' ) &&
			'true' !== $shortcode
		) {
			$args_for_filter = $view_args;
			$router = $this->_registry->get( 'routing.router' );
			$are_filters_set = $router->is_at_least_one_filter_set_in_request( $view_args );
			// send data both for json and jsonp as shortcodes are jsonp
			return array(
				'html'               => $view,
				'categories'         => $categories,
				'tags'               => $tags,
				'views_dropdown'     => $views_dropdown,
				'subscribe_buttons'  => $subscribe_buttons,
				'are_filters_set'    => $are_filters_set,
			);
		
		} else {
		
		
			// Define new arguments for overall calendar view
			$filter_args = array(
				'views_dropdown'               => $views_dropdown,
				'categories'                   => $categories,
				'tags'                         => $tags,
			);
			$loader = $this->_registry->get( 'theme.loader' );
			$filter_menu = $loader->get_file( 'filter-menu.twig', $filter_args, false );
			$calendar_args = array(
				'version'     => AI1EC_VERSION,
				'filter_menu' => $filter_menu,
				'view'        => $view,
				'subscribe_buttons'  => $subscribe_buttons,
			);
			$calendar = $loader->get_file( 'calendar.twig', $calendar_args, false );
			return $calendar->get_content();
		}


		
	}

	/**
	 * get_html_for_subscribe_buttons method
	 *
	 * Render the HTML for the `subscribe' buttons
	 *
	 * @param array $view_args Args to pass
	 *
	 * @return string Rendered HTML to include in output
	 */
	public function get_html_for_subscribe_buttons( array $view_args ) {
		global $ai1ec_view_helper, $ai1ec_localization_helper;
		$args = array(
			'url_args'    => '',
			'is_filtered' => false,
			'export_url'  => AI1EC_EXPORT_URL,
		);
		if ( ! empty( $view_args['cat_ids'] ) ) {
			$args['url_args'] .= '&ai1ec_cat_ids=' .
				implode( ',', $view_args['cat_ids'] );
			$args['is_filtered'] = true;
		}
		if ( ! empty( $view_args['tag_ids'] ) ) {
			$args['url_args']  .= '&ai1ec_tag_ids=' .
				implode( ',', $view_args['tag_ids'] );
			$args['is_filtered'] = true;
		}
		if ( ! empty( $view_args['post_ids'] ) ) {
			$args['url_args']  .= '&ai1ec_post_ids=' .
				implode( ',', $view_args['post_ids'] );
			$args['is_filtered'] = true;
		}
		$localization = $this->_registry->get( 'p28n.wpml' );
		if (
			NULL !== ( $use_lang = $localization->get_language() )
		) {
			$args['url_args'] .= '&lang=' . $use_lang;
		}
		$subscribe = $this->_registry->get( 'theme.loader' )
			->get_file( 'subscribe-buttons.twig', $args, false );
		return $subscribe->get_content();
	}

	/**
	 * This function generates the html for the view dropdowns
	 *
	 * @param array $view_args
	 */
	protected function get_html_for_views_dropdown( $dropdown_args ) {
		$available_views = array( 'oneday' );
		$args = array(
			'available_views'         => $available_views,
		);
		$views_dropdown = $this->_registry->get( 'theme.loader' )
			->get_file( 'views_dropdown.twig', $args, false );
		return $views_dropdown->get_content();
	}

	/**
	 * Get the exact date from request if available, or else from settings.
	 *
	 * @param Ai1ec_Abstract_Query settings
	 * 
	 * @return boolean|int
	 */
	private function get_exact_date( Ai1ec_Abstract_Query $request ) {
		$settings = $this->_registry->get( 'model.settings' );
	
		// Preprocess exact_date.
		// Check to see if a date has been specified.
		$exact_date = $request->get( 'exact_date' );
		$use_key    = $exact_date;
		if ( NULL === ( $exact_date = $this->_exact_dates->get( $use_key ) ) ) {
			$exact_date = $use_key;
			// Let's check if we have a date
			if ( false !== $exact_date ) {
				// If it's not a timestamp
				if( ! Ai1ec_Validation_Utility::is_valid_time_stamp( $exact_date ) ) {
					// Try to parse it
					$exact_date = $this->return_gmtime_from_exact_date( $exact_date );
				}
			}
			// Last try, let's see if an exact date is set in settings.
			if ( false === $exact_date && $settings->get( 'exact_date' ) !== '' ) {
				$exact_date = $this->return_gmtime_from_exact_date(
					$exact_date
				);
			}
			$this->_exact_dates->set( $use_key, $exact_date );
		}
		return $exact_date;
	}

	/**
	 * Decomposes an 'exact_date' parameter into month, day, year components based
	 * on date pattern defined in settings (assumed to be in local time zone),
	 * then returns a timestamp in GMT.
	 *
	 * @param  string     $exact_date 'exact_date' parameter passed to a view
	 * @return bool|int               false if argument not provided or invalid,
	 *                                else UNIX timestamp in GMT
	 */
	private function return_gmtime_from_exact_date( $exact_date ) {
		$settings = $this->_registry->get( 'model.settings' );
	
		$bits = Ai1ec_Validation_Utility::validate_date_and_return_parsed_date(
			$exact_date,
			$settings->get( 'input_date_format' )
		);
		if( false === $bits ) {
			$exact_date = false;
		} else {
			$exact_date = $this->_registry->get( 
				'date.time',
				gmmktime(
					0, 0, 0, $bits['month'], $bits['day'], $bits['year']
				),
				$this->_registry->get( 'model.option' )->get( 'timezone_string' )
			);
			$exact_date = $exact_date->format_to_gmt();
		}
		return $exact_date;
	}

	/**
	 * Returns the correct data attribute to use in views
	 *
	 * @param string $type
	 */
	private function return_data_type_for_request_type( $type ) {
		$data_type = 'data-type="json"';
		if ( $type === 'jsonp' ) {
			$data_type = 'data-type="jsonp"';
		}
		return $data_type;
	}

	/**
	 * Get the parameters for the view from the request object
	 * 
	 * @param Ai1ec_Abstract_Query $request
	 * 
	 * @return array
	 */
	protected function get_view_args_for_view( Ai1ec_Abstract_Query $request ) {
		$settings = $this->_registry->get( 'model.settings' );
		// Define arguments for specific calendar sub-view (month, agenda,
		// posterboard, etc.)
		// Preprocess action.
		// Allow action w/ or w/o ai1ec_ prefix. Remove ai1ec_ if provided.
		$action = $request->get( 'action' );
	
		if ( 0 === strncmp( $action, 'ai1ec_', 6 ) ) {
			$action = substr( $action, 6 );
		}
		$view_args = $request->get_dict( array(
			'post_ids',
			'auth_ids',
			'cat_ids',
			'tag_ids',
		) );
	
		$add_defaults = array(
			'cat_ids' => 'categories',
			'tag_ids' => 'tags',
		);
		foreach ( $add_defaults as $query => $default ) {
			if ( empty( $view_args[$query] ) ) {
				$setting = $settings->get( 'default_tags_categories' );

				$view_args[$query] = $setting[$default];
			}
		}
	
		$type = $request->get( 'request_type' );

		$view_args['data_type'] = $this->return_data_type_for_request_type(
			$type
		);
	
		$exact_date = $this->get_exact_date( $request );
	
		$view_args['no_navigation'] = $request
			->get( 'no_navigation' ) === 'true';
	
		// Find out which view of the calendar page was requested, and render it
		// accordingly.
		$view_args['action'] = $action;

		$view_args['request'] = $request;
		return $view_args;
	}
}
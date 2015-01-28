timely.define(
	[
		"jquery_timely",
		"scripts/common_scripts/backend/common_ajax_handlers"
	],
	function( $, ajax_handlers ) {
	 // jshint ;_;

	var dismiss_plugins_messages_handler = function( e ) {
		var data = {
			"action" : 'ai1ec_facebook_cron_dismiss'
		};
		$.post(
				ajaxurl,
				data,
				ajax_handlers.handle_dismiss_plugins,
				'json'
			);
	};

	var dismiss_notification_handler = function( e ) {
		var $button = $( this );
		// disable the update button
		$button.attr( 'disabled', true );

		// create the data to send
		var data = {
			action: 'ai1ec_disable_notification',
			note  : false
		};

		$.post( ajaxurl, data, ajax_handlers.handle_dismiss_notification ) ;
	};

	var dismiss_intro_video_handler = function( e ) {
		var $button = $( this );
		// Disable the update button.
		$button.attr( 'disabled', true );

		// Create the data to send.
		var data = {
			action: 'ai1ec_disable_intro_video',
			note  : false
		};

		$.post( ajaxurl, data, ajax_handlers.handle_dismiss_intro_video ) ;
	};

	/**
	 * Dismiss button clicked in invalid license warning.
	 *
	 * @param  {Event} e jQuery event object
	 */
	var dismiss_license_warning_handler = function( e ) {
		var $button = $( this );
		// Disable the update button.
		$button.attr( 'disabled', true );

		// Create the data to send.
		var data = {
			action: 'ai1ec_set_license_warning',
			value: 'dismissed'
		};

		$.post( ajaxurl, data, ajax_handlers.handle_dismiss_license_warning ) ;
	};

	// Show/hide the multiselect containers when user clicks on "limit by" widget options
	var handle_multiselect_containers_widget_page = function( e ) {
		$( this ).parent().next( '.ai1ec-limit-by-options-container' )
                                  .toggle()
                                  .find( 'option' )
                                  .removeAttr( 'selected' );
	};

	return {
		dismiss_plugins_messages_handler          : dismiss_plugins_messages_handler,
		dismiss_notification_handler              : dismiss_notification_handler,
		dismiss_intro_video_handler               : dismiss_intro_video_handler,
		dismiss_license_warning_handler           : dismiss_license_warning_handler,
		handle_multiselect_containers_widget_page : handle_multiselect_containers_widget_page
	};
} );

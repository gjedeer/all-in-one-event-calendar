define(
	[
		'jquery_timely',
		'domReady',
		'scripts/calendar_feeds/ics/ics_event_handlers',
		'libs/select2_multiselect_helper',
		'libs/tags_select',
		'libs/utils',
		'ai1ec_config',
		'libs/gmaps',
		'external_libs/jquery_cookie',
		'external_libs/bootstrap/tab',
		'external_libs/bootstrap/alert',
		'external_libs/bootstrap/modal',
		'external_libs/bootstrap/button',
		'external_libs/bootstrap/collapse'
	],
	function(
		$,
		domReady,
		ics_event_handlers,
		select2_multiselect_helper,
		tags_select,
		utils,
		ai1ec_config,
		gMapsLoader
	) {

	"use strict"; // jshint ;_;

	/**
	 * Refresh Select2 widgets.
	 */
	var refresh_select2 = function() {
		var $ics_container = $( this.hash );
		select2_multiselect_helper.refresh( $ics_container );
		tags_select.refresh( $ics_container );
	};

	// Function that handles setting the cookie when the tab is clicked
	var handle_set_tab_cookie = function( e ) {
		var active = $( this ).attr( 'href' );
		$.cookie( 'feeds_active_tab', active );
	};

	var attach_event_handlers = function() {
		var $ics_container = $( '#ai1ec-feeds-after' ),
		    $facebook_container = $( '.ai1ec_submit_wrapper' ),
		    $file_upload_container = $( '.ai1ec_file_upload_tags_categories' );
		select2_multiselect_helper.init( $ics_container );
		tags_select.init( $ics_container );
		select2_multiselect_helper.init( $facebook_container );
		tags_select.init( $facebook_container );
		select2_multiselect_helper.init( $file_upload_container );
		tags_select.init( $file_upload_container );
		// Save the active tab in a cookie on click.
		$( 'ul.ai1ec-nav a' ).on( 'click', handle_set_tab_cookie );
		// Reinitialize Select2 widgets when displayed (required for placement of
		// placeholders).
		$( 'ul.ai1ec-nav a' ).on( 'shown', refresh_select2 );

		// ===========================
		// = ICS feed event handlers =
		// ===========================
		$( 'select[name="cron_freq"]' ).on( 'change', function() {
			$.ajax( {
				url      : ajaxurl,
				type     : 'POST',
				data: {
					action    : 'ai1ec_feeds_page_post',
					cron_freq : this.value
				}
			} );
		} );
		// Handles clicking the buttons in the ICS delete modal.
		$( '#ai1ec-ics-modal' ).on(
			'click', '.remove, .keep', ics_event_handlers.submit_delete_modal
		);
		$( document )
			// Handles submitting a new feed.
			.on( 'click', '#ai1ec_add_new_ics', ics_event_handlers.add_new_feed )
			// Handles opening the modal window for deleting the feeds.
			.on( 'click', '.ai1ec_delete_ics', ics_event_handlers.open_delete_modal )
			// Handles refreshing the feed's events.
			.on( 'click', '.ai1ec_update_ics', ics_event_handlers.update_feed )
			// Edit feed.
			.on( 'click', '.ai1ec_edit_ics' , ics_event_handlers.edit_feed )
			// Cancel editing feed.
			.on( 'click', '#ai1ec_cancel_ics' , ics_event_handlers.edit_cancel )
			.on( 'click', '.ai1ec-panel-heading > a' , ics_event_handlers.edit_cancel )
			// Checks import timezone option
			.on( 'blur', '#ai1ec_feed_url', ics_event_handlers.feed_url_change );

	};
	
	var init_suggested_events = function() {
		$( document ).on( 'click', '.ai1ec-suggested-import-event', function() {
			var
				$this      = $( this ),
				$container = $this.closest( '.ai1ec-suggested-event-import' ),
				event_id   = $this.closest( '.ai1ec-infowindow, tr' ).attr( 'data-event-id' );
				
			$( 'a.ai1ec-suggested-processing', $container ).removeClass( 'ai1ec-hidden' );
			$this.addClass( 'ai1ec-hidden' );
			
			$.ajax( {
				url      : ai1ec_config.ajax_url,
				type     : 'POST',
				data     : {
					action         : 'ai1ec_import_suggested_event',
					ai1ec_event_id : event_id
				},
				success  : function( response ) {
					$( 'a.ai1ec-suggested-processing', $container ).addClass( 'ai1ec-hidden' );
					$( 'a.ai1ec-suggested-remove-event', $container ).removeClass( 'ai1ec-hidden' );
				}
			} );

			return false;
		} );
		
		$( document ).on( 'click', '.ai1ec-suggested-remove-event', function() {
			var
				$this      = $( this ),
				$container = $this.closest( '.ai1ec-suggested-event-import' ),
				event_id   = $this.closest( '.ai1ec-infowindow, tr' ).attr( 'data-event-id' );

			$( 'a.ai1ec-suggested-processing', $container ).removeClass( 'ai1ec-hidden' );
			$this.addClass( 'ai1ec-hidden' );
			
			$.ajax( {
				url      : ai1ec_config.ajax_url,
				type     : 'POST',
				data     : {
					action         : 'ai1ec_remove_suggested_event',
					ai1ec_event_id : event_id
				},
				success  : function( response ) {
					$( 'a.ai1ec-suggested-processing', $container ).addClass( 'ai1ec-hidden' );
					$( 'a.ai1ec-suggested-import-event', $container ).removeClass( 'ai1ec-hidden' );
				}
			} );

			return false;
		} );
		
		// Init Events map
		var init_gmaps = function() {
			var
				$events     = $( 'tr.ai1ec-suggested-event' ),
				markers     = [],
				bounds      = new google.maps.LatLngBounds();
				map_options = {
					mapTypeId      : google.maps.MapTypeId.ROADMAP,
					mapTypeControl : true,
					zoomControl    : true,
					scaleControl   : true
				},
				buttons    = $( '.ai1ec-suggested-events-actions-template' ).html(),
				events_map = new google.maps.Map(
					$( '#ai1ec_events_map_canvas' ).get( 0 ), map_options
				),
				infowindow = new google.maps.InfoWindow({
					maxWidth: 260
				} ),
				create_info = function( event ) {
					var s = '<div class="ai1ec-infowindow" data-event-id="'
						+ event.id +  '"><a href="#" class="ai1ec-infowindow-title"><b>'
						+ event.title + '</b></a><br>'
						+ event.dtstart.substr( 0, 10 )
						+ ' @ ' + event.venue_name
						+ '<br>' + buttons + '</div>';

					infowindow.setContent( s );
				};

			$events.each( function() {
				var
					$this = $( this ),
					event = $.parseJSON( $this.attr( 'data-event' ) );
				
				if ( ! event || ! event.latitude || ! event.longitude ) return;
				
				var marker = new google.maps.Marker( {
					map      : events_map,
					title    : event.title,
					position : new google.maps.LatLng( event.latitude , event.longitude )
				} );

				marker.addListener( 'click', function() {
					create_info( event );
					infowindow.open( events_map, this );
			 	} );
				
				bounds.extend( marker.getPosition() );
				markers.push( marker );
			} );

			events_map.fitBounds( bounds );
		};

		

		$( document ).on( 'click',  '.ai1ec-suggested-view-list', function() {
			if ( $(this).hasClass( 'ai1ec-active' ) ) return false;
			$( '.ai1ec-suggested-map-container' ).addClass( 'ai1ec-hidden' );
			$( '.ai1ec-suggested-events' ).removeClass( 'ai1ec-hidden' );
			$( '.ai1ec-suggested-view-selector .ai1ec-active' ).removeClass( 'ai1ec-active' );
			$( this ).addClass( 'ai1ec-active' );
			return false;
		} );
		
		$( document ).on( 'click',  '.ai1ec-suggested-view-map', function() {
			if ( $(this).hasClass( 'ai1ec-active' ) ) return false;
			$( '.ai1ec-suggested-map-container' ).removeClass( 'ai1ec-hidden' );
			$( '.ai1ec-suggested-events' ).addClass( 'ai1ec-hidden' );
			$( '.ai1ec-suggested-view-selector .ai1ec-active' ).removeClass( 'ai1ec-active' );
			$( this ).addClass( 'ai1ec-active' );
			if ( ! $( this ).attr( 'data-ai1ec-gmaps' ) ) {
				gMapsLoader( init_gmaps );
				$( this ).attr( 'data-ai1ec-gmaps', 1 )
			}
			
			return false;
		} );

	};

	var start = function() {
		domReady( function(){
			// Set the active tab
			utils.activate_saved_tab_on_page_load( $.cookie( 'feeds_active_tab' ) );
			// Attach the event handlers
			attach_event_handlers();
			// Init suggested events handlers;
			init_suggested_events();
		} );
	};

	return {
		start: start
	};
} );

/*global YT:true*/
define(
	[
		"jquery_timely",
		"domReady",
		"ai1ec_config",
		"scripts/common_scripts/backend/common_event_handlers",
		"external_libs/Placeholders",
		"external_libs/bootstrap/tooltip",
		"external_libs/bootstrap/popover",
		"external_libs/bootstrap/modal",
		"external_libs/bootstrap/dropdown"
	],

	function( $, domReady, ai1ec_config, event_handlers ) {

	"use strict"; // jshint ;_;

	var add_export_to_facebook = function() {
		// When we have select the "Show only events that can be exported to
		// facebook" filter and when there are rows in the table
		if (
			$( '#ai1ec-facebook-filter option[value=exportable]:selected' ).length > 0 &&
			$( 'table.wp-list-table tr.no-items' ).length === 0 &&
			ai1ec_config.facebook_logged_in === "1"
		) {
			// Add the bulk action to the selects
			$( '<option>' ).val( 'export-facebook' ).text( "Export to facebook" )
				.appendTo( "select[name='action']" );
			$( '<option>' ).val( 'export-facebook' ).text( "Export to facebook" )
				.appendTo( "select[name='action2']" );
		}
	};

	var handle_platform_mode = function() {
		if( ai1ec_config.platform_active === "1" ) {
			// Hide certain menu links from Events menu (Settings, Themes,
			// Theme Options). If any of them are active, activate their duplicate
			// ones in the other locations.
			$( '#menu-posts-ai1ec_event li' ).each( function() {
				var $li = $( this );
				if ( $li.has( 'a[href$="all-in-one-event-calendar-themes"], ' +
				              'a[href$="all-in-one-event-calendar-edit-css"], ' +
				              'a[href$="all-in-one-event-calendar-settings"]' ).length ) {
					if ( $li.is( '.current' ) ) {
						var url = $( 'a', $li ).attr( 'href' );
						// Find this menu item's duplicate menu item and activate it.
						$( '#adminmenu a:not(.current)[href="' + url + '"]' ) // <a>
							.parent()                                           // <li>
								.andSelf()                                        // <li> + <a>
									.addClass( 'current' )
								.end()                                            // <li>
								.closest( 'li.menu-top' )             // parent menu <li>
								  .find( '> a.menu-top' )             // parent menu <li>'s <a>
								    .andSelf()                        // parent menu <li> + its <a>
								  .addClass( 'wp-has-current-submenu wp-menu-open' )
								  .removeClass( 'wp-not-current-submenu' );
						// Deactivate this menu item's parent menu.
						$li.closest( 'li.menu-top' )
							.find( '> a.menu-top' )
							.andSelf()
							.removeClass( 'wp-has-current-submenu wp-menu-open' )
							.addClass( 'wp-not-current-submenu' );
					}
					// Finally, hide this menu item altogether.
					$li.hide();
				}
			});
			// Make changes to the WordPress Settings > Reading page.
			if( $( 'body.options-reading-php' ).length ) {
				var disable_front_page_option = function() {
					$( '#page_on_front' ).attr( 'disabled', 'disabled' );
				};
				disable_front_page_option();
				$( '#front-static-pages input:radio' )
					.change( disable_front_page_option );
				$( '#page_on_front' ).after(
					'<span class="description">' +
					ai1ec_config.page_on_front_description +
					'</span>'
				);
			}
			// In strict mode, aggressively remove elements from the admin interface.
			if( ai1ec_config.strict_mode === "1" ) {
				$( '#dashboard-widgets .postbox' )
					.not( '#ai1ec-calendar-tasks, #dashboard_right_now' )
					.remove();
				$( '#adminmenu > li' )
					.not(
						'.wp-menu-separator, #menu-dashboard, #menu-posts-ai1ec_event, ' +
						'#menu-media, #menu-appearance, #menu-users, #menu-settings'
					).remove();
				$( '#menu-appearance > .wp-submenu li, #menu-settings > .wp-submenu li' )
					.not( ':has(a[href*="all-in-one-event-calendar"])' )
					.remove();
			}
		}
	};

	var initialize_modal_video = function() {
		if ( $( '#ai1ec-video' ).length ) {
			// TODO: Load YouTube IFrame Player API async using requirejs (right?)
			// TODO: Separate event handlers into common_event_handlers.js. Tried this
			// already and had difficulties; maybe the Bootstrap modal code wasn't
			// initialized yet? Weird error messages.

			// Load the YouTube IFrame Player API code asynchronously.
			$.ajax({
				cache : true,
				async : true,
				dataType : 'script',
				url : '//www.youtube.com/iframe_api'
			});

			// Create an <iframe> (and YouTube player) after the API code downloads.
			window.onYouTubeIframeAPIReady = function() {
				var player = new YT.Player( 'ai1ec-video', {
					height: '368',
					width: '600',
					videoId: window.ai1ecVideo.youtubeId
				});
				$( '#ai1ec-video' ).css( 'display', 'block' );

				$( '#ai1ec-video-modal' ).on( 'hide', function() {
					player.stopVideo();
				} );
			};
		}
	};

	var attach_event_handlers_backend = function() {
		$( document )
			.on( 'click', '.ai1ec-facebook-cron-dismiss-notification',
				event_handlers.dismiss_plugins_messages_handler )
			.on( 'click', '.ai1ec-dismiss-notification',
				event_handlers.dismiss_notification_handler )
			.on( 'click', '.ai1ec-dismiss-intro-video',
				event_handlers.dismiss_intro_video_handler )
			.on( 'click', '.ai1ec-dismiss-license-warning',
				event_handlers.dismiss_license_warning_handler )
			.on( 'click', '.ai1ec-limit-by-cat, .ai1ec-limit-by-tag, .ai1ec-limit-by-event',
				event_handlers.handle_multiselect_containers_widget_page )
			.on( 'click', '.ai1ec-dismissable', function() {
				var data = {
					action : 'ai1ec_dismiss_notice',
					key    : $( this ).data( 'key' )
				};
				var button = this;
				$.post( ajaxurl, data, function( response ) {
					$( button ).closest( '.ai1ec-message' ).remove();
				} );
			} );

			$( document ).on( 'click', '.ai1ec-alert-trigger',
				event_handlers.handle_alert_click );

	};

	/**
	 * Initialize any popovers & tooltips required on the page.
	 */
	var initialize_popovers = function() {
		// Popovers in Support box (if present) need to be initialized specially.
		$( '#ai1ec-support .ai1ec-download a[title]' ).popover( {
			placement: 'left'
		} );
		// Initialize any tooltips.
		$( '.ai1ec-tooltip-toggle' ).tooltip( { container: 'body' } );
	};

	var category_header = function() {
		var
			$header = $( '.ai1ec-taxonomy-header' ),
			$edit   = $( '.ai1ec-taxonomy-edit-link' ),
			active_tab;

		if ( $header.length ) {
			// Move and display edit button if not editing a term.
			if ( ! $( 'form#edittag' ).length ) {
				$edit
					.removeClass( 'ai1ec-hide' )
					.appendTo( '.wrap > h2:first' );
			}
			// Move tabs to correct location and display them.
			$(  '.wrap' ).prepend( $header.removeClass( 'ai1ec-hide' ) );
			// Activate tab if none is active.
			if ( ! $header.find( 'li.ai1ec-active' ).length ) {
				active_tab = $( '[data-ai1ec_active_tab]' ).data( 'ai1ec_active_tab' );
				if ( active_tab ) {
					$( active_tab ).addClass( 'ai1ec-active' );
				}
			}
			// Highlight the Organize menu item.
			$( '#menu-posts-ai1ec_event a[href="edit-tags.php?taxonomy=events_categories&post_type=ai1ec_event"]' )
				.closest( 'li' )
				.addClass( 'current' );
		}
	};

	var start = function() {
		domReady( function() {
			// Attach the export to Facebook functionality.
			add_export_to_facebook();
			// place cateogry header
			category_header();
			// Initialize modal video if present.
			initialize_modal_video();
			// Attach the event handlers.
			attach_event_handlers_backend();
			// Handle event platform mode.
			handle_platform_mode();
			// Initialize any popovers.
			initialize_popovers();
		} );
	};

	return {
		start : start
	};
} );

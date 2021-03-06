define(
	[
		"jquery_timely",
		"external_libs/bootstrap/tab"
	],
	function( $ ) {

	"use strict"; // jshint ;_;

	var AI1EC_UTILS = function() {
			// We just return an object. This is useful if we ever need to define some
			// private variables.
			return {

				/**
				 * check if a number is float
				 *
				 * @param the value to check
				 *
				 * @return boolean true if the value is float, false if it's not
				 */
				"is_float": function( n ) {
					return ! isNaN( parseFloat( n ) );
				},

				/**
				 * check if the value is a valid coordinate
				 *
				 * @param mixed the value to check
				 *
				 * @param boolean true if we are validating latitude
				 *
				 * @return boolean true if the value is a valid coordinate
				 */
				"is_valid_coordinate": function( n, is_latitude ) {
					// Longitude is valid between +180 and -180 while Latitude is valid
					// between +90 an -90
					var max_value = is_latitude ? 90 : 180;
					return this.is_float( n ) && Math.abs( n ) < max_value;
				},

				/**
				 * Converts all the commas to dots so that the value can be used as a
				 * float
				 */
				"convert_comma_to_dot": function( value ) {
					return value.replace( ',', '.' );
				},

				/**
				 * Check if a field has a value.
				 *
				 * @param string id, the id of the element to check
				 *
				 * @return boolean Whether the fields has a value or not
				 */
				"field_has_value": function( id ) {
					var selector = '#' + id;
					var $field = $( selector );
					var has_value = false;
					// Check if the field was found. If it's not found we treat it as
					// having no value.
					if( $field.length === 1 ) {
						has_value = $.trim( $field.val() ) !== '';
					}
					return has_value;
				},

				/**
				 * Create a twitter bootstrap alert
				 *
				 * @param text the text of the message
				 *
				 * @param type the type of the message
				 *
				 * @return the alert, ready to be inserted in the DOM
				 *
				 */
				"make_alert": function( text, type, hide_close_button ) {
					var alert_class = '';
					switch (type) {
						case 'error'  : alert_class = 'ai1ec-alert ai1ec-alert-danger';
							break;
						case 'success': alert_class = 'ai1ec-alert ai1ec-alert-success';
							break;
						default: alert_class = 'ai1ec-alert ai1ec-alert-info';
							break;
					}
					// Create the alert
					var $alert = $( '<div />', {
						"class" : alert_class,
						"html"  : text
					} );
					if ( ! hide_close_button ) {
						// Create the close button
						var $close = $( '<button>', {
							"type"         : "button",
							"class"        : "ai1ec-close",
							"data-dismiss" : "ai1ec-alert",
							"text"         : "×"
						} );
						// Prepend the close button to the alert.
						$alert.prepend( $close );
					}
					return $alert;
				},
				"alert": function( popupTitle, popupContent ) {
					$document       = $( document.body );
					$one_shot_popup = $( '#ai1ec-show-popup-alert', $document );
					if ( 0 === $one_shot_popup.length ) {
						$div = $( '<div class="timely"/>' );
						$div.html(
							'<div id="ai1ec-show-popup-alert" class="timely ai1ec-modal ai1ec-fade"' +
								'role="dialog" aria-hidden="true" style="display: none;">' +
								'<div class="ai1ec-modal-dialog">' +
									'<div class="ai1ec-modal-content">' +
										'<div class="ai1ec-modal-header">' +
											'<button type="button" class="ai1ec-close"' +
												'data-dismiss="ai1ec-modal" aria-hidden="true">×</button>' +
											'<h4 class="ai1ec-modal-title" id="ai1ec-one-shot-popup-title"></h4>' +
										'</div>' +
										'<div class="ai1ec-modal-body">' +
											'<p id="ai1ec-one-shot-popup-text">'
											+ '</p>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>'
						 ).appendTo( $document );
						$one_shot_popup = $( '#ai1ec-show-popup-alert', $document );
					}					
					var $link = $( this ).closest( 'a' );
					$( '#ai1ec-one-shot-popup-title', $one_shot_popup ).text( popupTitle );
					$( '#ai1ec-one-shot-popup-text', $one_shot_popup ).text( popupContent );
					$one_shot_popup.modal( 'show' );
				},
				/**
				 * Create a twitter bootstrap popup
				 *
				 * @param linkText the text to show in the link that will open the popup
				 *
				 * @param type the type of the message
				 *
				 * @return the alert, ready to be inserted in the DOM
				 *
				 */
				"make_popup_content_link": function( linkText, popupTitle, popupContent ) {
					return '<div class="timely">' +
						'<a href="#" ' +
							'class="timely ai1ec-link"' +
							'data-toggle="ai1ec-modal" data-target="#popupMoreInfoInline">'
								+ $( '<div />' ).text( linkText ).html() + '</a>' +
						'<div id="popupMoreInfoInline" class="timely ai1ec-modal ai1ec-fade"' +
							'role="dialog" aria-hidden="true" style="display: none;">' +
							'<div class="ai1ec-modal-dialog">' +
								'<div class="ai1ec-modal-content">' +
									'<div class="ai1ec-modal-header">' +
										'<button type="button" class="ai1ec-close"' +
											'data-dismiss="ai1ec-modal" aria-hidden="true">×</button>' +
										'<strong>' + $( '<div />' ).text( popupTitle ).html() + '</strong>' +
									'</div>' +
									'<div class="ai1ec-modal-body ai1ec-clearfix">' +
										'<textarea class="ai1ec-form-control code" rows="8" cols="40">'
											+ $( '<div />' ).text( popupContent ).html()
										+ '</textarea>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
				},

				/**
				 * Define the ajax url. If undefined we hardcode a value. This is needed
				 * for testing purpose only because in the testing environment the
				 * variable ajaxurl is undefined.
				 */
				"get_ajax_url": function() {
					if( typeof window.ajaxurl === "undefined" ) {
						return "http://localhost/wordpress/wp-admin/admin-ajax.php";
					} else {
						return window.ajaxurl;
					}
				},

				/**
				 * isUrl checks to see if the passed parameter is a valid url
				 * and returns true on access and false on failure
				 *
				 * @param String s String to validate
				 *
				 * @return boolean True if the string is a valid url, false otherwise
				 */
				 "isUrl" : function( s ) {
					var regexp = /(http|https|webcal):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
					return regexp.test(s);
				},

				/**
				 * isUrl checks to see if the passed parameter is a valid url
				 * and returns true on access and false on failure
				 *
				 * @param String s String to validate
				 *
				 * @return boolean True if the string is a valid url, false otherwise
				 */
				"isValidUrl" : function( s, requires_protocol ) {
					if ( true === requires_protocol ) {
						var urlPattern = /^(http|https):\/\//;	
						return urlPattern.test( s ); 
					} else {
						return true;
					}
				},

				/**
				 * isValidEmail checks if the mail passed is valid.
				 *
				 * @param email string
				 * @returns boolean
				 */
				"isValidEmail" : function( email ) {
					var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test( email );
				},

				/**
				 * activates the passed tab or the first one if no tab is passed.
				 *
				 * @param active_tab
				 * @returns
				 */
				activate_saved_tab_on_page_load : function( active_tab ) {
					if ( null === active_tab || undefined === active_tab ){
						// Activate the first tab
						$( 'ul.ai1ec-nav a:first' ).tab( 'show' );
					} else {
						// Activate the correct tab
						$( 'ul.ai1ec-nav a[href=' + active_tab + ']' ).tab( 'show' );
					}
				},
				/**
				 * Adds the argument to the url. Just one argument for now
				 *
				 * @param url  string the url to add arguments to
				 * @param args array
				 *
				 */
				add_query_arg :  function( url, args ) {
					if ( 'string' !== typeof url ) return false;
					var char = url.indexOf( '?' ) === -1 ? '?' : '&';
					if ( -1 !== url.indexOf( char + args[0] + '=' ) ) {
						return url;
					}
					return url + char + args[0] + '=' + args[1];
				},
				/**
				 * Makes a string from element's attributes.
				 *
				 * @param el object DOM object.
				 *
				 * @return string Concatenated attributes.
				 */
				create_ai1ec_to_send : function( el ) {
					var
						$el         = $( el ),
						params      = [],
						attrs       = [
							'action',
							'cat_ids',
							'auth_ids',
							'tag_ids',
							'exact_date',
							'display_filters',
							'no_navigation',
							'events_limit'
						];

					// Add data attributes.
					$el.each( function() {
						$.each( this.attributes, function() {
							// Add if it's specified in the array or is a filter attribute.
							if (
								this.specified &&
								this.value &&
								this.name.match( /^data-/ ) && (
									-1 < $.inArray( this.name.replace( /^data\-/, '' ), attrs ) ||
									this.name.match( /_ids$/ )
								)
							) {
								params.push( this.name.replace( /^data\-/, '' ) + '~' + this.value );
							}
						} );
					} );
					return params.join( '|' );
				},
				/**
				 * Enables autoselection of text for .ai1ec-autoselect
				 */
				init_autoselect : function() {
					// Select the text when element is clicked (only once).
					$( document ).on( 'click', '.ai1ec-autoselect', function( e ) {
						// Lets do it only once. Perhaps, user wants to select just a part.
						if ( $( this ).data( 'clicked' ) && e.originalEvent.detail < 2 ) {
							return;
						} else {
							$( this ).data( 'clicked' , true );
						}
						// Working with the text selection depending on the browser abilities.
						var range;
						if ( document.body.createTextRange ) {
							range = document.body.createTextRange();
							range.moveToElementText( this );
							range.select();
						} else if ( window.getSelection ) {
							selection = window.getSelection();
							range = document.createRange();
							range.selectNodeContents( this );
							selection.removeAllRanges();
							selection.addRange( range );
						}
					});
				}
			};
	}();

	return AI1EC_UTILS;
} );

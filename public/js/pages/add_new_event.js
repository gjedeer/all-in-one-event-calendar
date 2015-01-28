
/**
 * @license RequireJS domReady 2.0.0 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
/*jslint */
/*global require: false, define: false, requirejs: false,
  window: false, clearInterval: false, document: false,
  self: false, setInterval: false */


timely.define('domReady',[],function () {
    

    var isBrowser = typeof window !== "undefined" && window.document,
        isPageLoaded = !isBrowser,
        doc = isBrowser ? document : null,
        readyCalls = [],
        isTop, testDiv, scrollIntervalId;

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i++) {
            callbacks[i](doc);
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (isPageLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            callReady();
        }
    }

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", pageLoaded, false);
            window.addEventListener("load", pageLoaded, false);
        } else if (window.attachEvent) {
            window.attachEvent("onload", pageLoaded);

            testDiv = document.createElement('div');
            try {
                isTop = window.frameElement === null;
            } catch(e) {}

            //DOMContentLoaded approximation that uses a doScroll, as found by
            //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
            //but modified by other contributors, including jdalton
            if (testDiv.doScroll && isTop && window.external) {
                scrollIntervalId = setInterval(function () {
                    try {
                        testDiv.doScroll();
                        pageLoaded();
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. Latest webkit browsers also use "interactive", and
        //will fire the onDOMContentLoaded before "interactive" but not after
        //entering "interactive" or "complete". More details:
        //http://dev.w3.org/html5/spec/the-end.html#the-end
        //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
        if (document.readyState === "complete" ||
            document.readyState === "interactive") {
            pageLoaded();
        }
    }

    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function domReady(callback) {
        if (isPageLoaded) {
            callback(doc);
        } else {
            readyCalls.push(callback);
        }
        return domReady;
    }

    domReady.version = '2.0.0';

    /**
     * Loader Plugin API method
     */
    domReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            domReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return domReady;
});

/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


timely.define('external_libs/bootstrap/tab', ["jquery_timely"], function( $ ) {  // jshint ;_;

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.ai1ec-dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('ai1ec-active')) return

    var previous = $ul.find('.ai1ec-active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .ai1ec-active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('ai1ec-fade')

    function next() {
      $active
        .removeClass('ai1ec-active')
        .find('> .ai1ec-dropdown-menu > .ai1ec-active')
        .removeClass('ai1ec-active')

      element.addClass('ai1ec-active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('ai1ec-in')
      } else {
        element.removeClass('ai1ec-fade')
      }

      if (element.parent('.ai1ec-dropdown-menu')) {
        element.closest('li.ai1ec-dropdown').addClass('ai1ec-active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('ai1ec-in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="ai1ec-tab"], [data-toggle="ai1ec-pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

} );

timely.define('libs/utils',
	[
		"jquery_timely",
		"external_libs/bootstrap/tab"
	],
	function( $ ) {

	 // jshint ;_;

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
						default: alert_class = 'ai1ec-alert';
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
						],
						dashToCamel = function( str ) {
							return str.replace( /\W+(.)/g, function ( x, chr ) {
								return chr.toUpperCase();
							} );
						};

					$( attrs ).each( function( i, item ) {
						var value = $el.data( dashToCamel( item ) );
						value && params.push( item + '~' + value );
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

timely.define('scripts/add_new_event/event_location/input_coordinates_utility_functions',
		[
		 "jquery_timely",
		 "ai1ec_config",
		 "libs/utils"
		 ],
		 function( $, ai1ec_config, AI1EC_UTILS ) {
	 // jshint ;_;
			/**
			 *
			 * converts commas to dots as in some regions (Europe for example) floating point numbers are defined with a comma instead of a dot
			 *
			 */
			var ai1ec_convert_commas_to_dots_for_coordinates = function() {
				if ( $( '#ai1ec_input_coordinates:checked' ).length > 0 ) {
					$( '#ai1ec_table_coordinates input.coordinates' ).each( function() {
						this.value = AI1EC_UTILS.convert_comma_to_dot( this.value );
					} );
				}
			};
			/**
			 * Shows the error message after the field
			 *
			 * @param Object the dom element after which we put the error
			 *
			 * @param the error message
			 *
			 */
			var ai1ec_show_error_message_after_element = function( el, error_message ) {
				// Create the element to append in case of error
				var error = $( '<div />',
						{
							"text" : error_message,
							"class" : "ai1ec-error"
						}
				);
				// Insert error message
				$( el ).after( error );
			};
			/**
			 * INTERNAL FUNCTION (not exported)
			 * prevent default actions and stop immediate propagation if the publish button was clicked and
			 * gives focus to the passed element
			 *
			 * @param Object the event object
			 *
			 * @param Object the element to focus
			 *
			 */
			var ai1ec_prevent_actions_and_focus_on_errors = function( e, el ) {
				// If the validation was triggered  by clicking publish
				if ( e.target.id === 'post' ) {
					// Prevent other events from firing
					e.stopImmediatePropagation();
					// Prevent the submit
					e.preventDefault();
					// Just in case, hide the ajax spinner and remove the disabled status
					$( '#publish' ).removeClass( 'button-primary-disabled' );
					$( '#publish' ).siblings( '.spinner' ).css( 'visibility', 'hidden' );
					
				}
				// Focus on the first field that has an error
				$( el ).focus();
			};
			/**
			 * Check if either the coordinates or the address are set
			 *
			 * @returns boolean true if at least one is set between the address and both coordinates
			 */
			var check_if_address_or_coordinates_are_set = function() {
				var address_set = AI1EC_UTILS.field_has_value( 'ai1ec_address' );
				var lat_long_set = true;
				$( '.coordinates' ).each( function() {
					var is_set = AI1EC_UTILS.field_has_value( this.id );
					if ( ! is_set ) {
						lat_long_set = false;
					}
				} );
				return address_set || lat_long_set;
			};
			/**
			 * check that both latitude and longitude are not empty when publishing an event if the "Input coordinates" check-box
			 * is checked
			 *
			 * @param Object the event object
			 *
			 * @returns boolean true if the check is ok, false otherwise
			 *
			 */
			var ai1ec_check_lat_long_fields_filled_when_publishing_event = function( e ) {
				var valid = true;
				// We will save the first non valid field in this variable so whe can focus
				var first_not_valid = false;
				if ( $( '#ai1ec_input_coordinates:checked' ).length > 0 ) {
					// Clean up old error messages
					$( 'div.ai1ec-error' ).remove();
					$( '#ai1ec_table_coordinates input.coordinates' ).each( function() {
						// Check if we are validating latitude or longitude
						var latitude = $( this ).hasClass( 'latitude' );
						// Get the correct error message
						var error_message = latitude ? ai1ec_config.error_message_not_entered_lat : ai1ec_config.error_message_not_entered_long;
						if ( this.value === '' ) {
							valid = false;
							if( first_not_valid === false ) {
								first_not_valid = this;
							}
							ai1ec_show_error_message_after_element( this, error_message );
						}
					});
				}
				if ( valid === false ) {
					ai1ec_prevent_actions_and_focus_on_errors( e, first_not_valid );
				}
				return valid;
			};
			/**
			 * checks if latitude and longitude fields are valid and a search can be performed
			 *
			 * @param Object the event object that is passed to the handler function
			 *
			 * @return boolean true if the values are valid and both fields have a value, false otherwise;
			 */
			var ai1ec_check_lat_long_ok_for_search = function( e ) {
				// If the coordinates checkbox is checked
				if ( $( '#ai1ec_input_coordinates:checked' ).length === 1 ) {
					// Clean up old error messages
					$( 'div.ai1ec-error' ).remove();
					var valid = true;
					// We will save the first non valid field in this variable so whe can focus
					var first_not_valid = false;
					// If a field is empty, we will return false so that the map is not updated.
					var at_least_one_field_empty = false;
					// Let's iterate over the coordinates.
					$( '#ai1ec_table_coordinates input.coordinates' ).each( function() {
						if ( this.value === '' ) {
							at_least_one_field_empty = true;
							return;
						}
						// Check if we are validating latitude or longitude
						var latitude = $( this ).hasClass( 'latitude' );
						// Get the correct error message
						var error_message = latitude ? ai1ec_config.error_message_not_valid_lat : ai1ec_config.error_message_not_valid_long;
						// Check if the coordinate is valid.
						if( ! AI1EC_UTILS.is_valid_coordinate( this.value, latitude ) ) {
							valid = false;
							// Save the elements so that we can focus later
							if ( first_not_valid === false ) {
								first_not_valid = this;
							}
							ai1ec_show_error_message_after_element( this, error_message );
						}
					});
					// Check if there are errors
					if ( valid === false ) {
						ai1ec_prevent_actions_and_focus_on_errors( e, first_not_valid );
					}
					if ( at_least_one_field_empty === true ) {
						valid = false;
					}
					return valid;
				}
			};
			return {
				ai1ec_convert_commas_to_dots_for_coordinates             : ai1ec_convert_commas_to_dots_for_coordinates,
				ai1ec_show_error_message_after_element                   : ai1ec_show_error_message_after_element,
				check_if_address_or_coordinates_are_set                  : check_if_address_or_coordinates_are_set,
				ai1ec_check_lat_long_fields_filled_when_publishing_event : ai1ec_check_lat_long_fields_filled_when_publishing_event,
				ai1ec_check_lat_long_ok_for_search                       : ai1ec_check_lat_long_ok_for_search
			};
} );
timely.define('external_libs/jquery.autocomplete_geomod', 
		[
		 "jquery_timely"
		 ],
function( $ ) {
	
	$.fn.extend({
		autocomplete: function(urlOrData, options) {
			var isUrl = typeof urlOrData == "string";
			options = $.extend({}, $.Autocompleter.defaults, {
				url: isUrl ? urlOrData : null,
				data: isUrl ? null : urlOrData,
				delay: isUrl ? $.Autocompleter.defaults.delay : 10,
				max: options && !options.scroll ? 10 : 150
			}, options);
			
			// if highlight is set to false, replace it with a do-nothing function
			options.highlight = options.highlight || function(value) { return value; };
			
			// if the formatMatch option is not specified, then use formatItem for backwards compatibility
			options.formatMatch = options.formatMatch || options.formatItem;
			
			return this.each(function() {
				new $.Autocompleter(this, options);
			});
		},
		result: function(handler) {
			return this.bind("result", handler);
		},
		search: function(handler) {
			return this.trigger("search", [handler]);
		},
		flushCache: function() {
			return this.trigger("flushCache");
		},
		setOptions: function(options){
			return this.trigger("setOptions", [options]);
		},
		unautocomplete: function() {
			return this.trigger("unautocomplete");
		}
	});

	$.Autocompleter = function(input, options) {

		var KEY = {
			UP: 38,
			DOWN: 40,
			DEL: 46,
			TAB: 9,
			RETURN: 13,
			ESC: 27,
			COMMA: 188,
			PAGEUP: 33,
			PAGEDOWN: 34,
			BACKSPACE: 8
		};

		// Create $ object for input element
		var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

		var timeout;
		var previousValue = "";
		var cache = $.Autocompleter.Cache(options);
		var hasFocus = 0;
		var lastKeyPressCode;
		var isOpera = navigator.userAgent.match(/opera/i)
		var config = {
			mouseDownOnSelect: false
		};
		var select = $.Autocompleter.Select(options, input, selectCurrent, config);
		
		var blockSubmit;
		
		// prevent form submit in opera when selecting with return key
		isOpera && $(input.form).bind("submit.autocomplete", function() {
			if (blockSubmit) {
				blockSubmit = false;
				return false;
			}
		});
		
		// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
		$input.bind((isOpera ? "keypress" : "keydown") + ".autocomplete", function(event) {
			// a keypress means the input has focus
			// avoids issue where input had focus before the autocomplete was applied
			hasFocus = 1;
			// track last key pressed
			lastKeyPressCode = event.keyCode;
			switch(event.keyCode) {
			
				case KEY.UP:
					event.preventDefault();
					if ( select.visible() ) {
						select.prev();
					} else {
						onChange(0, true);
					}
					break;
					
				case KEY.DOWN:
					event.preventDefault();
					if ( select.visible() ) {
						select.next();
					} else {
						onChange(0, true);
					}
					break;
					
				case KEY.PAGEUP:
					event.preventDefault();
					if ( select.visible() ) {
						select.pageUp();
					} else {
						onChange(0, true);
					}
					break;
					
				case KEY.PAGEDOWN:
					event.preventDefault();
					if ( select.visible() ) {
						select.pageDown();
					} else {
						onChange(0, true);
					}
					break;
				
				// matches also semicolon
				case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
				case KEY.TAB:
				case KEY.RETURN:
					if( selectCurrent() ) {
						// stop default to prevent a form submit, Opera needs special handling
						event.preventDefault();
						blockSubmit = true;
						return false;
					}
					break;
					
				case KEY.ESC:
					select.hide();
					break;
					
				default:
					clearTimeout(timeout);
					timeout = setTimeout(onChange, options.delay);
					break;
			}
		}).focus(function(){
			// track whether the field has focus, we shouldn't process any
			// results if the field no longer has focus
			hasFocus++;
		}).blur(function() {
			hasFocus = 0;
			if (!config.mouseDownOnSelect) {
				hideResults();
			}
		}).click(function() {
			// show select when clicking in a focused field
			if ( hasFocus++ > 1 && !select.visible() ) {
				onChange(0, true);
			}
		}).bind("search", function() {
			// TODO why not just specifying both arguments?
			var fn = (arguments.length > 1) ? arguments[1] : null;
			function findValueCallback(q, data) {
				var result;
				if( data && data.length ) {
					for (var i=0; i < data.length; i++) {
						if( data[i].result.toLowerCase() == q.toLowerCase() ) {
							result = data[i];
							break;
						}
					}
				}
				if( typeof fn == "function" ) fn(result);
				else $input.trigger("result", result && [result.data, result.value]);
			}
			$.each(trimWords($input.val()), function(i, value) {
				request(value, findValueCallback, findValueCallback);
			});
		}).bind("flushCache", function() {
			cache.flush();
		}).bind("setOptions", function() {
			$.extend(options, arguments[1]);
			// if we've updated the data, repopulate
			if ( "data" in arguments[1] )
				cache.populate();
		}).bind("unautocomplete", function() {
			select.unbind();
			$input.unbind();
			$(input.form).unbind(".autocomplete");
		});
		
		
		function selectCurrent() {
			var selected = select.selected();
			if( !selected )
				return false;
			
			var v = selected.result;
			previousValue = v;
			
			if ( options.multiple ) {
				var words = trimWords($input.val());
				if ( words.length > 1 ) {
					var seperator = options.multipleSeparator.length;
					var cursorAt = $(input).selection().start;
					var wordAt, progress = 0;
					$.each(words, function(i, word) {
						progress += word.length;
						if (cursorAt <= progress) {
							wordAt = i;
							return false;
						}
						progress += seperator;
					});
					words[wordAt] = v;
					// TODO this should set the cursor to the right position, but it gets overriden somewhere
					//$.Autocompleter.Selection(input, progress + seperator, progress + seperator);
					v = words.join( options.multipleSeparator );
				}
				v += options.multipleSeparator;
			}
			
			$input.val(v);
			hideResultsNow();
			$input.trigger("result", [selected.data, selected.value]);
			return true;
		}
		
		function onChange(crap, skipPrevCheck) {
			if( lastKeyPressCode == KEY.DEL ) {
				select.hide();
				return;
			}
			
			var currentValue = $input.val();
			
			if ( !skipPrevCheck && currentValue == previousValue )
				return;
			
			previousValue = currentValue;
			
			currentValue = lastWord(currentValue);
			if ( currentValue.length >= options.minChars) {
				$input.addClass(options.loadingClass);
				if (!options.matchCase)
					currentValue = currentValue.toLowerCase();
				request(currentValue, receiveData, hideResultsNow);
			} else {
				stopLoading();
				select.hide();
			}
		};
		
		function trimWords(value) {
			if (!value)
				return [""];
			if (!options.multiple)
				return [$.trim(value)];
			return $.map(value.split(options.multipleSeparator), function(word) {
				return $.trim(value).length ? $.trim(word) : null;
			});
		}
		
		function lastWord(value) {
			if ( !options.multiple )
				return value;
			var words = trimWords(value);
			if (words.length == 1) 
				return words[0];
			var cursorAt = $(input).selection().start;
			if (cursorAt == value.length) {
				words = trimWords(value)
			} else {
				words = trimWords(value.replace(value.substring(cursorAt), ""));
			}
			return words[words.length - 1];
		}
		
		// fills in the input box w/the first match (assumed to be the best match)
		// q: the term entered
		// sValue: the first matching result
		function autoFill(q, sValue){
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			// if the last user key pressed was backspace, don't autofill
			if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
				// fill in the value (keep the case the user has typed)
				$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
				// select the portion of the value not typed by the user (so the next character will erase)
				$(input).selection(previousValue.length, previousValue.length + sValue.length);
			}
		};

		function hideResults() {
			clearTimeout(timeout);
			timeout = setTimeout(hideResultsNow, 200);
		};

		function hideResultsNow() {
			var wasVisible = select.visible();
			select.hide();
			clearTimeout(timeout);
			stopLoading();
			if (options.mustMatch) {
				// call search and run callback
				$input.search(
					function (result){
						// if no value found, clear the input box
						if( !result ) {
							if (options.multiple) {
								var words = trimWords($input.val()).slice(0, -1);
								$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
							}
							else {
								$input.val( "" );
								$input.trigger("result", null);
							}
						}
					}
				);
			}
		};

		function receiveData(q, data) {
			if ( data && data.length && hasFocus ) {
				stopLoading();
				select.display(data, q);
				autoFill(q, data[0].value);
				select.show();
			} else {
				hideResultsNow();
			}
		};

		function request(term, success, failure) {
			if (!options.matchCase)
				term = term.toLowerCase();
			var data = cache.load(term);
			// recieve the cached data
			if (data && data.length) {
				success(term, data);

			// start geo_Autocomplete mod
			// request handler for google geocoder
			} else if (options.geocoder) {
				var _query = lastWord(term);
				var _opts = { 'address': _query };
				if( options.region )
					_opts.region = options.region;
				
				options.geocoder.geocode( _opts, function(_results, _status) {
					var parsed = options.parse(_results, _status, _query);
					cache.add(term, parsed);
					success(term, parsed);
				});
			// end geo_Autocomplete mod
					
			// if an AJAX url has been supplied, try loading the data now
			} else if( (typeof options.url == "string") && (options.url.length > 0) ){
				
				var extraParams = {
					timestamp: +new Date()
				};
				$.each(options.extraParams, function(key, param) {
					extraParams[key] = typeof param == "function" ? param() : param;
				});
							
				$.ajax({
					// try to leverage ajaxQueue plugin to abort previous requests
					mode: "abort",
					// limit abortion to this input
					port: "autocomplete" + input.name,
					dataType: options.dataType,
					url: options.url,
					data: $.extend({
						q: lastWord(term),
						limit: options.max
					}, extraParams),
					success: function(data) {
						var parsed = options.parse && options.parse(data) || parse(data);
						cache.add(term, parsed);
						success(term, parsed);
					}
				});
				
			} else {
				// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
				select.emptyList();
				failure(term);
			}
		};
		
		function parse(data) {
			var parsed = [];
			var rows = data.split("\n");
			for (var i=0; i < rows.length; i++) {
				var row = $.trim(rows[i]);
				if (row) {
					row = row.split("|");
					parsed[parsed.length] = {
						data: row,
						value: row[0],
						result: options.formatResult && options.formatResult(row, row[0]) || row[0]
					};
				}
			}
			return parsed;
		};

		function stopLoading() {
			$input.removeClass(options.loadingClass);
		};

	};

	$.Autocompleter.defaults = {
		inputClass: "ac_input",
		resultsClass: "ac_results",
		loadingClass: "ac_loading",
		minChars: 1,
		delay: 400,
		matchCase: false,
		matchSubset: true,
		matchContains: false,
		cacheLength: 10,
		max: 100,
		mustMatch: false,
		extraParams: {},
		selectFirst: true,
		formatItem: function(row) { return row[0]; },
		formatMatch: null,
		autoFill: false,
		width: 0,
		multiple: false,
		multipleSeparator: ", ",
		highlight: function(value, term) {
			return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
		},
	    scroll: true,
	    scrollHeight: 180
	};

	$.Autocompleter.Cache = function(options) {

		var data = {};
		var length = 0;
		
		function matchSubset(s, sub) {
			if (!options.matchCase) 
				s = s.toLowerCase();
			var i = s.indexOf(sub);
			if (options.matchContains == "word"){
				i = s.toLowerCase().search("\\b" + sub.toLowerCase());
			}
			if (i == -1) return false;
			return i == 0 || options.matchContains;
		};
		
		function add(q, value) {
			if (length > options.cacheLength){
				flush();
			}
			if (!data[q]){ 
				length++;
			}
			data[q] = value;
		}
		
		function populate(){
			if( !options.data ) return false;
			// track the matches
			var stMatchSets = {},
				nullData = 0;

			// no url was specified, we need to adjust the cache length to make sure it fits the local data store
			if( !options.url ) options.cacheLength = 1;
			
			// track all options for minChars = 0
			stMatchSets[""] = [];
			
			// loop through the array and create a lookup structure
			for ( var i = 0, ol = options.data.length; i < ol; i++ ) {
				var rawValue = options.data[i];
				// if rawValue is a string, make an array otherwise just reference the array
				rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;
				
				var value = options.formatMatch(rawValue, i+1, options.data.length);
				if ( value === false )
					continue;
					
				var firstChar = value.charAt(0).toLowerCase();
				// if no lookup array for this character exists, look it up now
				if( !stMatchSets[firstChar] ) 
					stMatchSets[firstChar] = [];

				// if the match is a string
				var row = {
					value: value,
					data: rawValue,
					result: options.formatResult && options.formatResult(rawValue) || value
				};
				
				// push the current match into the set list
				stMatchSets[firstChar].push(row);

				// keep track of minChars zero items
				if ( nullData++ < options.max ) {
					stMatchSets[""].push(row);
				}
			};

			// add the data items to the cache
			$.each(stMatchSets, function(i, value) {
				// increase the cache size
				options.cacheLength++;
				// add to the cache
				add(i, value);
			});
		}
		
		// populate any existing data
		setTimeout(populate, 25);
		
		function flush(){
			data = {};
			length = 0;
		}
		
		return {
			flush: flush,
			add: add,
			populate: populate,
			load: function(q) {
				if (!options.cacheLength || !length)
					return null;
				/* 
				 * if dealing w/local data and matchContains than we must make sure
				 * to loop through all the data collections looking for matches
				 */
				if( !options.url && options.matchContains ){
					// track all matches
					var csub = [];
					// loop through all the data grids for matches
					for( var k in data ){
						// don't search through the stMatchSets[""] (minChars: 0) cache
						// this prevents duplicates
						if( k.length > 0 ){
							var c = data[k];
							$.each(c, function(i, x) {
								// if we've got a match, add it to the array
								if (matchSubset(x.value, q)) {
									csub.push(x);
								}
							});
						}
					}				
					return csub;
				} else 
				// if the exact item exists, use it
				if (data[q]){
					return data[q];
				} else
				if (options.matchSubset) {
					for (var i = q.length - 1; i >= options.minChars; i--) {
						var c = data[q.substr(0, i)];
						if (c) {
							var csub = [];
							$.each(c, function(i, x) {
								if (matchSubset(x.value, q)) {
									csub[csub.length] = x;
								}
							});
							return csub;
						}
					}
				}
				return null;
			}
		};
	};

	$.Autocompleter.Select = function (options, input, select, config) {
		var CLASSES = {
			ACTIVE: "ac_over"
		};
		
		var listItems,
			active = -1,
			data,
			term = "",
			needsInit = true,
			element,
			list;
		
		// Create results
		function init() {
			if (!needsInit)
				return;
			element = $("<div/>")
			.hide()
			.addClass(options.resultsClass)
			.css("position", "absolute")
			.appendTo(document.body);
		
			list = $("<ul/>").appendTo(element).mouseover( function(event) {
				if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
		            active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
				    $(target(event)).addClass(CLASSES.ACTIVE);            
		        }
			}).click(function(event) {
				$(target(event)).addClass(CLASSES.ACTIVE);
				select();
				// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
				input.focus();
				return false;
			}).mousedown(function() {
				config.mouseDownOnSelect = true;
			}).mouseup(function() {
				config.mouseDownOnSelect = false;
			});
			
			if( options.width > 0 )
				element.css("width", options.width);
				
			needsInit = false;
		} 
		
		function target(event) {
			var element = event.target;
			while(element && element.tagName != "LI")
				element = element.parentNode;
			// more fun with IE, sometimes event.target is empty, just ignore it then
			if(!element)
				return [];
			return element;
		}

		function moveSelect(step) {
			listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
			movePosition(step);
	        var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
	        if(options.scroll) {
	            var offset = 0;
	            listItems.slice(0, active).each(function() {
					offset += this.offsetHeight;
				});
	            if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
	                list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
	            } else if(offset < list.scrollTop()) {
	                list.scrollTop(offset);
	            }
	        }
		};
		
		function movePosition(step) {
			active += step;
			if (active < 0) {
				active = listItems.size() - 1;
			} else if (active >= listItems.size()) {
				active = 0;
			}
		}
		
		function limitNumberOfItems(available) {
			return options.max && options.max < available
				? options.max
				: available;
		}
		
		function fillList() {
			list.empty();
			var max = limitNumberOfItems(data.length);
			for (var i=0; i < max; i++) {
				if (!data[i])
					continue;
				var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
				if ( formatted === false )
					continue;
				var li = $("<li/>").html( options.highlight(formatted, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0];
				$.data(li, "ac_data", data[i]);
			}
			listItems = list.find("li");
			if ( options.selectFirst ) {
				listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
				active = 0;
			}
			// apply bgiframe if available
			if ( $.fn.bgiframe )
				list.bgiframe();
		}
		
		return {
			display: function(d, q) {
				init();
				data = d;
				term = q;
				fillList();
			},
			next: function() {
				moveSelect(1);
			},
			prev: function() {
				moveSelect(-1);
			},
			pageUp: function() {
				if (active != 0 && active - 8 < 0) {
					moveSelect( -active );
				} else {
					moveSelect(-8);
				}
			},
			pageDown: function() {
				if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
					moveSelect( listItems.size() - 1 - active );
				} else {
					moveSelect(8);
				}
			},
			hide: function() {
				element && element.hide();
				listItems && listItems.removeClass(CLASSES.ACTIVE);
				active = -1;
			},
			visible : function() {
				return element && element.is(":visible");
			},
			current: function() {
				return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
			},
			show: function() {
				var offset = $(input).offset();
				element.css({
					width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
					top: offset.top + input.offsetHeight,
					left: offset.left
				}).show();
	            if(options.scroll) {
	                list.scrollTop(0);
	                list.css({
						maxHeight: options.scrollHeight,
						overflow: 'auto'
					});
					
	                if(navigator.userAgent.match(/msie/i) && typeof document.body.style.maxHeight === "undefined") {
						var listHeight = 0;
						listItems.each(function() {
							listHeight += this.offsetHeight;
						});
						var scrollbarsVisible = listHeight > options.scrollHeight;
	                    list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );
						if (!scrollbarsVisible) {
							// IE doesn't recalculate width when scrollbar disappears
							listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
						}
	                }
	                
	            }
			},
			selected: function() {
				var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
				return selected && selected.length && $.data(selected[0], "ac_data");
			},
			emptyList: function (){
				list && list.empty();
			},
			unbind: function() {
				element && element.remove();
			}
		};
	};

	$.fn.selection = function(start, end) {
		if (start !== undefined) {
			return this.each(function() {
				if( this.createTextRange ){
					var selRange = this.createTextRange();
					if (end === undefined || start == end) {
						selRange.move("character", start);
						selRange.select();
					} else {
						selRange.collapse(true);
						selRange.moveStart("character", start);
						selRange.moveEnd("character", end);
						selRange.select();
					}
				} else if( this.setSelectionRange ){
					this.setSelectionRange(start, end);
				} else if( this.selectionStart ){
					this.selectionStart = start;
					this.selectionEnd = end;
				}
			});
		}
		var field = this[0];
		if ( field.createTextRange ) {
			var range = document.selection.createRange(),
				orig = field.value,
				teststring = "<->",
				textLength = range.text.length;
			range.text = teststring;
			var caretAt = field.value.indexOf(teststring);
			field.value = orig;
			this.selection(caretAt, caretAt + textLength);
			return {
				start: caretAt,
				end: caretAt + textLength
			}
		} else if( field.selectionStart !== undefined ){
			return {
				start: field.selectionStart,
				end: field.selectionEnd
			}
		}
	};
} );
timely.define('external_libs/geo_autocomplete',
		[
		 "jquery_timely",
		 "external_libs/jquery.autocomplete_geomod"
		 ],
		 function( $ ) {

$.fn.extend({
	geo_autocomplete: function( _geocoder, _options ) {
		options = $.extend({}, $.Autocompleter.defaults, {
			geocoder: _geocoder,
			mapwidth: 100,
			mapheight: 100,
			maptype: 'terrain',
			mapkey: 'ABQIAAAAbnvDoAoYOSW2iqoXiGTpYBT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQNumU68AwGqjbSNF9YO8NokKst8w', // localhost
			mapsensor: false,
			parse: function(_results, _status, _query) {
				var _parsed = [];
				if (_results && _status && _status == 'OK') {
					$.each(_results, function(_key, _result) {
						if (_result.geometry && _result.geometry.viewport) {
							// place is first matching segment, or first segment
							var _place_parts = _result.formatted_address.split(',');
							var _place = _place_parts[0];
							$.each(_place_parts, function(_key, _part) {
								if (_part.toLowerCase().indexOf(_query.toLowerCase()) != -1) {
									_place = $.trim(_part);
									return false; // break
								}
							});
							_parsed.push({
								data: _result,
								value: _place,
								result: _place
							});
						}
					});
				}
				return _parsed;
			},
			formatItem: function(_data, _i, _n, _value) {
				var _src = 'https://maps.google.com/maps/api/staticmap?visible=' +
					_data.geometry.viewport.getSouthWest().toUrlValue() + '|' +
					_data.geometry.viewport.getNorthEast().toUrlValue() +
					'&size=' + options.mapwidth + 'x' + options.mapheight +
					'&maptype=' + options.maptype +
					'&key=' + options.mapkey +
					'&sensor=' + (options.mapsensor ? 'true' : 'false');
				var _place = _data.formatted_address.replace(/,/gi, ',<br/>');
				return '<img src="' + _src + '" width="' + options.mapwidth +
					'" height="' + options.mapheight + '" /> ' + _place +
					'<br clear="both"/>';
			}
		}, _options);

		// if highlight is set to false, replace it with a do-nothing function
		options.highlight = options.highlight || function(value) { return value; };

		// if the formatMatch option is not specified, then use formatItem for backwards compatibility
		options.formatMatch = options.formatMatch || options.formatItem;

		// Add class to hide results until restyled below.
		options.resultsClass = 'ai1ec-geo-ac-results-not-ready';

		return this.each( function() {
			// Schedule polling function the first time the form element is focused.
			// The polling function will check once a second if the results have been
			// shown, and if so, apply markup-based styling to it. Then the function
			// is cancelled.
			$( this ).one( 'focus', function() {
				var interval_id = setInterval(
					function() {
						var $results = $( '.ai1ec-geo-ac-results-not-ready' );
						if ( $results.length ) {
							$results
								.removeClass( 'ai1ec-geo-ac-results-not-ready' )
								.addClass( 'ai1ec-geo-ac-results' )
								.children( 'ul' )
									.addClass( 'ai1ec-dropdown-menu' );
							clearInterval( interval_id );
						}
					},
					500
				);
			} );

			new $.Autocompleter( this, options );
		} );
	}
});

} );

timely.define('scripts/add_new_event/event_location/gmaps_helper',
		[
		 "jquery_timely",
		 'domReady',
		 'ai1ec_config',
		 'scripts/add_new_event/event_location/input_coordinates_utility_functions',
		 'external_libs/jquery.autocomplete_geomod',
		 'external_libs/geo_autocomplete'
		 ],
		function( $, domReady, ai1ec_config, input_utility_functions ) {
	 // jshint ;_;
	// Local Variables (killing those would be even better)
	var ai1ec_geocoder,
	    ai1ec_default_location,
	    ai1ec_myOptions,
	    ai1ec_map,
	    ai1ec_marker,
	    ai1ec_position;

	var gmap_event_listener = function( e ) {
		$( 'input.longitude' ).val( e.latLng.lng() );
		$( 'input.latitude' ).val( e.latLng.lat() );
		// If the checkbox to input coordinates is not checked, trigger the click event on it.
		if( $( '#ai1ec_input_coordinates:checked' ).length === 0 ) {
			$( '#ai1ec_input_coordinates' ).trigger( 'click' );
		}
	};
	var set_position_with_geolocator_if_available = function() {
		// Check if browser supports W3C Geolocation API. Use !! to have a boolean that reflect the truthiness of the original value.
		if ( !! navigator.geolocation ) {
			// Ask the user for his position. If the User denies it or if anything else goes wrong, we just fail silently and keep using our default.
			navigator.geolocation.getCurrentPosition( function( position ) {
				// The callback takes some time bofore it's called, we need to be sure to set the starting position only when no previous position was set.
				// So we check if the coordinates or the address have been set.
				var address_or_coordinates_set = input_utility_functions.check_if_address_or_coordinates_are_set();
				// If they have not been set, we use geolocation data.
				if ( address_or_coordinates_set === false ) {
					var lat = position.coords.latitude;
					var long = position.coords.longitude;
					// Update default location.
					ai1ec_default_location = new google.maps.LatLng( lat, long );
					// Set the marker position.
					ai1ec_marker.setPosition( ai1ec_default_location );
					// Center the Map and adjust the zoom level.
					ai1ec_map.setCenter( ai1ec_default_location );
					ai1ec_map.setZoom( 15 );
					ai1ec_position = position;
				}
			} );
		}
	};
	var set_autocomplete_if_needed = function() {
		if( ! ai1ec_config.disable_autocompletion ) {
			$( '#ai1ec_address' )
				// Initialize geo_autocomplete plugin
				.geo_autocomplete(
					new google.maps.Geocoder(),
					{
						selectFirst: false,
						minChars: 3,
						cacheLength: 50,
						width: 300,
						scroll: true,
						scrollHeight: 330,
						region: ai1ec_config.region
					}
				)
				.result(
					function( _event, _data ) {
						if( _data ) {
							ai1ec_update_address( _data );
						}
					}
				)
				// Each time user changes address field, reformat field and update map.
				.change(
					function() {
						// Position map based on provided address value
						if( $( this ).val().length > 0 ) {
							var address = $( this ).val();

							ai1ec_geocoder.geocode(
								{
									'address': address,
									'region': ai1ec_config.region
								},
								function( results, status ) {
									if( status === google.maps.GeocoderStatus.OK ) {
										ai1ec_update_address( results[0] );
									}
								}
							);
						}
					}
				);
		}
	};
	var init_gmaps = function() {
		/**
		 * Google map setup
		 */
		// If the user is updating an event, initialize the map to the event
		// location, otherwise if the user is creating a new event initialize
		// the map to the whole world
		ai1ec_geocoder = new google.maps.Geocoder();
		//world = map.setCenter(new GLatLng(9.965, -83.327), 1);
		//africa = map.setCenter(new GLatLng(-3, 27), 3);
		//europe = map.setCenter(new GLatLng(47, 19), 3);
		//asia = map.setCenter(new GLatLng(32, 130), 3);
		//south pacific = map.setCenter(new GLatLng(-24, 134), 3);
		//north america = map.setCenter(new GLatLng(50, -114), 3);
		//latin america = map.setCenter(new GLatLng(-20, -70), 3);
		ai1ec_default_location = new google.maps.LatLng( 9.965, -83.327 );
		ai1ec_myOptions = {
			zoom: 0,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: ai1ec_default_location
		};
		domReady( function() {
			// This is mainly for testing purpose but it makes sense in any case, start the work only if there is a container
			if( $( '#ai1ec_map_canvas' ).length > 0 ) {
				// initialize map
				ai1ec_map = new google.maps.Map( $( '#ai1ec_map_canvas' ).get(0), ai1ec_myOptions );
				// Initialize Marker
				ai1ec_marker = new google.maps.Marker({
					map: ai1ec_map,
					draggable: true
				});
				// When the marker is dropped, update the latitude and longitude fields.
				google.maps.event.addListener( ai1ec_marker, 'dragend', gmap_event_listener );
				ai1ec_marker.setPosition( ai1ec_default_location );
				// If the browser supports geolocation, use it
				set_position_with_geolocator_if_available();
				// Start the autocompleter if the user decided to use it
				set_autocomplete_if_needed();
				// Set the map location and show / hide the coordinates
				init_coordinates_visibility();
			}
		} );

	};
	/**
	 * Given a location, update the address field with a reformatted version,
	 * update hidden location fields with address data, and center map on
	 * new location.
	 *
	 * @param object result  single result of a Google geocode() call
	 */
	var ai1ec_update_address = function( result ) {
		ai1ec_map.setCenter( result.geometry.location );
		ai1ec_map.setZoom( 15 );
		ai1ec_marker.setPosition( result.geometry.location );
		$( '#ai1ec_address' ).val( result.formatted_address );
		$( '#ai1ec_latitude' ).val( result.geometry.location.lat() );
		$( '#ai1ec_longitude' ).val( result.geometry.location.lng() );
		// check the checkbox if not checked, we want to store the lat/lng data
		if( ! $( '#ai1ec_input_coordinates' ).is( ':checked' ) ) {
			$( '#ai1ec_input_coordinates' ).click();
		}
		

		var street_number = '',
					street_name = '',
					city = '',
					postal_code = 0,
					country = 0,
					province = '',
					country_short;

		for( var i = 0; i < result.address_components.length; i++ ) {
			switch( result.address_components[i].types[0] ) {
				case 'street_number':
					street_number = result.address_components[i].long_name;
					break;
				case 'route':
					street_name = result.address_components[i].long_name;
					break;
				case 'locality':
					city = result.address_components[i].long_name;
					break;
				case 'administrative_area_level_1':
					province = result.address_components[i].long_name;
					break;
				case 'postal_code':
					postal_code = result.address_components[i].long_name;
					break;
				case 'country':
					country_short = result.address_components[i].short_name;
					country = result.address_components[i].long_name;
					break;
			}
		}
		// Combine street number with street address
		var address = street_number.length > 0 ? street_number + ' ' : '';
		address += street_name.length > 0 ? street_name : '';
		// Clean up postal code if necessary
		postal_code = postal_code !== 0 ? postal_code : '';

		$( '#ai1ec_city' ).val( city );
		$( '#ai1ec_province' ).val( province );
		$( '#ai1ec_postal_code' ).val( postal_code );
		$( '#ai1ec_country' ).val( country );
		$( '#ai1ec_country_short' ).val( country_short );
	};
	/**
	 * Updates the map taking the coordinates from the input fields
	 */
	var ai1ec_update_map_from_coordinates = function() {
		var lat = parseFloat( $( 'input.latitude' ).val() );
		var long = parseFloat( $( 'input.longitude' ).val() );
		var LatLong = new google.maps.LatLng( lat, long );

		ai1ec_map.setCenter( LatLong );
		ai1ec_map.setZoom( 15 );
		ai1ec_marker.setPosition( LatLong );
	};
	var init_coordinates_visibility = function() {
		// If the coordinates checkbox is not checked
		if( $( '#ai1ec_input_coordinates:checked' ).length === 0 ) {
			// Hide the table (i hide things in js for progressive enhancement reasons)
			$( '#ai1ec_table_coordinates' ).css( { visibility : 'hidden' } );
			// Trigger the change event on the address to show the map
			$( '#ai1ec_address' ).change();
		} else {
			// If the checkbox is checked, show the map using the coordinates
			ai1ec_update_map_from_coordinates();
		}
	};
	// This allows another function to access the marker ( if the marker is set ). I mainly use this for testing.
	var get_marker = function() {
		return ai1ec_marker;
	};
	// This allows another function to access the position ( if the position is set ). I mainly use this for testing.
	var get_position = function() {
		return ai1ec_position;
	};
	return {
		init_gmaps                        : init_gmaps,
		ai1ec_update_map_from_coordinates : ai1ec_update_map_from_coordinates,
		get_marker                        : get_marker,
		get_position                      : get_position
	};
} );

timely.define('scripts/add_new_event/event_location/input_coordinates_event_handlers',
	[
		"jquery_timely",
		"scripts/add_new_event/event_location/input_coordinates_utility_functions",
		"scripts/add_new_event/event_location/gmaps_helper",
		"ai1ec_config"
	],
	function( $, input_utility_functions, gmaps_helper, ai1ec_config ) {
	 // jshint ;_;

	// Toggle the visibility of google map on checkbox click
	var toggle_visibility_of_google_map_on_click = function( e ) {
		if( $( this ).is( ':checked' ) ) {
			// show the map
			$( '.ai1ec_box_map' )
				.addClass( 'ai1ec_box_map_visible')
				.hide()
				.slideDown( 'fast' );
		} else {
			// hide the map
			$( '.ai1ec_box_map' ).slideUp( 'fast' );
		}
	};

	// Hide / Show the coordinates table when clicking the checkbox
	var toggle_visibility_of_coordinate_fields_on_click = function( e ) {
		// If the checkbox is checked
		if( this.checked === true ) {
			$( '#ai1ec_table_coordinates' ).css( { visibility : 'visible' } );
		} else {
			// Hide the table
			$( '#ai1ec_table_coordinates' ).css( { visibility : 'hidden' } );
			// Erase the input fields
			$( '#ai1ec_table_coordinates input' ).val( '' );
			// Clean up error messages
			$( 'div.ai1ec-error' ).remove();
		}
	};

	var update_map_from_coordinates_on_blur = function( e ) {
		// Convert commas to dots
		input_utility_functions.ai1ec_convert_commas_to_dots_for_coordinates();
		// Check if the coordinates are valid.
		var valid = input_utility_functions.ai1ec_check_lat_long_ok_for_search( e );
		// If they are valid, update the map.
		if( valid === true ) {
			gmaps_helper.ai1ec_update_map_from_coordinates();
		}
	};

	return {
		"toggle_visibility_of_google_map_on_click"        : toggle_visibility_of_google_map_on_click,
		"toggle_visibility_of_coordinate_fields_on_click" : toggle_visibility_of_coordinate_fields_on_click,
		"update_map_from_coordinates_on_blur"             : update_map_from_coordinates_on_blur
	};
} );

timely.define('scripts/add_new_event/event_date_time/date_time_utility_functions',
	[
		'jquery_timely',
		'ai1ec_config',
		'libs/utils'
	],
	function( $, ai1ec_config, AI1EC_UTILS ) {

	 // jshint ;_;

	var ajaxurl = AI1EC_UTILS.get_ajax_url();

	var repeat_form_success = function( s1, s2, s3, rule, button, response ) {
		$( s1 ).val( rule );

		// Hide the recurrence modal.
		$( '#ai1ec_repeat_box' ).modal( 'hide' );

		var txt = $.trim( $( s2 ).text() );
		if( txt.lastIndexOf( ':' ) === -1 ) {
			txt = txt.substring( 0, txt.length - 3 );
			$( s2 ).text( txt + ':' );
		}
		$(button).attr( 'disabled', false );
		$( s3 ).fadeOut( 'fast', function() {
			$( this ).text( response.message );
			$( this ).fadeIn( 'fast' );
		});
	};

	var repeat_form_error = function( s1, s2, response, button ) {
		$( '#ai1ec_repeat_box .ai1ec-alert-danger' )
			.text( response.message )
			.removeClass( 'ai1ec-hide' );

		$( button ).attr( 'disabled', false );
		$( s1 ).val( '' );
		var txt = $.trim( $( s2 ).text() );
		if( txt.lastIndexOf( '...' ) === -1 ) {
			txt = txt.substring( 0, txt.length - 1 );
			$( s2 ).text( txt + '...' );
		}
		// If there is no text, uncheck the checkbox, otherwise keep it, as the
		// previous rule is still valid.
		if( $( this ).closest( 'tr' ).find( '.ai1ec_rule_text' ).text() === '' ) {
			$( s1 ).siblings( 'input:checkbox' ).removeAttr( 'checked' );
		}
	};

	var click_on_ics_rule_text = function( s1, s2, s3, data, fn ) {
		$( document ).on( 'click', s1, function() {
			if( ! $( s2 ).is( ':checked' ) ) {
				$( s2 ).attr( 'checked', true );
				var txt = $.trim( $( s3 ).text() );
				txt = txt.substring( 0, txt.length - 3 );
				$( s3 ).text( txt + ':' );
			}
			show_repeat_tabs( data, fn );
			return false;
		});
	};

	var click_on_checkbox = function( s1, s2, s3, data, fn ) {
		$( s1 ).click( function() {
			if ( $(this).is( ':checked' ) ) {
				if ( this.id === 'ai1ec_repeat' ) {
					$( '#ai1ec_exclude' ).removeAttr( 'disabled' );
				};
				show_repeat_tabs( data, fn );
			} else {
				if ( this.id === 'ai1ec_repeat' ) {
					$( '#ai1ec_exclude' ).attr( 'disabled', true );
				};
				$( s2 ).text( '' );
				var txt = $.trim( $( s3 ).text() );
				txt = txt.substring( 0, txt.length - 1 );
				$( s3 ).text( txt + '...' );
			}
		} );
	};

	/**
	 * Handle clicking on cancel of recurrence modal.
	 * @param  {[type]} s1 The selector of the <a> of the RRULE/EXRULE.
	 * @param  {[type]} s2 The selector of the checkbox of the RRULE/EXRULE.
	 * @param  {[type]} s3 The selector of the label of the RRULE/EXRULE.
	 */
	var click_on_modal_cancel = function( s1, s2, s3 ) {
		// If the original value of RRULE/EXRULE was empty, then uncheck the box.
		if ( $.trim( $( s1 ).text() ) === '' ) {
			$( s2 ).removeAttr( 'checked' );
			// Handle disabling of EXRULE setting if RRULE is unchecked.
			if ( ! $( '#ai1ec_repeat' ).is( ':checked' ) ) {
				$( '#ai1ec_exclude' ).attr( 'disabled', true );
			}
			// Adjust the label depending on if there is an ellipsis?
			// (Who coded this??)
			var txt = $.trim( $( s3 ).text() );
			if( txt.lastIndexOf( '...' ) === -1 ) {
				txt = txt.substring( 0, txt.length - 1 );
				$( s3 ).text( txt + '...' );
			}
		}
	};

	/**
	 * Called after the recurrence modal's markup is loaded to initialize widgets.
	 */
	var init_modal_widgets = function() {
		// Initialize count range slider
		$( '#ai1ec_count, #ai1ec_daily_count, #ai1ec_weekly_count, #ai1ec_monthly_count, #ai1ec_yearly_count' ).rangeinput( {
			css: {
				input: 'ai1ec-range',
				slider: 'ai1ec-slider',
				progress: 'ai1ec-progress',
				handle: 'ai1ec-handle'
			}
		} );

		// Initialize inputdate plugin on our "until" date input.
		var data = {
			start_date_input : '#ai1ec_until-date-input',
			start_time       : '#ai1ec_until-time',
			date_format      : ai1ec_config.date_format,
			month_names      : ai1ec_config.month_names,
			day_names        : ai1ec_config.day_names,
			week_start_day   : ai1ec_config.week_start_day,
			twentyfour_hour  : ai1ec_config.twentyfour_hour,
			now              : new Date( ai1ec_config.now * 1000 )
		};
		$.inputdate( data );
	};

	/**
	 * Shows the recurrence modal.
	 *
	 * @param  {object}   data           Data to post to get contents via AJAX.
	 * @param  {function} post_ajax_func Optional callback to execute after AJAX.
	 */
	var show_repeat_tabs = function( data, callback ) {
		var $modal = $( '#ai1ec_repeat_box' ),
		    $loading = $( '.ai1ec-loading', $modal );

		// Show the modal.
		$modal.modal( { backdrop: 'static' } );

		$.post(
			ajaxurl,
			data,
			function( response ) {
				if ( response.error ) {
					// Tell the user there is an error
					// TODO: Use other method of notification
					window.alert( response.message );
					$modal.modal( 'hide' );
				} else {
					$loading.addClass( 'ai1ec-hide' ).after( response.message );
					// Execute any requested AJAX completion callback.
					if ( typeof callback === 'function' ) {
						callback();
					}
				}
			},
			'json'
		);
	};

	return {
		show_repeat_tabs       : show_repeat_tabs,
		init_modal_widgets     : init_modal_widgets,
		click_on_modal_cancel  : click_on_modal_cancel,
		click_on_checkbox      : click_on_checkbox,
		click_on_ics_rule_text : click_on_ics_rule_text,
		repeat_form_error      : repeat_form_error,
		repeat_form_success    : repeat_form_success
	};
} );

timely.define('external_libs/jquery.calendrical_timespan',
		[
		 "jquery_timely"
		 ],
		 function( $ ) {
// I merged two plugins into one because they had a lot of dependencies.
var calendricalDateFormats = {
		us  : { //US date format (eg. 12/1/2011)
			pattern : /([\d]{1,2})\/([\d]{1,2})\/([\d]{4}|[\d]{2})/,
			format  : 'm/d/y',
			order   : 'middleEndian',
			zeroPad : false },
		iso : { //ISO 8601 (eg. 2011-12-01)
			pattern : /([\d]{4}|[\d]{2})-([\d]{1,2})-([\d]{1,2})/,
			format  : 'y-m-d',
			order   : 'bigEndian',
			zeroPad : true },
		dot : { //Little endian with dots (eg. 1.12.2011)
			pattern : /([\d]{1,2}).([\d]{1,2}).([\d]{4}|[\d]{2})/,
			format  : 'd.m.y',
			order   : 'littleEndian',
			zeroPad : false },
		def : { //Default (eg. 1/12/2011)
			pattern : /([\d]{1,2})\/([\d]{1,2})\/([\d]{4}|[\d]{2})/,
			format  : 'd/m/y',
			order   : 'littleEndian',
			zeroPad : false }
	};

	var pad2 = function( number ) {
		return ( number < 10 ) ? '0' + number : number;
	};

	var formatDateToIso = function( date, use_time ) {
		if ( typeof use_time == 'undefined' ) {
			use_time = false;
		}
		var output = date.getUTCFullYear() + '-' +
			pad2( date.getUTCMonth() + 1 ) + '-' +
			pad2( date.getUTCDate() );
		if ( use_time ) {
			output += 'T' +
				pad2( date.getUTCHours() ) + ':' +
				pad2( date.getUTCMinutes() ) + ':00';
		}
		return output;
	};

	var parseIsoToDate = function( $input, default_t ) {
		var value  = $input.val();
		var parsed = null;
		if ( value.length < 4 ) {
			parsed = new Date( default_t );
		} else {
			parsed = new Date( value );
			/**
			 * code bellow is used to avoid date/time interpretation in respect
			 * to local (browser) timezone.
			 */
			var particles = value.split( 'T' );
			var a_date = particles[0].split( '-' );
			var a_time = particles[1].split( ':' );
			parsed.setUTCFullYear( a_date[0], a_date[1] - 1, a_date[2] );
			parsed.setUTCHours( a_time[0], a_time[1], a_time[2], 0 );
		}
		return parsed;
	};

	var parseAndAdjustIso = function( $input, default_t, adjust_h, adjust_m ) {
		default_t += ( adjust_h * 3600000 );
		default_t -= ( default_t % ( adjust_m * 60000 ) );
		return parseIsoToDate( $input, default_t );
	};

	var formatDate = function(date, format, noutc)
	{
		var y, m, d;
		if( typeof calendricalDateFormats[format] === 'undefined' ){
			format = 'def';
		}
		if( typeof noutc === 'undefined' ) {
			noutc = false;
		}
		if( true === noutc ) {
			y = ( date.getFullYear() ).toString();
			m = ( date.getMonth() + 1 ).toString();
			d = ( date.getDate() ).toString();
		} else {
			y = ( date.getUTCFullYear() ).toString();
			m = ( date.getUTCMonth() + 1 ).toString();
			d = ( date.getUTCDate() ).toString();
		}

		if( calendricalDateFormats[format].zeroPad ) {
			if( m.length == 1 ) m = '0' + m;
			if( d.length == 1 ) d = '0' + d;
		}
		var dt = calendricalDateFormats[format].format;
		dt = dt.replace('d', d);
		dt = dt.replace('m', m);
		dt = dt.replace('y', y);
		return dt;
	};

	var formatTime = function(hour, minute, iso)
	{
		var printMinute = minute;
		if( minute < 10 ) printMinute = '0' + minute;

		if( iso ) {
			var printHour = hour
			if( printHour < 10 ) printHour = '0' + hour;
			return printHour + ':' + printMinute;
		} else {
			var printHour = hour % 12;
			if( printHour == 0 ) printHour = 12;
			var half = ( hour < 12 ) ? 'am' : 'pm';
			return printHour + ':' + printMinute + half;
		}
	};

	var parseDate = function(date, format)
	{
		if( typeof calendricalDateFormats[format] === 'undefined' )
			format = 'def';

		var matches = date.match(calendricalDateFormats[format].pattern);
		if( !matches || matches.length != 4 ) {
			// Return an "invalid date" date instance like the original parseDate
			return Date( 'invalid' );
		}

		switch( calendricalDateFormats[format].order ) {
			case 'bigEndian' :
				var d = matches[3];	var m = matches[2];	var y = matches[1];
				break;
			case 'littleEndian' :
				var d = matches[1];	var m = matches[2];	var y = matches[3];
				break;
			case 'middleEndian' :
				var d = matches[2];	var m = matches[1];	var y = matches[3];
				break;
			default : //Default to little endian
				var d = matches[1];	var m = matches[2];	var y = matches[3];
				break;
		}

		// Add century to a two digit year
		if( y.length == 2 ) {
			y = new Date().getUTCFullYear().toString().substr(0, 2) + y;
		}

		// This is how the original parseDate does it
		return new Date( m + '/' + d + '/' + y + ' GMT' );
	};

	var parseTime = function(text)
	{
		var match = match = /(\d+)\s*[:\-\.,]\s*(\d+)\s*(am|pm)?/i.exec(text);
		if( match && match.length >= 3 ) {
			var hour = Number(match[1]);
			var minute = Number(match[2]);
			if( hour == 12 && match[3] ) hour -= 12;
			if( match[3] && match[3].toLowerCase() == 'pm' ) hour += 12;
			return {
				hour:   hour,
				minute: minute
			};
		} else {
			return null;
		}
	};

    function getToday()
    {
        var date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function areDatesEqual(date1, date2)
    {
			if( typeof date1 === 'string' )
				date1 = new Date( date1 );

			if( typeof date2 === 'string' )
				date2 = new Date(date2);

			if( date1.getUTCDate() === date2.getUTCDate() ) {
				if( date1.getUTCMonth() === date2.getUTCMonth() ) {
					if( date1.getUTCFullYear() === date2.getUTCFullYear() ) {
						return true;
					}
				}
			}
			return false;
    }

    function daysInMonth(year, month)
    {
        if (year instanceof Date) return daysInMonth(year.getUTCFullYear(), year.getUTCMonth());
        if (month == 1) {
            var leapYear = (year % 4 == 0) &&
                (!(year % 100 == 0) || (year % 400 == 0));
            return leapYear ? 29 : 28;
        } else if (month == 3 || month == 5 || month == 8 || month == 10) {
            return 30;
        } else {
            return 31;
        }
    }

		function dayAfter(date)
    {
				// + 1 day
        return new Date( date.getTime() + (1*24*60*60*1000) );
    }

    function dayBefore(date)
    {
				// - 1 day
        return new Date( date.getTime() - (1*24*60*60*1000) );
    }

    function monthAfter(year, month)
    {
        return (month == 11) ?
            new Date(year + 1, 0, 1) :
            new Date(year, month + 1, 1);
    }

    /**
     * Generates calendar header, with month name, << and >> controls, and
     * initials for days of the week.
     */
    function renderCalendarHeader(element, year, month, options)
    {
				var monthNames = options.monthNames.split(',');
        //Prepare thead element
        var thead = $('<thead />');
        var titleRow = $('<tr />').appendTo(thead);

        //Generate << (back a month) link
        $('<th />').addClass('monthCell').append(
          $('<a href="javascript:;">&laquo;</a>')
                  .addClass('prevMonth')
                  .mousedown(function(e) {
                      renderCalendarPage(element,
                          month == 0 ? (year - 1) : year,
                          month == 0 ? 11 : (month - 1), options
                      );
                      e.preventDefault();
                  })
        ).appendTo(titleRow);

        //Generate month title
        $('<th />').addClass('monthCell').attr('colSpan', 5).append(
            $('<a href="javascript:;">' + monthNames[month] + ' ' +
                year + '</a>').addClass('monthName')
        ).appendTo(titleRow);

        //Generate >> (forward a month) link
        $('<th />').addClass('monthCell').append(
            $('<a href="javascript:;">&raquo;</a>')
                .addClass('nextMonth')
                .mousedown(function() {
                    renderCalendarPage(element,
                        month == 11 ? (year + 1) : year,
                        month == 11 ? 0 : (month + 1), options
                    );
                })
        ).appendTo(titleRow);

        // Generate weekday initials row. Adjust for week start day
				var names = options.dayNames.split(',');
				var startDay = parseInt(options.weekStartDay);
				var adjustedNames = [];
				for( var i = 0, len = names.length; i < len; i++ ) {
					adjustedNames[i] = names[(i + startDay) % len];
				}
        var dayNames = $('<tr />').appendTo(thead);
        $.each( adjustedNames, function( k, v ) {
            $('<td />').addClass('dayName').append(v).appendTo(dayNames);
        });

        return thead;
    }

    function renderCalendarPage(element, year, month, options)
    {
        options = options || {};

				var startDay = parseInt(options.weekStartDay);
        var today = options.today ? options.today : getToday();
        // Normalize
				today.setHours(0);
				today.setMinutes(0);

        var date = new Date(year, month, 1);
				var endDate = monthAfter(year, month);

        //Adjust dates for current timezone. This is a workaround to get
				//date comparison to work properly.
				var tzOffset = Math.abs(today.getTimezoneOffset());
				if (tzOffset != 0) {
					today.setHours(today.getHours() + tzOffset / 60);
					today.setMinutes(today.getMinutes() + tzOffset % 60);
					date.setHours(date.getHours() + tzOffset / 60);
					date.setMinutes(date.getMinutes() + tzOffset % 60);
					endDate.setHours(endDate.getHours() + tzOffset / 60);
					endDate.setMinutes(endDate.getMinutes() + tzOffset % 60);
				}

				//Wind end date forward to last day of week
				var ff = endDate.getUTCDay() - startDay;
				if (ff < 0) {
					ff = Math.abs(ff) - 1;
				} else {
					ff = 6 - ff;
				}
        for (var i = 0; i < ff; i++) endDate = dayAfter(endDate);

        var table = $('<table />');
        renderCalendarHeader(element, year, month, options).appendTo(table);

        var tbody = $('<tbody />').appendTo(table);
        var row = $('<tr />');

				//Rewind date to first day of week
				var rewind = date.getUTCDay() - startDay;
				if (rewind < 0) rewind = 7 + rewind;
        for (var i = 0; i < rewind; i++) date = dayBefore(date);

        while (date <= endDate) {
            var td = $('<td />')
                .addClass('day')
                .append(
                    $('<a href="javascript:;">' +
                        date.getUTCDate() + '</a>'
                    ).click((function() {
                        var thisDate = date;

                        return function() {
                            if (options && options.selectDate) {
                                options.selectDate(thisDate);
                            }
                        }
                    }()))
                )
                .appendTo(row);

            var isToday     = areDatesEqual(date, today);
            var isSelected  = options.selected &&
                                areDatesEqual(options.selected, date);

            if (isToday)                    td.addClass('today');
            if (isSelected)                 td.addClass('selected');
            if (isToday && isSelected)      td.addClass('today_selected');
            if (date.getUTCMonth() != month)   td.addClass('nonMonth');

           	var dow = date.getUTCDay();
						if (((dow + 1) % 7) == startDay) {
                tbody.append(row);
                row = $('<tr />');
            }
            date = dayAfter(date);
        }
        if (row.children().length) {
            tbody.append(row);
        } else {
            row.remove();
        }

        element.empty().append(table);
    }

    function renderTimeSelect(element, options)
    {
        var selection = options.selection && parseTime(options.selection);
        if (selection) {
            selection.minute = Math.floor(selection.minute / 15.0) * 15;
        }
        var startTime = options.startTime &&
            (options.startTime.hour * 60 + options.startTime.minute);

        var scrollTo;   //Element to scroll the dropdown box to when shown
        var ul = $('<ul />');
        for (var hour = 0; hour < 24; hour++) {
            for (var minute = 0; minute < 60; minute += 15) {
                if (startTime && startTime > (hour * 60 + minute)) continue;

                (function() {
                    var timeText = formatTime(hour, minute, options.isoTime);
                    var fullText = timeText;
                    if (startTime != null) {
                        var duration = (hour * 60 + minute) - startTime;
                        if (duration < 60) {
                            fullText += ' (' + duration + ' min)';
                        } else if (duration == 60) {
                            fullText += ' (1 hr)';
                        } else {
                            fullText += ' (' + Math.floor( duration / 60.0 ) + ' hr ' + ( duration % 60 ) + ' min)';
                        }
                    }
                    var li = $('<li />').append(
                        $('<a href="javascript:;">' + fullText + '</a>')
                        .click(function() {
                            if (options && options.selectTime) {
                                options.selectTime(timeText);
                            }
                        }).mousemove(function() {
                            $('li.selected', ul).removeClass('selected');
                        })
                    ).appendTo(ul);

                    //Set to scroll to the default hour, unless already set
                    if (!scrollTo && hour == options.defaultHour) {
                        scrollTo = li;
                    }

                    if (selection &&
                        selection.hour == hour &&
                        selection.minute == minute)
                    {
                        //Highlight selected item
                        li.addClass('selected');

                        //Set to scroll to the selected hour
                        //
                        //This is set even if scrollTo is already set, since
                        //scrolling to selected hour is more important than
                        //scrolling to default hour
                        scrollTo = li;
                    }
                })();
            }
        }
        if (scrollTo) {
            //Set timeout of zero so code runs immediately after any calling
            //functions are finished (this is needed, since box hasn't been
            //added to the DOM yet)
            setTimeout(function() {
                //Scroll the dropdown box so that scrollTo item is in
                //the middle
                element[0].scrollTop =
                    scrollTo[0].offsetTop - scrollTo.height() * 2;
            }, 0);
        }
        element.empty().append(ul);
    }

    $.fn.calendricalDate = function(options)
    {
        options = options || {};
        options.padding = options.padding || 4;
				options.monthNames = options.monthNames ||
														 'January,February,March,April,May,June,July,August,September,October,November,December';
				options.dayNames = options.dayNames || 'S,M,T,W,T,F,S';
				options.weekStartDay = options.weekStartDay || 0;

        return this.each(function() {
            var element = $(this);
            var div;
            var within = false;

            element.bind('focus', function() {
                if (div) return;
                var offset = element.position();
                var padding = element.css('padding-left');
                div = $('<div />')
                    .addClass('calendricalDatePopup')
                    .mouseenter(function() { within = true; })
                    .mouseleave(function() { within = false; })
                    .mousedown(function(e) {
                        e.preventDefault();
                    })
                    .css({
                        position: 'absolute',
                        left: offset.left,
                        top: offset.top + element.height() +
                            options.padding * 2
                    });
                element.after(div);

                var selected = parseDate(element.val(), options.dateFormat);
                if (!selected.getUTCFullYear()) selected = options.today ? options.today : getToday();

                renderCalendarPage(
                    div,
                    selected.getUTCFullYear(),
                    selected.getUTCMonth(), {
												today: options.today,
                        selected: selected,
												monthNames: options.monthNames,
												dayNames: options.dayNames,
												weekStartDay: options.weekStartDay,
                        selectDate: function(date) {
                            within = false;
                            element.val(formatDate(date, options.dateFormat));
                            div.remove();
                            div = null;
                            if (options.endDate) {
                                var endDate = parseDate(
                                    options.endDate.val(), options.dateFormat
                                );
                                if (endDate >= selected) {
                                    options.endDate.val(formatDate(
                                        new Date(
                                            date.getTime() +
                                            endDate.getTime() -
                                            selected.getTime()
                                        ),
                                        options.dateFormat
                                    ));
                                }
                            }
                        }
                    }
                );
            }).blur(function() {
                if (within){
                    if (div) element.focus();
                    return;
                }
                if (!div) return;
                div.remove();
                div = null;
            });
        });
    };

    $.fn.calendricalDateRange = function(options)
    {
        if (this.length >= 2) {
            $(this[0]).calendricalDate($.extend({
                endDate:   $(this[1])
            }, options));
            $(this[1]).calendricalDate(options);
        }
        return this;
    };

		$.fn.calendricalDateRangeSingle = function(options)
    {
        if (this.length == 1) {
            $(this).calendricalDate(options);
        }
        return this;
    };

    $.fn.calendricalTime = function(options)
    {
        options = options || {};
        options.padding = options.padding || 4;

        return this.each(function() {
            var element = $(this);
            var div;
            var within = false;

            element.bind('focus click', function() {
                if (div) return;

                var useStartTime = options.startTime;
                if (useStartTime) {
                    if (options.startDate && options.endDate &&
                        !areDatesEqual(parseDate(options.startDate.val()),
                            parseDate(options.endDate.val())))
                        useStartTime = false;
                }

                var offset = element.position();
                div = $('<div />')
                    .addClass('calendricalTimePopup')
                    .mouseenter(function() { within = true; })
                    .mouseleave(function() { within = false; })
                    .mousedown(function(e) {
                        e.preventDefault();
                    })
                    .css({
                        position: 'absolute',
                        left: offset.left,
                        top: offset.top + element.height() +
                            options.padding * 2
                    });
                if (useStartTime) {
                    div.addClass('calendricalEndTimePopup');
                }

                element.after(div);

                var opts = {
                    selection: element.val(),
                    selectTime: function(time) {
                        within = false;
                        element.val(time);
                        div.remove();
                        div = null;
                    },
                    isoTime: options.isoTime || false,
                    defaultHour: (options.defaultHour != null) ?
                                    options.defaultHour : 8
                };

                if (useStartTime) {
                    opts.startTime = parseTime(options.startTime.val());
                }

                renderTimeSelect(div, opts);
            }).blur(function() {
                if (within){
                    if (div) element.focus();
                    return;
                }
                if (!div) return;
                div.remove();
                div = null;
            });
        });
    },

    $.fn.calendricalTimeRange = function(options)
    {
        if (this.length >= 2) {
            $(this[0]).calendricalTime(options);
            $(this[1]).calendricalTime($.extend({
                startTime: $(this[0])
            }, options));
        }
        return this;
    };

    $.fn.calendricalDateTimeRange = function(options)
    {
        if (this.length >= 4) {
            $(this[0]).calendricalDate($.extend({
                endDate:   $(this[2])
            }, options));
            $(this[1]).calendricalTime(options);
            $(this[2]).calendricalDate(options);
            $(this[3]).calendricalTime($.extend({
                startTime: $(this[1]),
                startDate: $(this[0]),
                endDate:   $(this[2])
            }, options));
        }
        return this;
    };
    /**
     * Private functions
     */

    // Helper function - reset contents of current field to stored original
    // value and alert user.
    function reset_invalid( field )
    {
    	field
    		.addClass( 'error' )
    		.fadeOut( 'normal', function() {
    			field
    				.val( field.data( 'timespan.stored' ) )
    				.removeClass( 'error' )
    				.fadeIn( 'fast' );
    		});
    }

    // Stores the value of the HTML element in context to its "stored" jQuery data.
    function store_value() {
    	$(this).data( 'timespan.stored', this.value );
    }

    /**
     * Value initialization
     */
    function reset( start_date_input, start_time_input, start_time,
    		end_date_input, end_time_input, end_time, allday, twentyfour_hour,
    		date_format, now )
    {
    	// Restore original values of fields when the page was loaded
    	start_time.val( start_time.data( 'timespan.initial_value' ) );
    	end_time.val( end_time.data( 'timespan.initial_value' ) );
    	allday.get(0).checked = allday.data( 'timespan.initial_value' );

    	// Fill out input fields with default date/time based on these original
    	// values.

		var start = parseAndAdjustIso( start_time, now, 0, 15 );
		start_time_input.val(
			formatTime(
				start.getUTCHours(), start.getUTCMinutes(), twentyfour_hour
			)
		);
    	start_date_input.val( formatDate( start, date_format ) );

    	// end defaults to start +1h
    	var end = parseAndAdjustIso( end_time, start.getTime(), 1, 15 );
   		end_time_input.val(
			formatTime(
				end.getUTCHours(), end.getUTCMinutes(), twentyfour_hour
			)
		);
    	// If all-day is checked, end date one day *before* last day of the span,
    	// provided we were given an iCalendar-spec all-day timespan.
    	if( allday.get(0).checked ) {
    		end.setUTCDate( end.getUTCDate() - 1 );
		}
    	end_date_input.val( formatDate( end, date_format ) );

    	// Trigger function (defined above) to internally store values of each
    	// input field (used in calculations later).
    	start_date_input.each( store_value );
    	start_time_input.each( store_value );
    	end_date_input.each( store_value );
    	end_time_input.each( store_value );

    	// Set up visibility of controls and Calendrical activation based on
    	// original "checked" status of "All day" box.
    	allday.trigger( 'change.timespan' );
    	$( '#ai1ec_instant_event' ).trigger( 'change.timespan' );
    }

    /**
     * Private constants
     */

    var default_options = {
    	allday: '#allday',
    	start_date_input: '#start-date-input',
    	start_time_input: '#start-time-input',
    	start_time: '#start-time',
    	end_date_input: '#end-date-input',
    	end_time_input: '#end-time-input',
    	end_time: '#end-time',
    	twentyfour_hour: false,
    	date_format: 'def',
    	now: new Date()
    };

    /**
     * Public methods
     */

    var methods = {

    	/**
    	 * Initialize settings.
    	 */
    	init: function( options )
    	{
    		var o = $.extend( {}, default_options, options );

    		// Shortcut jQuery objects
    		var allday = $(o.allday);
    		var start_date_input = $(o.start_date_input);
    		var start_time_input = $(o.start_time_input);
    		var start_time = $(o.start_time);
    		var end_date_input = $(o.end_date_input);
    		var end_time_input = $(o.end_time_input);
    		var end_time = $(o.end_time);
    		var instant = $('#ai1ec_instant_event');

    		var end_date_time = end_date_input.add( end_time_input );
    		var date_inputs = start_date_input.add( o.end_date_input );
    		var time_inputs = start_time_input.add( o.end_time_input );
    		var all_inputs = start_date_input.add( o.start_time_input )
    			.add( o.end_date_input ).add( o.end_time_input );

    		/**
    		 * Event handlers
    		 */
    		// Save original (presumably valid) value of every input field upon focus.
    		all_inputs.bind( 'focus.timespan', store_value );

    		instant
				.bind( 'change.timespan', function() {
					if( this.checked ) {
						end_date_time.closest('tr').fadeOut();
						allday.attr( 'disabled', true );
					} else {
						allday.removeAttr( 'disabled' );
						end_date_time.closest('tr').fadeIn();
					}
				} );

    		// When "All day" is toggled, show/hide time.
    		var today = new Date( o.now.getFullYear(), o.now.getMonth(), o.now.getDate() );
    		var all_inputs_set = false;
    		allday
			.bind( 'change.timespan', function() {
				if( this.checked ) {
					time_inputs.fadeOut();
					instant.attr( 'disabled', true );
				} else {
					instant.removeAttr( 'disabled' );
					time_inputs.fadeIn();
				}
				if( ! all_inputs_set ) {
					all_inputs_set = true;
					all_inputs.calendricalDateTimeRange( {
						today: today, dateFormat: o.date_format, isoTime: o.twentyfour_hour,
						monthNames: o.month_names, dayNames: o.day_names, weekStartDay: o.week_start_day
					} );
				}
			} )
			.get().checked = false;

    		// Validate and update saved value of DATE fields upon blur.
    		date_inputs
    			.bind( 'blur.timespan', function() {
    				// Validate contents of this field.
    				var date = parseDate( this.value, o.date_format );
    				if( isNaN( date ) ) {
    					// This field is invalid.
    					reset_invalid( $(this) );
    				} else {
    					// Value is valid, so store it for later use (below).
    					$(this).data( 'timespan.stored', this.value );
    					// Re-format contents of field correctly (in case parsable but not
    					// perfect).
    					$(this).val( formatDate( date, o.date_format ) );
    				}
    			});

    		// Validate and update saved value of TIME fields upon blur.
    		time_inputs
    			.bind( 'blur.timespan', function() {
    				// Validate contents of this field.
    				var time = parseTime( this.value );
    				if( ! time ) {
    					// This field is invalid.
    					reset_invalid( $(this) );
    				} else {
    					// Value is valid, so store it for later use (below).
    					$(this).data( 'timespan.stored', this.value );
    					// Re-format contents of field correctly (in case parsable but not
    					// perfect).
    					$(this).val( formatTime( time.hour, time.minute, o.twentyfour_hour ) );
    				}
    			});

    		// Gets the time difference between start and end dates
    		function get_startend_time_difference() {
    			var start_date_val = parseDate( start_date_input.val(), o.date_format ).getTime() / 1000;
    			var start_time_val = parseTime( start_time_input.val() );
    			start_date_val += start_time_val.hour * 3600 + start_time_val.minute * 60;
    			var end_date_val = parseDate( end_date_input.val(), o.date_format ).getTime() / 1000;
    			var end_time_val = parseTime( end_time_input.val() );
    			end_date_val += end_time_val.hour * 3600 + end_time_val.minute * 60;

    			return end_date_val - start_date_val;
    		}

    		function shift_jqts_enddate() {
    			var start_date_val = parseDate( start_date_input.data( 'timespan.stored' ), o.date_format );
    			var start_time_val = parseTime( start_time_input.data( 'timespan.stored' ) );
    			var end_time_val = start_date_val.getTime() / 1000
    				+ start_time_val.hour * 3600 + start_time_val.minute * 60
    				+ start_date_input.data( 'time_diff' );
    			end_time_val = new Date( end_time_val * 1000 );
    			end_date_input.val( formatDate( end_time_val, o.date_format ) );
    			end_time_input.val( formatTime( end_time_val.getUTCHours(), end_time_val.getUTCMinutes(), o.twentyfour_hour ) );

    			return true;
    		}

    		// When start date/time are modified, update end date/time by shifting the
    		// appropriate amount.
    		start_date_input.add( o.start_time_input )
    			.bind( 'focus.timespan', function() {
    				// Calculate the time difference between start & end and save it.
    				start_date_input.data( 'time_diff', get_startend_time_difference() );
    			} )
    			.bind( 'blur.timespan', function() {
    				// If End date is earlier than StartDate, reset it to 15 mins after startDate
    				if ( start_date_input.data( 'time_diff' ) < 0 ) {
    					start_date_input.data( 'time_diff', 15 * 60 );
    				}
    				// Shift end date/time as appropriate.
    				var shift_jqts = shift_jqts_enddate();
    			} );

    		// When end date/time is modified, check if it is earlier than start date/time and shift it if needed
    		end_date_input.add( o.start_time_input )
    			.bind( 'blur.timespan', function() {
    				// If End date is earlier than StartDate, reset it to 15 mins after startDate
    				if ( get_startend_time_difference() < 0 ) {
    					start_date_input.data( 'time_diff', 15 * 60 );
    					// Shift end date/time as appropriate.
    					var shift_jqts = shift_jqts_enddate();
    				}
    			} );

    		// Validation upon form submission
    		start_date_input.closest( 'form' )
    			.bind( 'submit.timespan', function() {
    				// Update hidden field values with chosen date/time.
    				//
    				// 1. Start date/time

    				// Convert Date object into UNIX timestamp for form submission
    				var unix_start_time = parseDate( start_date_input.val(), o.date_format ).getTime() / 1000;
    				// If parsed correctly, proceed to add the time.
    				if ( ! isNaN( unix_start_time ) ) {
    					// Add time quantity to date, unless "All day" is checked.
    					if( ! allday.get(0).checked ) {
    						var time = parseTime( start_time_input.val() );
    						// If parsed correctly, proceed add its value.
    						if( time ) {
    							unix_start_time += time.hour * 3600 + time.minute * 60;
    						} else {
    							// Else entire calculation is invalid.
    							unix_start_time = '';
    						}
    					}
    				} else {
    					// Else entire calculation is invalid.
    					unix_start_time = '';
    				}
    				// Set start date value to valid unix time, or empty string, depending
    				// on above validation.
					if ( unix_start_time > 0 ) {
    					start_time.val( formatDateToIso( new Date( unix_start_time * 1000 ), true ) );
					}

    				// 2. End date/time

    				// Convert Date object into UNIX timestamp for form submission
    				var unix_end_time = parseDate( end_date_input.val(), o.date_format ).getTime() / 1000;
    				// If parsed correctly, proceed to add the time.
    				if( ! isNaN( unix_end_time ) ) {
    					// If "All day" is checked, store an end date that is one day
    					// *after* the start date (following iCalendar spec).
    					if( allday.get(0).checked ) {
    						unix_end_time += 24 * 60 * 60;
    					// Else add time quantity to date.
    					} else {
    						var time = parseTime( end_time_input.val() );
    						// If parsed correctly, proceed add its value.
    						if( time ) {
    							unix_end_time += time.hour * 3600 + time.minute * 60;
    						} else {
    							// Else entire calculation is invalid.
    							unix_end_time = '';
    						}
    					}
    				} else {
    					// Else entire calculation is invalid.
    					unix_end_time = '';
    				}
    				// Set end date value to valid unix time, or empty string, depending
    				// on above validation.
					if ( unix_end_time > 0 ) {
    					end_time.val( formatDateToIso( new Date( unix_end_time * 1000 ), true ) );
					}
    			} );

    		// Store original form values
    		start_time.data( 'timespan.initial_value', start_time.val() );
    		end_time.data( 'timespan.initial_value', end_time.val() );
    		allday.data( 'timespan.initial_value', allday.get(0).checked );

    		// Initialize input fields
    		reset( start_date_input,
    				start_time_input,
    				start_time,
    				end_date_input,
    				end_time_input,
    				end_time,
    				allday,
    				o.twentyfour_hour,
    				o.date_format,
    				o.now )

    		return this;
    	},

    	/**
    	 * Reset values to defaults.
    	 */
    	reset: function( options )
    	{
    		var o = $.extend( {}, default_options, options );

    		reset( $(o.start_date_input),
    				$(o.start_time_input),
    				$(o.start_time),
    				$(o.end_date_input),
    				$(o.end_time_input),
    				$(o.end_time),
    				$(o.allday),
    				o.twentyfour_hour,
    				o.date_format,
    				o.now );

    		return this;
    	},

    	/**
    	 * Destroy registered event handlers.
    	 */
    	destroy: function( options )
     	{
    		options = $.extend( {}, default_options, options );

    		$.each( options, function( option_name, value ) {
    			$(value).unbind( '.timespan' );
    		} );
    		$(options.start_date_input).closest('form').unbind( '.timespan' );

    		return this;
    	}
    }

    /**
     * Main jQuery plugin definition
     */

    $.timespan = function( arg )
    {
    	// Method calling logic
    	if( methods[arg] ) {
    		return methods[arg].apply( this, Array.prototype.slice.call( arguments, 1 ));
    	} else if( typeof arg === 'object' || ! arg ) {
    		return methods.init.apply( this, arguments );
    	} else {
    		$.error( 'Method ' + arg + ' does not exist on jQuery.timespan' );
    	}
    };
    return {
    	formatDate : formatDate,
    	parseDate  : parseDate
    };
} );

/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


timely.define('external_libs/bootstrap/button', ["jquery_timely"], function( $ ) {  // jshint ;_;

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass("ai1ec-" + d).attr(d, d) :
        $el.removeClass("ai1ec-" + d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="ai1ec-buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('ai1ec-active'))
          changed = false
        else
          $parent.find('.ai1ec-active').removeClass('ai1ec-active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('ai1ec-active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('ai1ec-active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=ai1ec-button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('ai1ec-btn')) $btn = $btn.closest('.ai1ec-btn')
    $btn.button('toggle')
    e.preventDefault()
  })

} );

timely.define('scripts/add_new_event/event_date_time/date_time_event_handlers',
	[
		'jquery_timely',
		'ai1ec_config',
		'scripts/add_new_event/event_date_time/date_time_utility_functions',
		'external_libs/jquery.calendrical_timespan',
		'libs/utils',
		'external_libs/bootstrap/button'
	],
	function(
		$,
		ai1ec_config,
		date_time_utility_functions,
		calendrical_functions,
		AI1EC_UTILS
	) {

	 // jshint ;_;

	var ajaxurl = AI1EC_UTILS.get_ajax_url();

	/**
	 * Show/hide elements that show selectors for ending until/after events
	 */
	var show_end_fields = function() {
		var selected = $( '#ai1ec_end option:selected' ).val();

		switch ( selected ) {
			// Never selected, hide end fields
			case '0':
				$( '#ai1ec_until_holder, #ai1ec_count_holder' ).collapse( 'hide' );
				break;

			// After X times selected
			case '1':
				$( '#ai1ec_until_holder' ).collapse( 'hide' );
				$( '#ai1ec_count_holder' ).collapse( 'show' );
				break;

			// On date selected
			case '2':
				$( '#ai1ec_count_holder' ).collapse( 'hide' );
				$( '#ai1ec_until_holder' ).collapse( 'show' );
				break;
		}
	};

	/**
	 * Handle click on duplicate Publish button.
	 */
	var trigger_publish = function() {
		$( '#publish' ).trigger( 'click' );
	};

	/**
	 * Handle click on the Apply button
	 */
	var handle_click_on_apply_button = function() {
		var $button = $( this ),
		    rule = '',
		    $active_tab = $( '#ai1ec_repeat_box .ai1ec-tab-pane.ai1ec-active' ),
		    frequency = $active_tab.data( 'freq' );

		switch ( frequency ) {
			case 'daily':
				rule += 'FREQ=DAILY;';
				var interval_day = $( '#ai1ec_daily_count' ).val();
				if( interval_day > 1 ) {
					rule += 'INTERVAL=' + interval_day + ';';
				}
				break;

			case 'weekly':
				rule += 'FREQ=WEEKLY;';
				var interval_week = $( '#ai1ec_weekly_count' ).val();
				if( interval_week > 1 ) {
					rule += 'INTERVAL=' + interval_week + ';';
				}
				var week_days = $( 'input[name="ai1ec_weekly_date_select"]:first' ).val();
				var wkst = $( '#ai1ec_weekly_date_select > div:first > input[type="hidden"]:first' ).val();
				if( week_days.length > 0 ) {
					rule += 'WKST=' + wkst + ';BYday=' + week_days + ';';
				}
				break;

			case 'monthly':
				rule += 'FREQ=MONTHLY;';
				var interval_month  = $( '#ai1ec_monthly_count' ).val();
				var monthtype = $( 'input[name="ai1ec_monthly_type"]:checked' ).val();
				if( interval_month > 1 ) {
					rule += 'INTERVAL=' + interval_month + ';';
				}
				var month_days = $( 'input[name="ai1ec_montly_date_select"]:first' ).val();
				if( month_days.length > 0 && monthtype === 'bymonthday' ) {
					rule += 'BYMONTHDAY=' + month_days + ';';
				} else if ( monthtype === 'byday' ) {
					var byday_num     = $( '#ai1ec_monthly_byday_num' ).val();
					var byday_weekday = $( '#ai1ec_monthly_byday_weekday' ).val();
					rule += 'BYday=' + byday_num + byday_weekday + ';';
				}
				break;

			case 'yearly':
				rule += 'FREQ=YEARLY;';
				var interval_year = $( '#ai1ec_yearly_count' ).val();
				if( interval_year > 1 ) {
					rule += 'INTERVAL=' + interval_year + ';';
				}
				var months = $( 'input[name="ai1ec_yearly_date_select"]:first' ).val();
				if( months.length > 0 ) {
					rule += 'BYMONTH=' + months + ';';
				}
				break;
		}

		var ending = $( '#ai1ec_end' ).val();
		// After x times
		if ( ending === '1' ) {
			rule += 'COUNT=' + $( '#ai1ec_count' ).val() + ';';
		}
		// On date
		else if ( ending === '2' ) {
			var until = $( '#ai1ec_until-date-input' ).val();
			until = calendrical_functions.parseDate( until, ai1ec_config.date_format );

			// Take the starting date to set hour and minute
			var start = $( '#ai1ec_start-time' ).val();
			start = calendrical_functions.parseDate( start, ai1ec_config.date_format );
			start = new Date( start );
			// Get UTC Day and UTC Month, and then add leading zeroes if required
			var d     = until.getUTCDate();
			var m     = until.getUTCMonth() + 1;
			var hh    = start.getUTCHours();
			var mm    = start.getUTCMinutes();

			// months
			m         = ( m < 10 )  ? '0' + m  : m;
			// days
			d         = ( d < 10 )  ? '0' + d  : d;
			// hours
			hh        = ( hh < 10 ) ? '0' + hh : hh;
			// minutes
			mm        = ( mm < 10 ) ? '0' + mm : mm;
			// Now, set the UTC friendly date string
			until     = until.getUTCFullYear() + '' + m + d + 'T235959Z';
			rule += 'UNTIL=' + until + ';';
		}

		var data = {
			action : 'ai1ec_rrule_to_text',
			rrule  : rule
		};

		$button
			.button( 'loading' )
			.next()
				.addClass( 'ai1ec-disabled' );

		$.post(
			ajaxurl,
			data,
			function( response ) {
				if ( response.error ) {
					$button
						.button( 'reset' )
						.next()
							.removeClass( 'ai1ec-disabled' );

					if ( '1' === $( '#ai1ec_is_box_repeat' ).val() ) {
						date_time_utility_functions.repeat_form_error(
							'#ai1ec_rrule', '#ai1ec_repeat_label', response, $button
						);
					} else {
						date_time_utility_functions.repeat_form_error(
							'#ai1ec_exrule', '#ai1ec_exclude_label', response, $button
						);
					}
				} else {
					if ( '1' === $( '#ai1ec_is_box_repeat' ).val() ) {
						date_time_utility_functions.repeat_form_success(
							'#ai1ec_rrule',
							'#ai1ec_repeat_label',
							'#ai1ec_repeat_text > a',
							rule,
							$button,
							response
						);
					} else {
						date_time_utility_functions.repeat_form_success(
							'#ai1ec_exrule',
							'#ai1ec_exclude_label',
							'#ai1ec_exclude_text > a',
							rule,
							$button,
							response
						);
					}
				}
			},
			'json'
		);
	};

	/**
	 * Handle clicking on cancel button
	 */
	var handle_click_on_cancel_modal = function() {
		// Reset the value for the RRULE/EXRULE option.
		if ( $( '#ai1ec_is_box_repeat' ).val() === '1' ) {
			// handles click on cancel for RRULE
			date_time_utility_functions.click_on_modal_cancel(
				'#ai1ec_repeat_text > a', '#ai1ec_repeat', '#ai1ec_repeat_label'
			);
		} else {
			// handles click on cancel for EXRULE
			date_time_utility_functions.click_on_modal_cancel(
				'#ai1ec_exclude_text > a', '#ai1ec_exclude', '#ai1ec_exclude_label'
			);
		}

		// Hide the recurrence modal.
		$( '#ai1ec_repeat_box' ).modal( 'hide' );

		return false;
	};

	/**
	 * Handle clicking on the two checkboxes in the monthly tab
	 */
	var handle_checkbox_monthly_tab_modal = function() {
		if ( $( this ).is( '#ai1ec_monthly_type_bymonthday' ) ) {
			$( '#ai1ec_repeat_monthly_byday' ).collapse( 'hide' );
			$( '#ai1ec_repeat_monthly_bymonthday' ).collapse( 'show' );
		}
		else {
			$( '#ai1ec_repeat_monthly_bymonthday' ).collapse( 'hide' );
			$( '#ai1ec_repeat_monthly_byday' ).collapse( 'show' );
		}
	};

	/**
	 * Handle clicking on weekday/day/month toggle buttons.
	 */
	var handle_click_on_toggle_buttons = function() {
		var $this = $( this ),
		    data = [],
		    $grid = $this.closest( '.ai1ec-btn-group-grid' ),
		    value;

		$this.toggleClass( 'ai1ec-active' );

		$( 'a', $grid ).each( function() {
			var $el = $( this );
			if ( $el.is( '.ai1ec-active' ) ) {
				value = $el.next().val();
				data.push( value );
			}
		} );

		$grid.next().val( data.join() );
	};

	// This are pseudo handlers, they might require a refactoring sooner or later
	var execute_pseudo_handlers = function() {
		// handles click on rrule text
		date_time_utility_functions.click_on_ics_rule_text(
			'#ai1ec_repeat_text > a',
			'#ai1ec_repeat',
			'#ai1ec_repeat_label',
			{
				action: 'ai1ec_get_repeat_box',
				repeat: 1,
				post_id: $( '#post_ID' ).val()
			},
			date_time_utility_functions.init_modal_widgets
		);
		// handles click on exrule text
		date_time_utility_functions.click_on_ics_rule_text(
			'#ai1ec_exclude_text > a',
			'#ai1ec_exclude',
			'#ai1ec_exclude_label',
			{
				action: 'ai1ec_get_repeat_box',
				repeat: 0,
				post_id: $( '#post_ID' ).val()
			},
			date_time_utility_functions.init_modal_widgets
		);

		// handles click on repeat checkbox
		date_time_utility_functions.click_on_checkbox(
			'#ai1ec_repeat',
			'#ai1ec_repeat_text > a',
			'#ai1ec_repeat_label',
			{
				action: 'ai1ec_get_repeat_box',
				repeat: 1,
				post_id: $( '#post_ID' ).val()
			},
			date_time_utility_functions.init_modal_widgets
		);

		// handles click on exclude checkbox
		date_time_utility_functions.click_on_checkbox(
			'#ai1ec_exclude',
			'#ai1ec_exclude_text > a',
			'#ai1ec_exclude_label',
			{
				action: 'ai1ec_get_repeat_box',
				repeat: 0,
				post_id: $( '#post_ID' ).val()
			},
			date_time_utility_functions.init_modal_widgets
		);
	};

	var handle_animation_of_calendar_widget = function( e ) {
		// Just toggle the visibility.
		$('#widgetCalendar').toggle();
		return false;
	};

	/**
	 * Handles hiding of modal (resets to loading state).
	 */
	var handle_modal_hide = function() {
		$( '.ai1ec-modal-content', this )
			.not( '.ai1ec-loading ' )
				.remove()
				.end()
			.removeClass( 'ai1ec-hide' );
	};

	return {
		show_end_fields                     : show_end_fields,
		trigger_publish                     : trigger_publish,
		handle_click_on_apply_button        : handle_click_on_apply_button,
		handle_click_on_cancel_modal        : handle_click_on_cancel_modal,
		handle_checkbox_monthly_tab_modal   : handle_checkbox_monthly_tab_modal,
		execute_pseudo_handlers             : execute_pseudo_handlers,
		handle_animation_of_calendar_widget : handle_animation_of_calendar_widget,
		handle_click_on_toggle_buttons      : handle_click_on_toggle_buttons,
		handle_modal_hide                   : handle_modal_hide
	};
} );

timely.define('scripts/add_new_event/event_cost_helper',
	[
		"jquery_timely",
		"ai1ec_config"
	],
	function( $, ai1ec_config ) {
		

		var is_free = function() {
			return $( '#ai1ec_is_free' ).is( ':checked' );
		};

		var is_price_entered = function() {
			return ( $( '#ai1ec_cost' ).val() !== '' );
		};

		var is_free_click_handler = function( evt ) {
			var $wrap = $( this ).parents( 'table:eq(0)' );
			var $cost = $( '#ai1ec_cost', $wrap );
			var label = ai1ec_config.label_a_buy_tickets_url;
			if ( is_free() ) {
				$cost.attr( 'value', '' ).addClass( 'ai1ec-hidden' );
				label = ai1ec_config.label_a_rsvp_url;
			} else {
				$cost.removeClass( 'ai1ec-hidden' );
			}
			$( 'label[for=ai1ec_ticket_url]', $wrap ).text( label );
		};

		return {
			handle_change_is_free:  is_free_click_handler,
			check_is_free:          is_free,
			check_is_price_entered: is_price_entered
		};
	}
);

timely.define('external_libs/jquery.inputdate', 
		[
		 "jquery_timely",
		 "external_libs/jquery.calendrical_timespan"
		 ],
		 function( $, calendrical_functions ) {

	/**
	 * Private functions
	 */
	
	// Helper function - reset contents of current field to stored original
	// value and alert user.
	function reset_invalid( field )
	{
		field
			.addClass( 'error' )
			.fadeOut( 'normal', function() {
				field
					.val( field.data( 'timespan.stored' ) )
					.removeClass( 'error' )
					.fadeIn( 'fast' );
			});
	}
	
	// Stores the value of the HTML element in context to its "stored" jQuery data.
	function store_value() {
		$(this).data( 'timespan.stored', this.value );
	}
	
	/**
	 * Value initialization
	 */
	function reset( start_date_input, start_time, twentyfour_hour, date_format, now )
	{
		// Restore original values of fields when the page was loaded
		start_time.val( start_time.data( 'timespan.initial_value' ) );
	
		// Fill out input field with default date/time based on this original
		// value.
	
		var start = parseInt( start_time.val() );
		// If start_time field has a valid integer, use it, else use current time
		// rounded to nearest quarter-hour.
		if( ! isNaN( parseInt( start ) ) ) {
			start = new Date( parseInt( start ) * 1000 );
		} else {
			start = new Date( now );
		}
		start_date_input.val( calendrical_functions.formatDate( start, date_format ) );
	
		// Trigger function (defined above) to internally store values of each
		// input field (used in calculations later).
		start_date_input.each( store_value );
	}
	
	/**
	 * Private constants
	 */
	
	var default_options = {
		start_date_input: 'date-input',
		start_time: 'time',
		twentyfour_hour: false,
		date_format: 'def',
		now: new Date()
	};
	
	/**
	 * Public methods
	 */
	
	var methods = {
	
		/**
		 * Initialize settings.
		 */
		init: function( options )
		{
			var o = $.extend( {}, default_options, options );
	
			// Shortcut jQuery objects
			var start_date_input = $(o.start_date_input);
			var start_time = $(o.start_time);
	
			var date_inputs = start_date_input;
			var all_inputs = start_date_input;
	
			/**
			 * Event handlers
			 */
	
			// Save original (presumably valid) value of every input field upon focus.
			all_inputs.bind( 'focus.timespan', store_value );
			date_inputs.calendricalDate( {
				today: new Date( o.now.getFullYear(), o.now.getMonth(), o.now.getDate() ),
				dateFormat: o.date_format, monthNames: o.month_names, dayNames: o.day_names,
				weekStartDay: o.week_start_day
			} );
	
			// Validate and update saved value of DATE fields upon blur.
			date_inputs
				.bind( 'blur.timespan', function() {
					// Validate contents of this field.
					var date = calendrical_functions.parseDate( this.value, o.date_format );
					if( isNaN( date ) ) {
						// This field is invalid.
						reset_invalid( $(this) );
					} else {
						// Value is valid, so store it for later use (below).
						$(this).data( 'timespan.stored', this.value );
						// Re-format contents of field correctly (in case parsable but not
						// perfect).
						$(this).val( calendrical_functions.formatDate( date, o.date_format ) );
					}
				});
	
			// When start date/time are modified, update end date/time by shifting the
			// appropriate amount.
			start_date_input.bind( 'focus.timespan', function() {
					// Calculate the time difference between start & end and save it.
					var start_date_val = calendrical_functions.parseDate( start_date_input.val(), o.date_format ).getTime() / 1000;
				} )
				.bind( 'blur.timespan', function() {
					var start_date_val = calendrical_functions.parseDate( start_date_input.data( 'timespan.stored' ), o.date_format );
					// Shift end date/time as appropriate.
				} );
	
			// Validation upon form submission
			start_date_input.closest( 'form' )
				.bind( 'submit.timespan', function() {
					// Update hidden field value with chosen date/time.
	
					// Convert Date object into UNIX timestamp for form submission
					var unix_start_time = calendrical_functions.parseDate( start_date_input.val(), o.date_format ).getTime() / 1000;
					// If parsed incorrectly, entire calculation is invalid.
					if( isNaN( unix_start_time ) ) {
						unix_start_time = '';
					}
					// Set start date value to valid unix time, or empty string, depending
					// on above validation.
					start_time.val( unix_start_time );
				} );
	
			// Store original form value
			start_time.data( 'timespan.initial_value', start_time.val() );
	
			// Initialize input fields
			reset( start_date_input,
					start_time,
					o.twentyfour_hour,
					o.date_format,
					o.now )
	
			return this;
		},
	
		/**
		 * Reset values to defaults.
		 */
		reset: function( options )
		{
			var o = $.extend( {}, default_options, options );
	
			reset( $(o.start_date_input),
					$(o.start_time),
					o.twentyfour_hour,
					o.date_format,
					o.now );
	
			return this;
		},
	
		/**
		 * Destroy registered event handlers.
		 */
		destroy: function( options )
	 	{
			options = $.extend( {}, default_options, options );
	
			$.each( options, function( option_name, value ) {
				$(value).unbind( '.timespan' );
			} );
			$(options.start_date_input).closest('form').unbind( '.timespan' );
	
			return this;
		}
	}
	
	/**
	 * Main jQuery plugin definition
	 */
	
	$.inputdate = function( arg )
	{
		// Method calling logic
		if( methods[arg] ) {
			return methods[arg].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof arg === 'object' || ! arg ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + arg + ' does not exist on jQuery.timespan' );
		}
	};
} );
timely.define('external_libs/jquery.tools', 
		[
		 "jquery_timely"
		 ],
		 function( $ ) {
			
			$.tools = $.tools || {version: '1.2.7'};

			var tool;

			tool = $.tools.rangeinput = {

				conf: {
					min: 0,
					max: 100,		// as defined in the standard
					step: 'any', 	// granularity of the value. a non-zero float or int (or "any")
					steps: 0,
					value: 0,			
					precision: undefined,
					vertical: 0,
					keyboard: true,
					progress: false,
					speed: 100,

					// set to null if not needed
					css: {
						input:		'range',
						slider: 		'slider',
						progress: 	'progress',
						handle: 		'handle'					
					}

				} 
			};

		//{{{ fn.drag

			/* 
				FULL featured drag and drop. 0.7 kb minified, 0.3 gzipped. done.
				Who told d'n'd is rocket science? Usage:
				
				$(".myelement").drag({y: false}).on("drag", function(event, x, y) {
					// do your custom thing
				});
				 
				Configuration: 
					x: true, 		// enable horizontal drag
					y: true, 		// enable vertical drag 
					drag: true 		// true = perform drag, false = only fire events 
					
				Events: dragStart, drag, dragEnd. 
			*/
			var doc, draggable;

			$.fn.drag = function(conf) {

				// disable IE specialities
				document.ondragstart = function () { return false; };

				conf = $.extend({x: true, y: true, drag: true}, conf);

				doc = doc || $(document).on("mousedown mouseup", function(e) {

					var el = $(e.target);  

					// start 
					if (e.type == "mousedown" && el.data("drag")) {

						var offset = el.position(),
							 x0 = e.pageX - offset.left, 
							 y0 = e.pageY - offset.top,
							 start = true;    

						doc.on("mousemove.drag", function(e) {  
							var x = e.pageX -x0, 
								 y = e.pageY -y0,
								 props = {};

							if (conf.x) { props.left = x; }
							if (conf.y) { props.top = y; } 

							if (start) {
								el.trigger("dragStart");
								start = false;
							}
							if (conf.drag) { el.css(props); }
							el.trigger("drag", [y, x]);
							draggable = el;
						}); 

						e.preventDefault();

					} else {

						try {
							if (draggable) {  
								draggable.trigger("dragEnd");  
							}
						} finally { 
							doc.off("mousemove.drag");
							draggable = null; 
						}
					} 

				});

				return this.data("drag", true); 
			};	

		//}}}



			function round(value, precision) {
				var n = Math.pow(10, precision);
				return Math.round(value * n) / n;
			}

			// get hidden element's width or height even though it's hidden
			function dim(el, key) {
				var v = parseInt(el.css(key), 10);
				if (v) { return v; }
				var s = el[0].currentStyle; 
				return s && s.width && parseInt(s.width, 10);	
			}

			function hasEvent(el) {
				var e = el.data("events");
				return e && e.onSlide;
			}

			function RangeInput(input, conf) {

				// private variables
				var self = this,  
					 css = conf.css, 
					 root = $("<div><div/><a href='#'/></div>").data("rangeinput", self),	
					 vertical,		
					 value,			// current value
					 origo,			// handle's start point
					 len,				// length of the range
					 pos;				// current position of the handle		

				// create range	 
				input.before(root);	

				var handle = root.addClass(css.slider).find("a").addClass(css.handle), 	
					 progress = root.find("div").addClass(css.progress);

				// get (HTML5) attributes into configuration
				$.each("min,max,step,value".split(","), function(i, key) {
					var val = input.attr(key);
					if (parseFloat(val)) {
						conf[key] = parseFloat(val, 10);
					}
				});			   

				var range = conf.max - conf.min, 
					 step = conf.step == 'any' ? 0 : conf.step,
					 precision = conf.precision;

				if (precision === undefined) {
					precision = step.toString().split(".");
					precision = precision.length === 2 ? precision[1].length : 0;
				}  

				// Replace built-in range input (type attribute cannot be changed)
				if (input.attr("type") == 'range') {			
					var def = input.clone().wrap("<div/>").parent().html(),
						 clone = $(def.replace(/type/i, "type=text data-orig-type"));

					clone.val(conf.value);
					input.replaceWith(clone);
					input = clone;
				}

				input.addClass(css.input);

				var fire = $(self).add(input), fireOnSlide = true;


				/**
				 	The flesh and bone of this tool. All sliding is routed trough this.
					
					@param evt types include: click, keydown, blur and api (setValue call)
					@param isSetValue when called trough setValue() call (keydown, blur, api)
					
					vertical configuration gives additional complexity. 
				 */
				function slide(evt, x, val, isSetValue) { 

					// calculate value based on slide position
					if (val === undefined) {
						val = x / len * range;  

					// x is calculated based on val. we need to strip off min during calculation	
					} else if (isSetValue) {
						val -= conf.min;	
					}

					// increment in steps
					if (step) {
						val = Math.round(val / step) * step;
					}

					// count x based on value or tweak x if stepping is done
					if (x === undefined || step) {
						x = val * len / range;	
					}  

					// crazy value?
					if (isNaN(val)) { return self; }       

					// stay within range
					x = Math.max(0, Math.min(x, len));  
					val = x / len * range;   

					if (isSetValue || !vertical) {
						val += conf.min;
					}

					// in vertical ranges value rises upwards
					if (vertical) {
						if (isSetValue) {
							x = len -x;
						} else {
							val = conf.max - val;	
						}
					}	

					// precision
					val = round(val, precision); 

					// onSlide
					var isClick = evt.type == "click";
					if (fireOnSlide && value !== undefined && !isClick) {
						evt.type = "onSlide";           
						fire.trigger(evt, [val, x]); 
						if (evt.isDefaultPrevented()) { return self; }  
					}				

					// speed & callback
					var speed = isClick ? conf.speed : 0,
						 callback = isClick ? function()  {
							evt.type = "change";
							fire.trigger(evt, [val]);
						 } : null;

					if (vertical) {
						handle.animate({top: x}, speed, callback);
						if (conf.progress) { 
							progress.animate({height: len - x + handle.height() / 2}, speed);	
						}				

					} else {
						handle.animate({left: x}, speed, callback);
						if (conf.progress) { 
							progress.animate({width: x + handle.width() / 2}, speed); 
						}
					}

					// store current value
					value = val; 
					pos = x;			 

					// se input field's value
					input.val(val);

					return self;
				} 


				$.extend(self, {  

					getValue: function() {
						return value;	
					},

					setValue: function(val, e) {
						init();
						return slide(e || $.Event("api"), undefined, val, true); 
					}, 			  

					getConf: function() {
						return conf;	
					},

					getProgress: function() {
						return progress;	
					},

					getHandle: function() {
						return handle;	
					},			

					getInput: function() {
						return input;	
					}, 

					step: function(am, e) {
						e = e || $.Event();
						var step = conf.step == 'any' ? 1 : conf.step;
						self.setValue(value + step * (am || 1), e);	
					},

					// HTML5 compatible name
					stepUp: function(am) { 
						return self.step(am || 1);
					},

					// HTML5 compatible name
					stepDown: function(am) { 
						return self.step(-am || -1);
					}

				});

				// callbacks
				$.each("onSlide,change".split(","), function(i, name) {

					// from configuration
					if ($.isFunction(conf[name]))  {
						$(self).on(name, conf[name]);	
					}

					// API methods
					self[name] = function(fn) {
						if (fn) { $(self).on(name, fn); }
						return self;	
					};
				}); 


				// dragging		                                  
				handle.drag({drag: false}).on("dragStart", function() {

					/* do some pre- calculations for seek() function. improves performance */			
					init();

					// avoid redundant event triggering (= heavy stuff)
					fireOnSlide = hasEvent($(self)) || hasEvent(input);


				}).on("drag", function(e, y, x) {        

					if (input.is(":disabled")) { return false; } 
					slide(e, vertical ? y : x); 

				}).on("dragEnd", function(e) {
					if (!e.isDefaultPrevented()) {
						e.type = "change";
						fire.trigger(e, [value]);	 
					}

				}).click(function(e) {
					return e.preventDefault();	 
				});		

				// clicking
				root.click(function(e) { 
					if (input.is(":disabled") || e.target == handle[0]) { 
						return e.preventDefault(); 
					}				  
					init(); 
					var fix = vertical ? handle.height() / 2 : handle.width() / 2;
					slide(e, vertical ? len-origo-fix + e.pageY  : e.pageX -origo -fix);  
				});

				if (conf.keyboard) {

					input.keydown(function(e) {

						if (input.attr("readonly")) { return; }

						var key = e.keyCode,
							 up = $([75, 76, 38, 33, 39]).index(key) != -1,
							 down = $([74, 72, 40, 34, 37]).index(key) != -1;					 

						if ((up || down) && !(e.shiftKey || e.altKey || e.ctrlKey)) {

							// UP: 	k=75, l=76, up=38, pageup=33, right=39			
							if (up) {
								self.step(key == 33 ? 10 : 1, e);

							// DOWN:	j=74, h=72, down=40, pagedown=34, left=37
							} else if (down) {
								self.step(key == 34 ? -10 : -1, e); 
							} 
							return e.preventDefault();
						} 
					});
				}


				input.blur(function(e) {	
					var val = $(this).val();
					if (val !== value) {
						self.setValue(val, e);
					}
				});    


				// HTML5 DOM methods
				$.extend(input[0], { stepUp: self.stepUp, stepDown: self.stepDown});


				// calculate all dimension related stuff
				function init() { 
				 	vertical = conf.vertical || dim(root, "height") > dim(root, "width");

					if (vertical) {
						len = dim(root, "height") - dim(handle, "height");
						origo = root.offset().top + len; 

					} else {
						len = dim(root, "width") - dim(handle, "width");
						origo = root.offset().left;	  
					} 	  
				}

				function begin() {
					init();	
					self.setValue(conf.value !== undefined ? conf.value : conf.min);
				} 
				begin();

				// some browsers cannot get dimensions upon initialization
				if (!len) {  
					$(window).load(begin);
				}
			}

			$.expr[':'].range = function(el) {
				var type = el.getAttribute("type");
				return type && type == 'range' || !!$(el).filter("input").data("rangeinput");
			};


			// jQuery plugin implementation
			$.fn.rangeinput = function(conf) {

				// already installed
				if (this.data("rangeinput")) { return this; } 

				// extend configuration with globals
				conf = $.extend(true, {}, tool.conf, conf);		

				var els;

				this.each(function() {				
					var el = new RangeInput($(this), $.extend(true, {}, conf));		 
					var input = el.getInput().data("rangeinput", el);
					els = els ? els.add(input) : input;	
				});		

				return els ? els : this; 
			};	
		} );
timely.define('external_libs/ai1ec_datepicker', 
		[
		 "jquery_timely"
		 ],
		 function( $ ) {
			
			var DatePicker = function () {
				var	ids = {},
					views = {
						years: 'datepickerViewYears',
						moths: 'datepickerViewMonths',
						days: 'datepickerViewDays'
					},
					tpl = {
						wrapper: '<div class="datepicker"><div class="datepickerBorderT" /><div class="datepickerBorderB" /><div class="datepickerBorderL" /><div class="datepickerBorderR" /><div class="datepickerBorderTL" /><div class="datepickerBorderTR" /><div class="datepickerBorderBL" /><div class="datepickerBorderBR" /><div class="datepickerContainer"><table cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></table></div></div>',
						head: [
							'<td>',
							'<table cellspacing="0" cellpadding="0">',
								'<thead>',
									'<tr>',
										'<th class="datepickerGoPrev"><a href="#"><span><%=prev%></span></a></th>',
										'<th colspan="5" class="datepickerMonth"><a href="#"><span></span></a></th>',
										'<th class="datepickerGoNext"><a href="#"><span><%=next%></span></a></th>',
									'</tr>',
									'<tr class="datepickerDoW">',
										'<th class="ai1ec-datepicker-header-week"><span><%=week%></span></th>',
										'<th><span><%=day1%></span></th>',
										'<th><span><%=day2%></span></th>',
										'<th><span><%=day3%></span></th>',
										'<th><span><%=day4%></span></th>',
										'<th><span><%=day5%></span></th>',
										'<th><span><%=day6%></span></th>',
										'<th><span><%=day7%></span></th>',
									'</tr>',
								'</thead>',
							'</table></td>'
						],
						space : '<td class="datepickerSpace"><div></div></td>',
						days: [
							'<tbody class="datepickerDays">',
								'<tr>',
									'<th class="datepickerWeek ai1ec-datepicker-week"><a href="#"><span><%=weeks[0].week%></span></a></th>',
									'<td class="<%=weeks[0].days[0].classname%>"><a href="#"><span><%=weeks[0].days[0].text%></span></a></td>',
									'<td class="<%=weeks[0].days[1].classname%>"><a href="#"><span><%=weeks[0].days[1].text%></span></a></td>',
									'<td class="<%=weeks[0].days[2].classname%>"><a href="#"><span><%=weeks[0].days[2].text%></span></a></td>',
									'<td class="<%=weeks[0].days[3].classname%>"><a href="#"><span><%=weeks[0].days[3].text%></span></a></td>',
									'<td class="<%=weeks[0].days[4].classname%>"><a href="#"><span><%=weeks[0].days[4].text%></span></a></td>',
									'<td class="<%=weeks[0].days[5].classname%>"><a href="#"><span><%=weeks[0].days[5].text%></span></a></td>',
									'<td class="<%=weeks[0].days[6].classname%>"><a href="#"><span><%=weeks[0].days[6].text%></span></a></td>',
								'</tr>',
								'<tr>',
									'<th class="datepickerWeek ai1ec-datepicker-week"><a href="#"><span><%=weeks[1].week%></span></a></th>',
									'<td class="<%=weeks[1].days[0].classname%>"><a href="#"><span><%=weeks[1].days[0].text%></span></a></td>',
									'<td class="<%=weeks[1].days[1].classname%>"><a href="#"><span><%=weeks[1].days[1].text%></span></a></td>',
									'<td class="<%=weeks[1].days[2].classname%>"><a href="#"><span><%=weeks[1].days[2].text%></span></a></td>',
									'<td class="<%=weeks[1].days[3].classname%>"><a href="#"><span><%=weeks[1].days[3].text%></span></a></td>',
									'<td class="<%=weeks[1].days[4].classname%>"><a href="#"><span><%=weeks[1].days[4].text%></span></a></td>',
									'<td class="<%=weeks[1].days[5].classname%>"><a href="#"><span><%=weeks[1].days[5].text%></span></a></td>',
									'<td class="<%=weeks[1].days[6].classname%>"><a href="#"><span><%=weeks[1].days[6].text%></span></a></td>',
								'</tr>',
								'<tr>',
									'<th class="datepickerWeek ai1ec-datepicker-week"><a href="#"><span><%=weeks[2].week%></span></a></th>',
									'<td class="<%=weeks[2].days[0].classname%>"><a href="#"><span><%=weeks[2].days[0].text%></span></a></td>',
									'<td class="<%=weeks[2].days[1].classname%>"><a href="#"><span><%=weeks[2].days[1].text%></span></a></td>',
									'<td class="<%=weeks[2].days[2].classname%>"><a href="#"><span><%=weeks[2].days[2].text%></span></a></td>',
									'<td class="<%=weeks[2].days[3].classname%>"><a href="#"><span><%=weeks[2].days[3].text%></span></a></td>',
									'<td class="<%=weeks[2].days[4].classname%>"><a href="#"><span><%=weeks[2].days[4].text%></span></a></td>',
									'<td class="<%=weeks[2].days[5].classname%>"><a href="#"><span><%=weeks[2].days[5].text%></span></a></td>',
									'<td class="<%=weeks[2].days[6].classname%>"><a href="#"><span><%=weeks[2].days[6].text%></span></a></td>',
								'</tr>',
								'<tr>',
									'<th class="datepickerWeek ai1ec-datepicker-week"><a href="#"><span><%=weeks[3].week%></span></a></th>',
									'<td class="<%=weeks[3].days[0].classname%>"><a href="#"><span><%=weeks[3].days[0].text%></span></a></td>',
									'<td class="<%=weeks[3].days[1].classname%>"><a href="#"><span><%=weeks[3].days[1].text%></span></a></td>',
									'<td class="<%=weeks[3].days[2].classname%>"><a href="#"><span><%=weeks[3].days[2].text%></span></a></td>',
									'<td class="<%=weeks[3].days[3].classname%>"><a href="#"><span><%=weeks[3].days[3].text%></span></a></td>',
									'<td class="<%=weeks[3].days[4].classname%>"><a href="#"><span><%=weeks[3].days[4].text%></span></a></td>',
									'<td class="<%=weeks[3].days[5].classname%>"><a href="#"><span><%=weeks[3].days[5].text%></span></a></td>',
									'<td class="<%=weeks[3].days[6].classname%>"><a href="#"><span><%=weeks[3].days[6].text%></span></a></td>',
								'</tr>',
								'<tr>',
									'<th class="datepickerWeek ai1ec-datepicker-week"><a href="#"><span><%=weeks[4].week%></span></a></th>',
									'<td class="<%=weeks[4].days[0].classname%>"><a href="#"><span><%=weeks[4].days[0].text%></span></a></td>',
									'<td class="<%=weeks[4].days[1].classname%>"><a href="#"><span><%=weeks[4].days[1].text%></span></a></td>',
									'<td class="<%=weeks[4].days[2].classname%>"><a href="#"><span><%=weeks[4].days[2].text%></span></a></td>',
									'<td class="<%=weeks[4].days[3].classname%>"><a href="#"><span><%=weeks[4].days[3].text%></span></a></td>',
									'<td class="<%=weeks[4].days[4].classname%>"><a href="#"><span><%=weeks[4].days[4].text%></span></a></td>',
									'<td class="<%=weeks[4].days[5].classname%>"><a href="#"><span><%=weeks[4].days[5].text%></span></a></td>',
									'<td class="<%=weeks[4].days[6].classname%>"><a href="#"><span><%=weeks[4].days[6].text%></span></a></td>',
								'</tr>',
								'<tr>',
									'<th class="datepickerWeek ai1ec-datepicker-week"><a href="#"><span><%=weeks[5].week%></span></a></th>',
									'<td class="<%=weeks[5].days[0].classname%>"><a href="#"><span><%=weeks[5].days[0].text%></span></a></td>',
									'<td class="<%=weeks[5].days[1].classname%>"><a href="#"><span><%=weeks[5].days[1].text%></span></a></td>',
									'<td class="<%=weeks[5].days[2].classname%>"><a href="#"><span><%=weeks[5].days[2].text%></span></a></td>',
									'<td class="<%=weeks[5].days[3].classname%>"><a href="#"><span><%=weeks[5].days[3].text%></span></a></td>',
									'<td class="<%=weeks[5].days[4].classname%>"><a href="#"><span><%=weeks[5].days[4].text%></span></a></td>',
									'<td class="<%=weeks[5].days[5].classname%>"><a href="#"><span><%=weeks[5].days[5].text%></span></a></td>',
									'<td class="<%=weeks[5].days[6].classname%>"><a href="#"><span><%=weeks[5].days[6].text%></span></a></td>',
								'</tr>',
							'</tbody>'
						],
						months: [
							'<tbody class="<%=className%>">',
								'<tr>',
									'<td colspan="2"><a href="#"><span><%=data[0]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[1]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[2]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[3]%></span></a></td>',
								'</tr>',
								'<tr>',
									'<td colspan="2"><a href="#"><span><%=data[4]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[5]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[6]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[7]%></span></a></td>',
								'</tr>',
								'<tr>',
									'<td colspan="2"><a href="#"><span><%=data[8]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[9]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[10]%></span></a></td>',
									'<td colspan="2"><a href="#"><span><%=data[11]%></span></a></td>',
								'</tr>',
							'</tbody>'
						]
					},
					defaults = {
						flat: false,
						starts: 1,
						prev: '&#9664;',
						next: '&#9654;',
						lastSel: false,
						mode: 'single',
						view: 'days',
						calendars: 1,
						format: 'Y-m-d',
						position: 'bottom',
						eventName: 'click',
						onRender: function(){return {};},
						onChange: function(){return true;},
						onShow: function(){return true;},
						onBeforeShow: function(){return true;},
						onHide: function(){return true;},
						locale: {
							days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
							daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
							daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
							months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
							monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
							weekMin: 'wk'
						}
					},
					fill = function(el) {
						var options = $(el).data('datepicker');
						var cal = $(el);
						var currentCal = Math.floor(options.calendars/2), date, data, dow, month, cnt = 0, week, days, indic, indic2, html, tblCal;
						cal.find('td>table tbody').remove();
						for (var i = 0; i < options.calendars; i++) {
							date = new Date(options.current);
							date.addMonths(-currentCal + i);
							tblCal = cal.find('table').eq(i+1);
							switch (tblCal[0].className) {
								case 'datepickerViewDays':
									dow = formatDate(date, 'B Y');
									break;
								case 'datepickerViewMonths':
									dow = date.getFullYear();
									break;
								case 'datepickerViewYears':
									dow = (date.getFullYear()-6) + ' - ' + (date.getFullYear()+5);
									break;
							} 
							tblCal.find('thead tr:first th:eq(1) span').text(dow);
							dow = date.getFullYear()-6;
							data = {
								data: [],
								className: 'datepickerYears'
							}
							for ( var j = 0; j < 12; j++) {
								data.data.push(dow + j);
							}
							html = tmpl(tpl.months.join(''), data);
							date.setDate(1);
							data = {weeks:[], test: 10};
							month = date.getMonth();
							var dow = (date.getDay() - options.starts) % 7;
							date.addDays(-(dow + (dow < 0 ? 7 : 0)));
							week = -1;
							cnt = 0;
							while (cnt < 42) {
								indic = parseInt(cnt/7,10);
								indic2 = cnt%7;
								if (!data.weeks[indic]) {
									week = date.getWeekNumber();
									data.weeks[indic] = {
										week: week,
										days: []
									};
								}
								data.weeks[indic].days[indic2] = {
									text: date.getDate(),
									classname: []
								};
								if (month != date.getMonth()) {
									data.weeks[indic].days[indic2].classname.push('datepickerNotInMonth');
								}
								if (date.getDay() == 0) {
									data.weeks[indic].days[indic2].classname.push('datepickerSunday');
								}
								if (date.getDay() == 6) {
									data.weeks[indic].days[indic2].classname.push('datepickerSaturday');
								}
								var fromUser = options.onRender(date);
								var val = date.valueOf();
								if (fromUser.selected || options.date == val || $.inArray(val, options.date) > -1 || (options.mode == 'range' && val >= options.date[0] && val <= options.date[1])) {
									data.weeks[indic].days[indic2].classname.push('datepickerSelected');
								}
								if (fromUser.disabled) {
									data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
								}
								if (fromUser.className) {
									data.weeks[indic].days[indic2].classname.push(fromUser.className);
								}
								data.weeks[indic].days[indic2].classname = data.weeks[indic].days[indic2].classname.join(' ');
								cnt++;
								date.addDays(1);
							}
							html = tmpl(tpl.days.join(''), data) + html;
							data = {
								data: options.locale.monthsShort,
								className: 'datepickerMonths'
							};
							html = tmpl(tpl.months.join(''), data) + html;
							tblCal.append(html);
						}
					},
					parseDate = function (date, format) {
						if (date.constructor == Date) {
							return new Date(date);
						}
						var parts = date.split(/\W+/);
						var against = format.split(/\W+/), d, m, y, h, min, now = new Date();
						for (var i = 0; i < parts.length; i++) {
							switch (against[i]) {
								case 'd':
								case 'e':
									d = parseInt(parts[i],10);
									break;
								case 'm':
									m = parseInt(parts[i], 10)-1;
									break;
								case 'Y':
								case 'y':
									y = parseInt(parts[i], 10);
									y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
									break;
								case 'H':
								case 'I':
								case 'k':
								case 'l':
									h = parseInt(parts[i], 10);
									break;
								case 'P':
								case 'p':
									if (/pm/i.test(parts[i]) && h < 12) {
										h += 12;
									} else if (/am/i.test(parts[i]) && h >= 12) {
										h -= 12;
									}
									break;
								case 'M':
									min = parseInt(parts[i], 10);
									break;
							}
						}
						return new Date(
							y === undefined ? now.getFullYear() : y,
							m === undefined ? now.getMonth() : m,
							d === undefined ? now.getDate() : d,
							h === undefined ? now.getHours() : h,
							min === undefined ? now.getMinutes() : min,
							0
						);
					},
					formatDate = function(date, format) {
						var m = date.getMonth();
						var d = date.getDate();
						var y = date.getFullYear();
						var wn = date.getWeekNumber();
						var w = date.getDay();
						var s = {};
						var hr = date.getHours();
						var pm = (hr >= 12);
						var ir = (pm) ? (hr - 12) : hr;
						var dy = date.getDayOfYear();
						if (ir == 0) {
							ir = 12;
						}
						var min = date.getMinutes();
						var sec = date.getSeconds();
						var parts = format.split(''), part;
						for ( var i = 0; i < parts.length; i++ ) {
							part = parts[i];
							switch (parts[i]) {
								case 'a':
									part = date.getDayName();
									break;
								case 'A':
									part = date.getDayName(true);
									break;
								case 'b':
									part = date.getMonthName();
									break;
								case 'B':
									part = date.getMonthName(true);
									break;
								case 'C':
									part = 1 + Math.floor(y / 100);
									break;
								case 'd':
									part = (d < 10) ? ("0" + d) : d;
									break;
								case 'e':
									part = d;
									break;
								case 'H':
									part = (hr < 10) ? ("0" + hr) : hr;
									break;
								case 'I':
									part = (ir < 10) ? ("0" + ir) : ir;
									break;
								case 'j':
									part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
									break;
								case 'k':
									part = hr;
									break;
								case 'l':
									part = ir;
									break;
								case 'm':
									part = (m < 9) ? ("0" + (1+m)) : (1+m);
									break;
								case 'M':
									part = (min < 10) ? ("0" + min) : min;
									break;
								case 'p':
								case 'P':
									part = pm ? "PM" : "AM";
									break;
								case 's':
									part = Math.floor(date.getTime() / 1000);
									break;
								case 'S':
									part = (sec < 10) ? ("0" + sec) : sec;
									break;
								case 'u':
									part = w + 1;
									break;
								case 'w':
									part = w;
									break;
								case 'y':
									part = ('' + y).substr(2, 2);
									break;
								case 'Y':
									part = y;
									break;
							}
							parts[i] = part;
						}
						return parts.join('');
					},
					extendDate = function(options) {
						if (Date.prototype.tempDate) {
							return;
						}
						Date.prototype.tempDate = null;
						Date.prototype.months = options.months;
						Date.prototype.monthsShort = options.monthsShort;
						Date.prototype.days = options.days;
						Date.prototype.daysShort = options.daysShort;
						Date.prototype.getMonthName = function(fullName) {
							return this[fullName ? 'months' : 'monthsShort'][this.getMonth()];
						};
						Date.prototype.getDayName = function(fullName) {
							return this[fullName ? 'days' : 'daysShort'][this.getDay()];
						};
						Date.prototype.addDays = function (n) {
							this.setDate(this.getDate() + n);
							this.tempDate = this.getDate();
						};
						Date.prototype.addMonths = function (n) {
							if (this.tempDate == null) {
								this.tempDate = this.getDate();
							}
							this.setDate(1);
							this.setMonth(this.getMonth() + n);
							this.setDate(Math.min(this.tempDate, this.getMaxDays()));
						};
						Date.prototype.addYears = function (n) {
							if (this.tempDate == null) {
								this.tempDate = this.getDate();
							}
							this.setDate(1);
							this.setFullYear(this.getFullYear() + n);
							this.setDate(Math.min(this.tempDate, this.getMaxDays()));
						};
						Date.prototype.getMaxDays = function() {
							var tmpDate = new Date(Date.parse(this)),
								d = 28, m;
							m = tmpDate.getMonth();
							d = 28;
							while (tmpDate.getMonth() == m) {
								d ++;
								tmpDate.setDate(d);
							}
							return d - 1;
						};
						Date.prototype.getFirstDay = function() {
							var tmpDate = new Date(Date.parse(this));
							tmpDate.setDate(1);
							return tmpDate.getDay();
						};
						Date.prototype.getWeekNumber = function() {
							var tempDate = new Date(this);
							tempDate.setDate(tempDate.getDate() - (tempDate.getDay() + 6) % 7 + 3);
							var dms = tempDate.valueOf();
							tempDate.setMonth(0);
							tempDate.setDate(4);
							return Math.round((dms - tempDate.valueOf()) / (604800000)) + 1;
						};
						Date.prototype.getDayOfYear = function() {
							var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
							var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
							var time = now - then;
							return Math.floor(time / 24*60*60*1000);
						};
					},
					layout = function (el) {
						var options = $(el).data('datepicker');
						var cal = $('#' + options.id);
						if (!options.extraHeight) {
							var divs = $(el).find('div');
							options.extraHeight = divs.get(0).offsetHeight + divs.get(1).offsetHeight;
							options.extraWidth = divs.get(2).offsetWidth + divs.get(3).offsetWidth;
						}
						var tbl = cal.find('table:first').get(0);
						var width = tbl.offsetWidth;
						var height = tbl.offsetHeight;
						cal.css({
							width: width + options.extraWidth + 'px',
							height: height + options.extraHeight + 'px'
						}).find('div.datepickerContainer').css({
							width: width + 'px',
							height: height + 'px'
						});
					},
					click = function(ev) {
						if ($(ev.target).is('span')) {
							ev.target = ev.target.parentNode;
						}
						var el = $(ev.target);
						if (el.is('a')) {
							ev.target.blur();
							if (el.hasClass('datepickerDisabled')) {
								return false;
							}
							var options = $(this).data('datepicker');
							var parentEl = el.parent();
							var tblEl = parentEl.parent().parent().parent();
							var tblIndex = $('table', this).index(tblEl.get(0)) - 1;
							var tmp = new Date(options.current);
							var changed = false;
							var fillIt = false;
							if (parentEl.is('th')) {
								if (parentEl.hasClass('datepickerWeek') && options.mode == 'range' && !parentEl.next().hasClass('datepickerDisabled')) {
									var val = parseInt(parentEl.next().text(), 10);
									tmp.addMonths(tblIndex - Math.floor(options.calendars/2));
									if (parentEl.next().hasClass('datepickerNotInMonth')) {
										tmp.addMonths(val > 15 ? -1 : 1);
									}
									tmp.setDate(val);
									options.date[0] = (tmp.setHours(0,0,0,0)).valueOf();
									tmp.setHours(23,59,59,0);
									tmp.addDays(6);
									options.date[1] = tmp.valueOf();
									fillIt = true;
									changed = true;
									options.lastSel = false;
								} else if (parentEl.hasClass('datepickerMonth')) { 
									if ( options.month_link_inactive ){
										return false;
									}
									tmp.addMonths(tblIndex - Math.floor(options.calendars/2));
									switch (tblEl.get(0).className) {
										case 'datepickerViewDays':
											tblEl.get(0).className = 'datepickerViewMonths';
											el.find('span').text(tmp.getFullYear());
											break;
										case 'datepickerViewMonths':
											tblEl.get(0).className = 'datepickerViewYears';
											el.find('span').text((tmp.getFullYear()-6) + ' - ' + (tmp.getFullYear()+5));
											break;
										case 'datepickerViewYears':
											tblEl.get(0).className = 'datepickerViewDays';
											el.find('span').text(formatDate(tmp, 'B, Y'));
											break;
									}
								} else if (parentEl.parent().parent().is('thead')) {
									switch (tblEl.get(0).className) {
										case 'datepickerViewDays':
											options.current.addMonths(parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
											break;
										case 'datepickerViewMonths':
											options.current.addYears(parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
											break;
										case 'datepickerViewYears':
											options.current.addYears(parentEl.hasClass('datepickerGoPrev') ? -12 : 12);
											break;
									}
									fillIt = true;
								}
							} else if (parentEl.is('td') && !parentEl.hasClass('datepickerDisabled')) {
								switch (tblEl.get(0).className) {
									case 'datepickerViewMonths':
										options.current.setMonth(tblEl.find('tbody.datepickerMonths td').index(parentEl));
										options.current.setFullYear(parseInt(tblEl.find('thead th.datepickerMonth span').text(), 10));
										options.current.addMonths(Math.floor(options.calendars/2) - tblIndex);
										tblEl.get(0).className = 'datepickerViewDays';
										break;
									case 'datepickerViewYears':
										options.current.setFullYear(parseInt(el.text(), 10));
										tblEl.get(0).className = 'datepickerViewMonths';
										break;
									default:
										var val = parseInt(el.text(), 10);
										tmp.addMonths(tblIndex - Math.floor(options.calendars/2));
										if (parentEl.hasClass('datepickerNotInMonth')) {
											tmp.addMonths(val > 15 ? -1 : 1);
										}
										tmp.setDate(val);
										switch (options.mode) {
											case 'multiple':
												val = (tmp.setHours(0,0,0,0)).valueOf();
												if ($.inArray(val, options.date) > -1) {
													$.each(options.date, function(nr, dat){
														if (dat == val) {
															options.date.splice(nr,1);
															return false;
														}
													});
												} else {
													options.date.push(val);
												}
												break;
											case 'range':
												if (!options.lastSel) {
													options.date[0] = (tmp.setHours(0,0,0,0)).valueOf();
												}
												val = (tmp.setHours(23,59,59,0)).valueOf();
												if (val < options.date[0]) {
													options.date[1] = options.date[0] + 86399000;
													options.date[0] = val - 86399000;
												} else {
													options.date[1] = val;
												}
												options.lastSel = !options.lastSel;
												break;
											default:
												options.date = tmp.valueOf();
												break;
										}
										break;
								}
								fillIt = true;
								changed = true;
							}
							if (fillIt) {
								fill(this);
							}
							if (changed) {
								options.onChange.apply(this, prepareDate(options));
							}
						}
						return false;
					},
					prepareDate = function (options) {
						var tmp;
						if (options.mode == 'single') {
							tmp = new Date(options.date);
							return [formatDate(tmp, options.format), tmp, options.el];
						} else {
							tmp = [[],[], options.el];
							$.each(options.date, function(nr, val){
								var date = new Date(val);
								tmp[0].push(formatDate(date, options.format));
								tmp[1].push(date);
							});
							return tmp;
						}
					},
					getViewport = function () {
						var m = document.compatMode == 'CSS1Compat';
						return {
							l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
							t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
							w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
							h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
						};
					},
					isChildOf = function(parentEl, el, container) {
						if (parentEl == el) {
							return true;
						}
						if (parentEl.contains) {
							return parentEl.contains(el);
						}
						if ( parentEl.compareDocumentPosition ) {
							return !!(parentEl.compareDocumentPosition(el) & 16);
						}
						var prEl = el.parentNode;
						while(prEl && prEl != container) {
							if (prEl == parentEl)
								return true;
							prEl = prEl.parentNode;
						}
						return false;
					},
					show = function (ev) {
						var cal = $('#' + $(this).data('datepickerId'));
						if (!cal.is(':visible')) {
							var calEl = cal.get(0);
							fill(calEl);
							var options = cal.data('datepicker');
							options.onBeforeShow.apply(this, [cal.get(0)]);
							var pos = $(this).offset();
							var viewPort = getViewport();
							var top = pos.top;
							var left = pos.left;
							var oldDisplay = $.curCSS(calEl, 'display');
							cal.css({
								visibility: 'hidden',
								display: 'block'
							});
							layout(calEl);
							switch (options.position){
								case 'top':
									top -= calEl.offsetHeight;
									break;
								case 'left':
									left -= calEl.offsetWidth;
									break;
								case 'right':
									left += this.offsetWidth;
									break;
								case 'bottom':
									top += this.offsetHeight;
									break;
							}
							if (top + calEl.offsetHeight > viewPort.t + viewPort.h) {
								top = pos.top  - calEl.offsetHeight;
							}
							if (top < viewPort.t) {
								top = pos.top + this.offsetHeight + calEl.offsetHeight;
							}
							if (left + calEl.offsetWidth > viewPort.l + viewPort.w) {
								left = pos.left - calEl.offsetWidth;
							}
							if (left < viewPort.l) {
								left = pos.left + this.offsetWidth
							}
							cal.css({
								visibility: 'visible',
								display: 'block',
								top: top + 'px',
								left: left + 'px'
							});
							if (options.onShow.apply(this, [cal.get(0)]) != false) {
								cal.show();
							}
							$(document).bind('mousedown', {cal: cal, trigger: this}, hide);
						}
						return false;
					},
					hide = function (ev) {
						if (ev.target != ev.data.trigger && !isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
							if (ev.data.cal.data('datepicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
								ev.data.cal.hide();
							}
							$(document).unbind('mousedown', hide);
						}
					};
				return {
					init: function(options){
						options = $.extend(true, {}, defaults, options || {});
						extendDate(options.locale);
						options.calendars = Math.max(1, parseInt(options.calendars,10)||1);
						options.mode = /single|multiple|range/.test(options.mode) ? options.mode : 'single';
						return this.each(function(){
							if (!$(this).data('datepicker')) {
								options.el = this;
								if (options.date.constructor == String) {
									options.date = parseDate(options.date, options.format);
									options.date.setHours(0,0,0,0);
								}
								if (options.mode != 'single') {
									if (options.date.constructor != Array) {
										options.date = [options.date.valueOf()];
										if (options.mode == 'range') {
											options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
										}
									} else {
										for (var i = 0; i < options.date.length; i++) {
											options.date[i] = (parseDate(options.date[i], options.format).setHours(0,0,0,0)).valueOf();
										}
										if (options.mode == 'range') {
											options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
										}
									}
								} else {
									options.date = options.date.valueOf();
								}
								if (!options.current) {
									options.current = new Date();
								} else {
									options.current = parseDate(options.current, options.format);
								} 
								options.current.setDate(1);
								options.current.setHours(0,0,0,0);
								var id = 'datepicker_' + parseInt(Math.random() * 1000), cnt;
								options.id = id;
								$(this).data('datepickerId', options.id);
								var cal = $(tpl.wrapper).attr('id', id).bind('click', click).data('datepicker', options);
								if (options.className) {
									cal.addClass(options.className);
								}
								var html = '';
								for (var i = 0; i < options.calendars; i++) {
									cnt = options.starts;
									if (i > 0) {
										html += tpl.space;
									}
									html += tmpl(tpl.head.join(''), {
											week: options.locale.weekMin,
											prev: options.prev,
											next: options.next,
											day1: options.locale.daysMin[(cnt++)%7],
											day2: options.locale.daysMin[(cnt++)%7],
											day3: options.locale.daysMin[(cnt++)%7],
											day4: options.locale.daysMin[(cnt++)%7],
											day5: options.locale.daysMin[(cnt++)%7],
											day6: options.locale.daysMin[(cnt++)%7],
											day7: options.locale.daysMin[(cnt++)%7]
										});
								}
								cal
									.find('tr:first').append(html)
										.find('table').addClass(views[options.view]);
								fill(cal.get(0));
								if (options.flat) {
									cal.appendTo(this).show().css('position', 'relative');
									layout(cal.get(0));
								} else {
									cal.appendTo(document.body);
									$(this).bind(options.eventName, show);
								}
							}
						});
					},
					showPicker: function() {
						return this.each( function () {
							if ($(this).data('datepickerId')) {
								show.apply(this);
							}
						});
					},
					hidePicker: function() {
						return this.each( function () {
							if ($(this).data('datepickerId')) {
								$('#' + $(this).data('datepickerId')).hide();
							}
						});
					},
					setDate: function(date, shiftTo){
						return this.each(function(){
							if ($(this).data('datepickerId')) {
								var cal = $('#' + $(this).data('datepickerId'));
								var options = cal.data('datepicker');
								options.date = date;
								if (options.date.constructor == String) {
									options.date = parseDate(options.date, options.format);
									options.date.setHours(0,0,0,0);
								}
								if (options.mode != 'single') {
									if (options.date.constructor != Array) {
										options.date = [options.date.valueOf()];
										if (options.mode == 'range') {
											options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
										}
									} else {
										for (var i = 0; i < options.date.length; i++) {
											options.date[i] = (parseDate(options.date[i], options.format).setHours(0,0,0,0)).valueOf();
										}
										if (options.mode == 'range') {
											options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
										}
									}
								} else {
									options.date = options.date.valueOf();
								}
								if (shiftTo) {
									options.current = new Date (options.mode != 'single' ? options.date[0] : options.date);
								}
								fill(cal.get(0));
							}
						});
					},
					getDate: function(formated) {
						if (this.size() > 0) {
							return prepareDate($('#' + $(this).data('datepickerId')).data('datepicker'))[formated ? 0 : 1];
						}
					},
					clear: function(){
						return this.each(function(){
							if ($(this).data('datepickerId')) {
								var cal = $('#' + $(this).data('datepickerId'));
								var options = cal.data('datepicker');
								if (options.mode != 'single') {
									options.date = [];
									fill(cal.get(0));
								}
							}
						});
					},
					fixLayout: function(){
						return this.each(function(){
							if ($(this).data('datepickerId')) {
								var cal = $('#' + $(this).data('datepickerId'));
								var options = cal.data('datepicker');
								if (options.flat) {
									layout(cal.get(0));
								}
							}
						});
					}
				};
			}();
			$.fn.extend({
				DatePicker: DatePicker.init,
				DatePickerHide: DatePicker.hidePicker,
				DatePickerShow: DatePicker.showPicker,
				DatePickerSetDate: DatePicker.setDate,
				DatePickerGetDate: DatePicker.getDate,
				DatePickerClear: DatePicker.clear,
				DatePickerLayout: DatePicker.fixLayout
			});
			  var cache = {};

			   var tmpl = function(str, data){
			     // Figure out if we're getting a template, or if we need to
			     // load the template - and be sure to cache the result.
			     var fn = !/\W/.test(str) ?
			       cache[str] = cache[str] ||
			         tmpl(document.getElementById(str).innerHTML) :
			      
			       // Generate a reusable function that will serve as a template
			       // generator (and which will be cached).
			       new Function("obj",
			         "var p=[],print=function(){p.push.apply(p,arguments);};" +
			        
			         // Introduce the data as local variables using with(){}
			         "with(obj){p.push('" +
			        
			         // Convert the template into pure JavaScript
			         str
			           .replace(/[\r\t\n]/g, " ")
			           .split("<%").join("\t")
			           .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			           .replace(/\t=(.*?)%>/g, "',$1,'")
			           .split("\t").join("');")
			           .split("%>").join("p.push('")
			           .split("\r").join("\\'")
			       + "');}return p.join('');");
			    
			     // Provide some basic currying to the user
			     return data ? fn( data ) : fn;
			   };
		} );
/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


timely.define('external_libs/bootstrap/transition', ["jquery_timely"], function( $ ) {  // jshint ;_;

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

} );

/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


timely.define('external_libs/bootstrap/collapse', ["jquery_timely"], function( $ ) {  // jshint ;_;

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('ai1ec-width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('ai1ec-in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .ai1ec-panel > .ai1ec-in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('ai1ec-collapse')
      .addClass('ai1ec-collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('ai1ec-collapsing')
        .addClass('ai1ec-in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('ai1ec-in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('ai1ec-collapsing')
      .removeClass('ai1ec-collapse')
      .removeClass('ai1ec-in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('ai1ec-collapsing')
        .addClass('ai1ec-collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('ai1ec-in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=ai1ec-collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=ai1ec-collapse][data-parent="' + parent + '"]').not($this).addClass('ai1ec-collapsed')
      $this[$target.hasClass('ai1ec-in') ? 'addClass' : 'removeClass']('ai1ec-collapsed')
    }

    $target.collapse(option)
  })

} );

/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


timely.define('external_libs/bootstrap/modal', ["jquery_timely"], function( $ ) {  // jshint ;_;

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="ai1ec-modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('ai1ec-fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('ai1ec-in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.ai1ec-modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('ai1ec-in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('ai1ec-fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('ai1ec-fade') ? 'ai1ec-fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="ai1ec-modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('ai1ec-in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('ai1ec-in')

      $.support.transition && this.$element.hasClass('ai1ec-fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="ai1ec-modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.ai1ec-modal', function () { $(document.body).addClass('ai1ec-modal-open') })
    .on('hidden.bs.modal', '.ai1ec-modal', function () { $(document.body).removeClass('ai1ec-modal-open') })

} );

/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


timely.define('external_libs/bootstrap/alert', ["jquery_timely"], function( $ ) {  // jshint ;_;

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="ai1ec-alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('ai1ec-alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('ai1ec-in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('ai1ec-fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

} );

timely.define('external_libs/select2',
		[
		 "jquery_timely"
		 ],
function( jQuery ) {

/*
Copyright 2012 Igor Vaynberg

Version: 3.3.1 Timestamp: Wed Feb 20 09:57:22 PST 2013

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
 (function ($) {
 	if(typeof $.fn.each2 == "undefined"){
 		$.fn.extend({
 			/*
			* 4-10 times faster .each replacement
			* use it carefully, as it overrides jQuery context of element on each iteration
			*/
			each2 : function (c) {
				var j = $([0]), i = -1, l = this.length;
				while (
					++i < l
					&& (j.context = j[0] = this[i])
					&& c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
				);
				return this;
			}
 		});
 	}
})(jQuery);

(function ($, undefined) {
    
    /*global document, window, jQuery, console */

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition, $document;

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    };

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a === b+'';
        if (b.constructor === String) return b === a+'';
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.bind("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.bind("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.bind("mousemove", function (e) {
        lastMousePosition = {x: e.pageX, y: e.pageY};
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
	    element.bind("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.bind("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* after the focus is set move the caret to the end, necessary when we val()
                just before setting focus */
            if(el.setSelectionRange)
            {
                el.setSelectionRange(pos, pos);
            }
            else if (el.createTextRange) {
                range = el.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }

        }, 0);
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
        	var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
        	sizer = $(document.createElement("div")).css({
	            position: "absolute",
	            left: "-10000px",
	            top: "-10000px",
	            display: "none",
	            fontSize: style.fontSize,
	            fontFamily: style.fontFamily,
	            fontStyle: style.fontStyle,
	            fontWeight: style.fontWeight,
	            letterSpacing: style.letterSpacing,
	            textTransform: style.textTransform,
	            whiteSpace: "nowrap"
	        });
            sizer.attr("class","select2-sizer");
        	$("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = dest.attr("class");
        if (typeof classes === "string") {
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = src.attr("class");
        if (typeof classes === "string") {
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (typeof adapted === "string" && adapted.length > 0) {
                        replacements.push(this);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=text.toUpperCase().indexOf(term.toUpperCase()),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.traditional a boolean flag that should be true if you wish to use the traditional style of param serialization for the ajax request
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.ajax,
                    type = options.type || 'GET', // set type of request (GET or POST)
                    params = {};

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if( null !== handler) { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    type: type,
                    cache: false,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

		 if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

		 if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = data.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            $(isFunc ? data() : data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error("formatterName must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice(token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results", mask;

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                this.destroy();
            }

            this.enabled=true;
            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            this.elementTabIndex = this.opts.element.attr("tabIndex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .addClass("select2-offscreen")
                .bind("focus.select2", function() { $(this).select2("focus"); })
                .attr("tabIndex", "-1")
                .before(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            search.attr("tabIndex", this.elementTabIndex);

            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            installFilteredMouseMove(this.results);
            this.dropdown.delegate(resultsSelector, "mousemove-filtered touchstart touchmove touchend", this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded));

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.bind("keyup-change input paste", this.bind(this.updateResults));
            search.bind("focus", function () { search.addClass("select2-focused"); });
            search.bind("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.delegate(resultsSelector, "mouseup", this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.bind("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.element.is(":disabled") || opts.element.is("[readonly='readonly']")) this.disable();
        },

        // abstract
        destroy: function () {
            var select2 = this.opts.element.data("select2");

            if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }

            if (select2 !== undefined) {

                select2.container.remove();
                select2.dropdown.remove();
                select2.opts.element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .unbind(".select2")
                    .attr({"tabIndex": this.elementTabIndex})
                    .show();
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate,  data, result, children, id=this.opts.id, self=this;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.attr("data-select2-tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, firstChild, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push({id:element.attr("value"), text:element.text(), element: element.get(), css: element.attr("class"), disabled: equal(element.attr("disabled"), "disabled") });
                            }
                        } else if (element.is("optgroup")) {
                            group={text:element.attr("label"), children:[], element: element.get(), css: element.attr("class")};
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        firstChild = children[0];
                        if ($(firstChild).text() === "") {
                            children=children.not(firstChild);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: term, text: term}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var id = this, text = this, tags=opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, id)) { text = this.text; return false; } });
                                    data.push({id: id, text: text});
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, sync;

            el.bind("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            sync = this.bind(function () {

                var enabled, readonly, self = this;

                // sync enabled state

                enabled = this.opts.element.attr("disabled") !== "disabled";
                readonly = this.opts.element.attr("readonly") === "readonly";

                enabled = enabled && !readonly;

                if (this.enabled !== enabled) {
                    if (enabled) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                }


                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

            });

            // mozilla and IE
            el.bind("propertychange.select2 DOMAttrModified.select2", sync);
            // safari and chrome
            if (typeof WebKitMutationObserver !== "undefined") {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new WebKitMutationObserver(function (mutations) {
                    mutations.forEach(sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        // abstract
        enable: function() {
            if (this.enabled) return;

            this.enabled=true;
            this.container.removeClass("select2-container-disabled");
            this.opts.element.removeAttr("disabled");
        },

        // abstract
        disable: function() {
            if (!this.enabled) return;

            this.close();

            this.enabled=false;
            this.container.addClass("select2-container-disabled");
            this.opts.element.attr("disabled", "disabled");
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = this.dropdown.outerHeight(false),
	            viewPortRight = $(window).scrollLeft() + $(window).width(),
                viewportBottom = $(window).scrollTop() + $(window).height(),
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
	            dropWidth = this.dropdown.outerWidth(false),
	            enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = this.dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                css;

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static

            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            // always prefer the current above/below alignment, unless there is not enough room

            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) above = false;
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) above = true;
            }

            if (!enoughRoomOnRight) {
               dropLeft = offset.left + width - dropWidth;
            }

            if (above) {
                dropTop = offset.top - dropHeight;
                this.container.addClass("select2-drop-above");
                this.dropdown.addClass("select2-drop-above");
            }
            else {
                this.container.removeClass("select2-drop-above");
                this.dropdown.removeClass("select2-drop-above");
            }

            css = $.extend({
                top: dropTop,
                left: dropLeft,
                width: width
            }, evaluate(this.opts.dropdownCss));

            this.dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            event = $.Event("opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            window.setTimeout(this.bind(this.opening), 1);

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.clearDropdownAlignmentPreference();

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");


            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            this.updateResults(true);

            // create the dropdown mask if doesnt already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body());
                mask.bind("mousedown touchstart", function (e) {
                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.css({
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight});
            mask.show();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");
            this.ensureHighlightVisible();

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).bind(resize+" "+scroll+" "+orient, function (e) {
                    $("#select2-drop-mask").css({
                        width:document.documentElement.scrollWidth,
                        height:document.documentElement.scrollHeight});
                    that.positionDropdown();
                });
            });

            this.focusSearch();
        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).unbind(scroll).unbind(resize).unbind(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open");
            this.results.empty();
            this.clearSearch();

            this.opts.element.trigger($.Event("close"));
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices();

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            var h=this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
            return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.results.find(".select2-highlighted").removeClass("select2-highlighted");

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            this.ensureHighlightVisible();

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "highlight", val: this.id(data), choice: data });
            }
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
        		var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove al highlights
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search, results = this.results, opts = this.opts, data, self=this, input;

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            search.addClass("select2-active");

            function postRender() {
                results.scrollTop(0);
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
            	    render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>");
            	    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }
            else if (opts.formatSearching() && initial===true) {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) return;

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(null, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            }
        },

        // abstract
        getPlaceholder: function () {
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder;
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '')
                                .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

		createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",
                "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>",
                "   <div><b></b></div>" ,
                "</a>",
                "<input class='select2-focusser select2-offscreen' type='text'/>",
                "<div class='select2-drop' style='display:none'>" ,
                "   <div class='select2-search'>" ,
                "       <input type='text' autocomplete='off' class='select2-input'/>" ,
                "   </div>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
            return container;
        },

        // single
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.focusser.attr("disabled", "disabled");
        },

        // single
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.focusser.removeAttr("disabled");
        },

        // single
        opening: function () {
            this.parent.opening.apply(this, arguments);
            this.focusser.attr("disabled", "disabled");

            this.opts.element.trigger($.Event("open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            focus(this.focusser);
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.removeAttr("disabled");
                this.focusser.focus();
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            this.focusser.focus();
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                clickingInside = false;

            this.showSearch(this.opts.minimumResultsForSearch >= 0);

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.TAB:
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.focusser.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {
                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.bind("keyup-change input", this.bind(function(e) {
                if (this.opened()) return;
                this.open();
                if (this.showSearchInput !== false) {
                    this.search.val(this.focusser.val());
                }
                this.focusser.val("");
                killEvent(e);
            }));

            selection.delegate("abbr", "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.bind("mousedown", this.bind(function (e) {
                clickingInside = true;

                if (this.opened()) {
                    this.close();
                } else if (this.enabled) {
                    this.open();
                }

                killEvent(e);

                clickingInside = false;
            }));

            dropdown.bind("mousedown", this.bind(function() { this.search.focus(); }));

            selection.bind("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.bind("focus", this.bind(function(){
                this.container.addClass("select2-container-active");
            })).bind("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                }
            }));
            this.search.bind("focus", this.bind(function(){
                this.container.addClass("select2-container-active");
            }))

            this.initContainerWidth();
            this.setPlaceholder();

        },

        // single
        clear: function() {
            var data=this.selection.data("select2-data");
            this.opts.element.val("");
            this.selection.find("span").empty();
            this.selection.removeData("select2-data");
            this.setPlaceholder();

            this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
            this.triggerChange({removed:data});
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    if ($.isFunction(callback))
                        callback({id: selected.attr("value"), text: selected.text(), element:selected});
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id
                    opts.query({
                        matcher: function(term, text, el){
                            return equal(id, opts.id(el));
                        },
                        callback: !$.isFunction(callback) ? $.noop : function(filtered) {
                            callback(filtered.results.length ? filtered.results[0] : null);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without the first empty option ignore it
            if (this.select) {
                if (this.select.find("option").first().text() !== "") {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.opts.element.val() === "" && placeholder !== undefined) {

                // check for a first blank option if attached to a select
                if (this.select && this.select.find("option:first").text() !== "") return;

                this.selection.find("span").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.selection.find("abbr").hide();
            }
        },

        // single
        postprocessResults: function (data, initial) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it

            this.highlight(selected);

            // hide the search box if this is the first we got the results and there are a few of them

            if (initial === true) {
                var min=this.opts.minimumResultsForSearch;
                showSearchInput  = min < 0 ? false : countResults(data.results) >= min;
                this.showSearch(showSearchInput);
            }

        },

        // single
        showSearch: function(showSearchInput) {
            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search")[showSearchInput ? "removeClass" : "addClass"]("select2-search-hidden");
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox");
        },

        // single
        onSelect: function (data, options) {
            var old = this.opts.element.val();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            this.close();

            if (!options || !options.noFocus)
                this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange(); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find("span"), formatted;

            this.selection.data("select2-data", data);

            container.empty();
            formatted=this.opts.formatSelection(data, container);
            if (formatted !== undefined) {
                container.append(this.opts.escapeMarkup(formatted));
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.selection.find("abbr").show();
            }
        },

        // single
        val: function () {
            var val, triggerChange = false, data = null, self = this;

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find(":selected").each2(function (i, elm) {
                        data = {id: elm.attr("value"), text: elm.text()};
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange();
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear();
                    if (triggerChange) {
                        this.triggerChange();
                    }
                    return;
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange();
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (!value || value === "") {
                    this.clear();
                } else {
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "    <ul class='select2-choices'>",
                //"<li class='select2-search-choice'><span>California</span><a href="javascript:void(0)" class="select2-search-choice-close"></a></li>" ,
                "  <li class='select2-search-field'>" ,
                "    <input type='text' autocomplete='off' class='select2-input'>" ,
                "  </li>" ,
                "</ul>" ,
                "<div class='select2-drop select2-drop-multi' style='display:none;'>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
			return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find(":selected").each2(function (i, elm) {
                        data.push({id: elm.attr("value"), text: elm.text(), element: elm[0]});
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids
                    opts.query({
                        matcher: function(term, text, el){
                            return $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function(filtered) {
                            callback(filtered.results);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            this.search.bind("input paste", this.bind(function() {
                if (!this.enabled) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close();

                    var choices,
                        selected = selection.find(".select2-search-choice-focus");
                    if (selected.length > 0) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        killEvent(e);
                        return;
                    }

                    choices = selection.find(".select2-search-choice:not(.select2-locked)");
                    if (choices.length > 0) {
                        choices.last().addClass("select2-search-choice-focus");
                    }
                } else {
                    selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                    case KEY.TAB:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }
            }));

            this.search.bind("keyup", this.bind(this.resizeSearch));

            this.search.bind("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
            }));

            this.container.delegate(selector, "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.clearPlaceholder();
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.delegate(selector, "focus", this.bind(function () {
                if (!this.enabled) return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.search.removeAttr("disabled");
        },

        // multi
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.search.attr("disabled", true);
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                this.resizeSearch();
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.parent.opening.apply(this, arguments);

            this.clearPlaceholder();
			this.resizeSearch();
            this.focusSearch();

            this.opts.element.trigger($.Event("open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
            this.opts.element.triggerHandler("focus");
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer(input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {
            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults();

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted;

            formatted=this.opts.formatSelection(data, choice.find("div"));
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+this.opts.escapeMarkup(formatted)+"</div>");
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .bind("mousedown", killEvent)
                  .bind("click dblclick", this.bind(function (e) {
                  if (!this.enabled) return;

                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                      this.unselect($(e.target));
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                      this.close();
                      this.focusSearch();
                  })).dequeue();
                  killEvent(e);
              })).bind("focus", this.bind(function () {
                  if (!this.enabled) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            index = indexOf(this.id(data), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();

            this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function () {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesnt have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1){
                self.highlight(0);
            }

        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
            	sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(searchWidth);
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        val: function () {
            var val, triggerChange = false, data = [], self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange();
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange();
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$(data).map(self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange();
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection

            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values) {
            var self=this, ids;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.attr("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;
                if (args[0] === "container") {
                    value=select2.container;
                } else {
                    value = select2[args[0]].apply(select2, args.slice(1));
                }
                if (value !== undefined) {return false;}
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container) {
            return data ? data.text : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please enter " + n + " less character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: function (markup) {
            var replace_map = {
                '\\': '&#92;',
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
                "/": '&#47;'
            };

            return String(markup).replace(/[&<>"'/\\]/g, function (match) {
                    return replace_map[match[0]];
            });
        },
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; }
    };

}(jQuery));
} );

timely.define('scripts/add_new_event',
	[
		"jquery_timely",
		'domReady',
		'ai1ec_config',
		'scripts/add_new_event/event_location/gmaps_helper',
		'scripts/add_new_event/event_location/input_coordinates_event_handlers',
		'scripts/add_new_event/event_location/input_coordinates_utility_functions',
		'scripts/add_new_event/event_date_time/date_time_event_handlers',
		'scripts/add_new_event/event_cost_helper',
		'external_libs/jquery.calendrical_timespan',
		'external_libs/jquery.inputdate',
		'external_libs/jquery.tools',
		'external_libs/ai1ec_datepicker',
		'external_libs/bootstrap/transition',
		'external_libs/bootstrap/collapse',
		'external_libs/bootstrap/modal',
		'external_libs/bootstrap/alert',
		'external_libs/bootstrap/tab',
		'external_libs/select2'
	],
	function (
		$,
		domReady,
		ai1ec_config,
		gmaps_helper,
		input_coordinates_event_handlers,
		input_utility_functions,
		date_time_event_handlers,
		event_cost,
		calendrical_functions
	) {
	 // jshint ;_;


	var init_date_time = function() {

		var now = new Date( ai1ec_config.now * 1000 );

		/**
		* Timespan plugin setup
		*/
		// Initialize timespan plugin on our date/time inputs.
		var data = {
			allday           : '#ai1ec_all_day_event',
			start_date_input : '#ai1ec_start-date-input',
			start_time_input : '#ai1ec_start-time-input',
			start_time       : '#ai1ec_start-time',
			end_date_input   : '#ai1ec_end-date-input',
			end_time_input   : '#ai1ec_end-time-input',
			end_time         : '#ai1ec_end-time',
			date_format      : ai1ec_config.date_format,
			month_names      : ai1ec_config.month_names,
			day_names        : ai1ec_config.day_names,
			week_start_day   : ai1ec_config.week_start_day,
			twentyfour_hour  : ai1ec_config.twentyfour_hour,
			now              : now
		};

		$.timespan( data );
		// Retrieve the dates saved in the hidden field
		var exdate  = $( "#ai1ec_exdate" ).val();

		// This variable holds the dates that must be selected in the datepicker.
		var dp_date = null;
		var _clear_dp = false;
		var _day;
		if( exdate.length >= 8 ) {
			dp_date = [];
			var _span_html = [];
			$.each( exdate.split( ',' ), function( i, v ) {
				var _date = v.slice( 0, 8 );
				var _year = _date.substr( 0, 4 );
				var _month = _date.substr( 4, 2 );
				_day = _date.substr( 6, 2 );

				_month = _month.charAt(0) === '0' ? ( '0' + ( parseInt( _month.charAt( 1 ), 10 ) - 1 ) ) : ( parseInt( _month, 10 ) - 1 );

				dp_date.push( new Date( _year, _month, _day ) );
				_span_html.push(
					calendrical_functions.formatDate(
						new Date( _year, _month, _day ),
						ai1ec_config.date_format,
						true
					)
				);
			});
			$( '#ai1ec_exclude-dates-input' )
				.text(  _span_html.join( ', ' ) );
		} else {
			// Set as default date shown today
			dp_date = new Date( ai1ec_config.now * 1000 );
			_clear_dp = true;
			$( '#ai1ec_exclude-dates-input' )
				.text(  $( '#ai1ec_exclude-dates-input' ).data( 'placeholder' ) );
		}

		$( '#widgetCalendar' ).DatePicker({
			flat: true,
			calendars: 3,
			mode: 'multiple',
			starts: ai1ec_config.week_start_day,
			date: dp_date,
			onChange: function( formated ) {
				formated = formated.toString();
				if( formated.length >= 8 ) {
					// save the date in your hidden field
					var exdate = '';
					var formatted_date = [];
					$.each( formated.split( ',' ), function( i, v ) {
						formatted_date.push( calendrical_functions.formatDate( new Date( v ), ai1ec_config.date_format ) );
						exdate += v.replace( /-/g, '' ) + 'T000000Z,';
					});
					$( '#ai1ec_exclude-dates-input' ).text( formatted_date.join( ', ' ) );
					exdate = exdate.slice( 0, exdate.length - 1 );
					$( "#ai1ec_exdate" ).val( exdate );
				} else {
					$( "#ai1ec_exdate" ).val( '' );
					$( '#ai1ec_exclude-dates-input' ).text( $( '#ai1ec_exclude-dates-input' ).data( 'placeholder' ) );
				}
			},
			prev: '«',
			next: '»',
			// Ignore clicking on month name.
			month_link_inactive: true,
			locale: {
				daysMin: ai1ec_config.day_names.split( ',' ),
				months: ai1ec_config.month_names.split( ',' )
			}
		});
		if( _clear_dp ) {
			$( '#widgetCalendar' ).DatePickerClear();
		}
		// Hide datepicker if clicked outside.
		$( document )
			.on( 'mousedown.exclude', function( e ) {
				var $container = $( '#widgetCalendar' ),
					$link = $( '#ai1ec_exclude-dates-input' );

				if ( ! $container.is( e.target )
					&& ! $link.is( e.target )
					&& 0 === $container.has( e.target ).length ) {
					$( '#widgetCalendar' ).hide();
				}
			});
	};

	/**
	 * Add a hook into Bootstrap collapse for panels for proper overflow
	 * behaviour when open.
	 */
	var init_collapsibles = function() {
		$( '.ai1ec-panel-collapse' ).on( 'hide', function() {
			$( this ).parent().removeClass( 'ai1ec-overflow-visible' );
		} );
		$( '.ai1ec-panel-collapse' ).on( 'shown', function() {
			var $el = $( this );
			window.setTimeout(
				function() { $el.parent().addClass( 'ai1ec-overflow-visible' ); },
				350
			);
		} );
	};

	/**
	 * Perform all initialization functions required on the page.
	 */
	var init = function() {
		init_date_time();

		// We load gMaps here so that we can start acting on the DOM as soon as possibe.
		// All initialization is done in the callback.
		timely.require( ['libs/gmaps' ], function( gMapsLoader ) {
			gMapsLoader( gmaps_helper.init_gmaps );
		} );
	};

	/**
	 * Present user with error notice and prevent form submission
	 */
	var prevent_form_submission = function( submit_event, notices ) {
		var info_text = null;
		if ( '[object Array]' === Object.prototype.toString.call( notices ) ) {
			info_text = notices.join( '<br>' );
		} else {
			info_text = notices;
		}
		$( '#ai1ec_event_inline_alert' ).html( info_text );
		$( '#ai1ec_event_inline_alert' ).removeClass( 'ai1ec-hidden' );
		submit_event.preventDefault();
		// Just in case, hide the ajax spinner and remove the disabled status
		$( '#publish, #ai1ec_bottom_publish' ).removeClass(
			'button-primary-disabled'
		);
		$( '#publish, #ai1ec_bottom_publish' ).removeClass(
			'disabled'
		);
		$( '#publish, #ai1ec_bottom_publish' ).siblings(
			'#ajax-loading, .spinner'
		).css( 'visibility', 'hidden' );
	};

	/**
	 * Validate the form when clicking Publish/Update.
	 *
	 * @param  object e jQuery event object
	 */
	var validate_form = function( e ) {
		// Validate geolocation coordinates.
		if ( input_utility_functions.ai1ec_check_lat_long_fields_filled_when_publishing_event( e ) === true ) {
			// Convert commas to dots
			input_utility_functions.ai1ec_convert_commas_to_dots_for_coordinates();
			// Check that fields are ok and there are no errors
			input_utility_functions.ai1ec_check_lat_long_ok_for_search( e );
		}

		// Validate URL fields.
		var show_warning = false;
		var warnings     = [];
		$( '#ai1ec_ticket_url, #ai1ec_contact_url' ).each( function () {
			var url = this.value;
			$( this ).removeClass( 'ai1ec-input-warn' );
			$( this ).closest( '.ai1ec-panel-collapse' ).parent()
				.find( '.ai1ec-panel-heading .ai1ec-fa-warning' )
				.addClass( 'ai1ec-hidden' ).parent()
				.css( 'color', '' );
			if ( '' !== url ) {
				var urlPattern = /(http|https):\/\//;
				if ( ! urlPattern.test( url ) ) {
					$( this ).closest( '.ai1ec-panel-collapse' ).parent()
						.find( '.ai1ec-panel-heading .ai1ec-fa-warning' )
						.removeClass( 'ai1ec-hidden' ).parent()
						.css( 'color', 'rgb(255, 79, 79)' );
					if ( ! show_warning ) {
						$( this ).closest( '.ai1ec-panel-collapse' )
							.collapse( 'show' );
					}
					show_warning = true;
					var text = $( this ).attr( 'id' ) + '_not_valid';
					warnings.push( ai1ec_config[text] );
					$( this ).addClass( 'ai1ec-input-warn' );
				}
			}
		} );
		if ( show_warning ) {
			warnings.push( ai1ec_config.general_url_not_valid );
			prevent_form_submission( e, warnings );
		}
	};

	/**
	 * Attach event handlers to add/edit event page.
	 */
	var attach_event_handlers = function() {
		// Toggle the visibility of Google map on checkbox click.
		$( '#ai1ec_google_map' ).click( input_coordinates_event_handlers.toggle_visibility_of_google_map_on_click );
		// Hide / Show the coordinates table when clicking the checkbox.
		$( '#ai1ec_input_coordinates' ).change( input_coordinates_event_handlers.toggle_visibility_of_coordinate_fields_on_click );
		// Validate fields when clicking Publish.
		$( '#post' ).submit( validate_form );
		// On blur, update the map if both coordinates are set.
		$( 'input.coordinates' ).blur( input_coordinates_event_handlers.update_map_from_coordinates_on_blur );

		// If the extra publish button is present, handle its click.
		$( '#ai1ec_bottom_publish' ).on( 'click', date_time_event_handlers.trigger_publish );

		// Recurrence modal event handlers.
		$( document )
			// Show different fields for the "ends" clause in the repeat modal.
			.on( 'change', '#ai1ec_end', date_time_event_handlers.show_end_fields )
			// Handle click on the Apply button of the repeat modal.
			.on( 'click', '#ai1ec_repeat_apply', date_time_event_handlers.handle_click_on_apply_button )
			// Handle click on the cancel button of the repeat modal.
			.on( 'click', '#ai1ec_repeat_cancel', date_time_event_handlers.handle_click_on_cancel_modal )
			// Handle click on monthly repeat radios.
			.on( 'click', '#ai1ec_monthly_type_bymonthday, #ai1ec_monthly_type_byday', date_time_event_handlers.handle_checkbox_monthly_tab_modal )
			// Handle weekday/day/month toggle buttons.
			.on( 'click', '.ai1ec-btn-group-grid a', date_time_event_handlers.handle_click_on_toggle_buttons );
		$( '#ai1ec_repeat_box' ).on( 'hidden.bs.modal', date_time_event_handlers.handle_modal_hide );
		// Attach pseudo handler function. These functions are kind of wrappers
		// around other functions, and may need refactoring someday.
		date_time_event_handlers.execute_pseudo_handlers();

		// Initialize showing/hiding of the exclude dates widget.
		$( '#widgetField > a' ).on( 'click', date_time_event_handlers.handle_animation_of_calendar_widget );

		// Free checkbox.
		$( '#ai1ec_is_free' ).on( 'change', event_cost.handle_change_is_free );

		// Banner image.
		$( document ).on( 'click', '.ai1ec-set-banner-image', set_banner_image );
		$( document ).on( 'click', '.ai1ec-remove-banner', remove_banner_image );
	};

	/**
	 * Hijack the Featured Image dialog to adapt it for Banner Image.
	 */
	var set_banner_image = function() {
		var fi = {};
		fi._frame = wp.media({
			state: 'featured-image',
			states: [
				new wp.media.controller.FeaturedImage(),
				new wp.media.controller.EditImage()
			]
		});
		fi._frame.open();
		$( '.media-frame:last ').addClass( 'ai1ec-banner-image-frame' );
		$( '.media-frame-title:last h1' ).text(
			$( '.ai1ec-set-banner-block .ai1ec-set-banner-image' ).text()
		);
		$( '.media-frame-toolbar:last' ).append(
			$( '.ai1ec-media-toolbar' )
				.clone()
				.removeClass( 'ai1ec-media-toolbar ai1ec-hidden' )
		);
		$( '.ai1ec-save-banner-image' ).off().on( 'click', function() {
			var
				src = $( '.attachments:visible li.selected img' ).attr( 'src' ),
				url = $( '.attachment-details:visible input[type=text]' ).val();

			if ( src && url ) {
				$( '#ai1ec_event_banner .inside' )
					.find( '.ai1ec-banner-image-block' )
						.removeClass( 'ai1ec-hidden' )
							.find( 'img' )
								.attr( 'src', src )
								.end()
							.find( 'input' )
								.val( url )
								.end()
							.end()
					.find( '.ai1ec-set-banner-block' )
						.addClass( 'ai1ec-hidden' )
						.end()
					.find( '.ai1ec-remove-banner-block' )
						.removeClass( 'ai1ec-hidden' );
			}
			fi._frame.close();
			return false;
		} );
		return false;
	}

	/**
	 * Remove banner image.
	 */
	var remove_banner_image = function() {
		$( '#ai1ec_event_banner .inside' )
			.find( '.ai1ec-remove-banner-block' )
				.addClass( 'ai1ec-hidden' )
				.end()
			.find( '.ai1ec-banner-image-block' )
				.addClass( 'ai1ec-hidden' )
				.find( 'input' )
					.val( '' )
					.end()
				.find( 'img' )
					.attr( 'src' ,'' )
					.end()
				.end()
			.find( '.ai1ec-set-banner-block' )
				.removeClass( 'ai1ec-hidden' )

		return false;
	}

	/**
	 * Place Event Details meta box below title, rather than below description.
	 */
	var reposition_meta_box = function() {
		$( '#ai1ec_event' )
			.insertAfter( '#ai1ec_event_inline_alert' );
		$( '#post' ).addClass( 'ai1ec-visible' );
	};
	/**
	 * Initialize Select2 for timezones.
	 */
	var init_timezones_select = function() {
		$('#timezone-select').select2();
	};

	var start = function() {
		// Initialize the page. We do this before domReady so we start loading other
		// dependencies as soon as possible.
		init();
		domReady( function() {
			init_collapsibles();
			// Reposition event details meta box.
			reposition_meta_box();
			// Attach the event handlers.
			attach_event_handlers();
			// Initialize Select2 for timezones.
			init_timezones_select();
		} );
	};

	return {
		start: start
	};
} );

timely.require(
	[ "scripts/add_new_event" ],
	function( page ) {
		 // jshint ;_;
		page.start();
	}
);

timely.define("pages/add_new_event", function(){});

/**
 * This module handles the print button behaviour.
 */
define(
	[
		"jquery_timely"
	],
	function( $ ) {
	"use strict"; // jshint ;_;

	/**
	 * Handle clicks on the print button.
	 *
	 * @param {object} e jQuery Event object
	 */
	var handle_click_on_print_button = function( e ) {
		e.preventDefault();
		// get the calendar html
		var $body = $( 'body' )
		  , $html = $( 'html' )
		  , view = $( this ).closest( '.ai1ec-calendar' ).html()
		  , body = $body.html();
		// Remove all scripts tag otherwise they are reapplied when the
		// html is used.
		body = body.replace( /<script.*?>([\s\S]*?)<\/script>/gmi, '' );
		// Empty the page
		$body.empty();
		// Add the namespace to the body
		$body.addClass( 'timely' );
		// add the print class to the document
		$html.addClass( 'ai1ec-print' );
		// Attacch our calendar
		$body.html( view );
		// Disable clicking on title
		$( 'span' ).click( function() {
			return false;
		} );
		$( '.ai1ec-agenda-view a' ).each( function() {
			$( this ).data( 'href', $( this ).attr( 'href' ) );
			$( this ).attr( 'href', '#' );
		});
		// Open the print screen
		window.print();
		$( '.ai1ec-agenda-view a' ).each( function() {
			$( this ).attr( 'href', $( this ).data( 'href' ) );
			$( this ).data( 'href', '' );
		});
		// remove classes we added
		$body.removeClass( 'timely' );
		$html.removeClass( 'ai1ec-print' );
		// Attach back the body
		$body.html( body );
	};

	return {
		handle_click_on_print_button     : handle_click_on_print_button
	};
} );

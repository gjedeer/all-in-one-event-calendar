<?php

/**
 * Event internal structure representation. Plain value object.
 *
 * @author       Time.ly Network, Inc.
 * @since        2.0
 * @instantiator new
 * @package      Ai1EC
 * @subpackage   Ai1EC.Model
 */
class Ai1ec_Event_Entity extends Ai1ec_Base {

	/**
	 * Get list of object properties.
	 *
	 * Special value `registry` ({@see Ai1ec_Registry_Object}) is excluded.
	 *
	 * @return array List of accessible properties.
	 *
	 * @staticvar array $known List of properties.
	 */
	public function list_properties() {
		static $known = null;
		if ( null === $known ) {
			$known = array();
			foreach ( $this as $name => $value ) {
				$name = substr( $name, 1 );
				if ( 'registry' === $name ) {
					continue;
				}
				$known[] = $name;
			}
		}
		return $known;
	}

	/**
	 * Change stored property.
	 *
	 * @param string $name  Name of property to change.
	 * @param mixed  $value Arbitrary value to use.
	 *
	 * @return Ai1ec_Event_Entity Instance of self for chaining.
	 *
	 * @staticvar array $time_fields Map of fields holding a value of
	 *                               {@see Ai1ec_Date_Time}, which
	 *                               require modification instead of
	 *                               replacement.
	 */
	public function set( $name, $value ) {
		static $time_fields = array(
			'start' => true,
			'end'   => true,
		);
		if ( 'registry' === $name ) {
			return $this; // short-circuit: protection mean.
		}
		$field = '_' . $name;
		if ( isset( $time_fields[$name] ) ) {
			if ( $value instanceof Ai1ec_Date_Time ) {
				$this->{$field} = $value;
			} else {
				$this->{$field}->set_time( $value );
			}
		} else {
			$this->{$field} = $value;
		}
		return $this;
	}

	/**
	 * Get a value of some property.
	 *
	 * @param string $name    Name of property to get.
	 * @param mixed  $default Value to return if property is not defined.
	 *
	 * @return mixed Found value or $default.
	 */
	public function get( $name, $default = null ) {
		if ( ! isset( $this->{ '_' . $name } ) ) {
			return $default;
		}
		return $this->{ '_' . $name };
	}

	/**
	 * Initialize values to some sane defaults.
	 *
	 * @param Ai1ec_Registry_Object $registry Injected registry.
	 *
	 * @return void
	 */
	public function __construct( Ai1ec_Registry_Object $registry ) {
		parent::__construct( $registry );
		$this->_start = $this->_registry->get( 'date.time' );
		$this->_end   = $this->_registry->get( 'date.time', '+1 hour' );
	}

	/**
	 * @var object Instance of WP_Post object.
	 */
	private $_post;

	/**
	 * @var int Post ID.
	 */
	private $_post_id;

	/**
	 * @var int|null Uniquely identifies the recurrence instance of this event
	 *               object. Value may be null.
	 */
	private $_instance_id;

	/**
	 * @var Ai1ec_Date_Time Start date-time specifier
	 */
	private $_start;

	/**
	 * @var Ai1ec_Date_Time End date-time specifier
	 */
	private $_end;

	/**
	 * @var bool Whether this copy of the event was broken up for rendering and
	 *           the start time is not its "real" start time.
	 */
	private $_start_truncated;

	/**
	 * @var bool Whether this copy of the event was broken up for rendering and
	 *           the end time is not its "real" end time.
	 */
	private $_end_truncated;

	/**
	 * @var int If event is all-day long
	 */
	private $_allday;

	/**
	 * @var int If event has no duration
	 */
	private $_instant_event;

	/**
	 * ==========================
	 * = Recurrence information =
	 * ==========================
	 */

	/**
	 * @var string Recurrence rules
	 */
	private $_recurrence_rules;

	/**
	 * @var string Exception rules
	 */
	private $_exception_rules;

	/**
	 * @var string Recurrence dates
	 */
	private $_recurrence_dates;

	/**
	 * @var string Exception dates
	 */
	private $_exception_dates;

	/**
	 * @var string Venue name - free text
	 */
	private $_venue;

	/**
	 * @var string Country name - free text
	 */
	private $_country;

	/**
	 * @var string Address information - free text
	 */
	private $_address;

	/**
	 * @var string City name - free text
	 */
	private $_city;

	/**
	 * @var string Province free text definition
	 */
	private $_province;

	/**
	 * @var int Postal code
	 */
	private $_postal_code;

	/**
	 * @var int Set to true to display map
	 */
	private $_show_map;

	/**
	 * @var int Set to true to show coordinates in description
	 */
	private $_show_coordinates;

	/**
	 * @var float GEO information - longitude
	 */
	private $_longitude;

	/**
	 * @var float GEO information - latitude
	 */
	private $_latitude;

	/**
	 * @var string Event contact information - contact person
	 */
	private $_contact_name;

	/**
	 * @var string Event contact information - phone number
	 */
	private $_contact_phone;

	/**
	 * @var string Event contact information - e-mail address
	 */
	private $_contact_email;

	/**
	 * @var string Event contact information - external URL.
	 */
	private $_contact_url;

	/**
	 * @var string Defines event cost.
	 */
	private $_cost;

	/**
	 * @var bool Indicates, whereas event is free.
	 */
	private $_is_free;

	/**
	 * @var string Link to buy tickets
	 */
	private $_ticket_url;

	// ====================================
	// = iCalendar feed (.ics) properties =
	// ====================================

	/**
	 * @var string URI of source ICAL feed.
	 */
	private $_ical_feed_url;

	/**
	 * @var string|null URI of source ICAL entity.
	 */
	private $_ical_source_url;

	/**
	 * @var string Organiser details
	 */
	private $_ical_organizer;

	/**
	 * @var string Contact details
	 */
	private $_ical_contact;

	/**
	 * @var string|int UID of ICAL feed
	 */
	private $_ical_uid;

	// ===============================
	// = taxonomy-related properties =
	// ===============================

	/**
	 * @var string Associated event tag names (*not* IDs), joined by commas.
	 */
	private $_tags;

	/**
	 * @var string Associated event category IDs, joined by commas.
	 */
	private $_categories;

	/**
	 * @var string Associated event feed object
	 */
	private $_feed;

	// ================================
	// = Facebook-specific properties =
	// ================================

	/**
	 * @var bigint Facebook event ID
	 */
	private $_facebook_eid;

	/**
	 * @var bigint Related Facebook user
	 */
	private $_facebook_user;

	/**
	 * @var char Facebook status
	 */
	private $_facebook_status;


}
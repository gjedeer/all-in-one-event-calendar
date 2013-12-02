<?php

/**
 * Abstract class to accelerate settings page snippets development.
 *
 * @author     Time.ly Network, Inc.
 * @since      2.0
 * @package    Ai1EC
 * @subpackage Ai1EC.Html
 */
abstract class Ai1ec_Html_Element_Settings
    implements Ai1ec_Html_Element_Interface {

	/**
	 * @var Ai1ec_System Instance of system object.
	 */
	protected $_sys  = NULL;

	/**
	 * @var Ai1ec_Html_Helper Instance of HTML helper.
	 */
	protected $_html = NULL;

	/**
	 * Constructor accepts system as injectable and requests HTML helper.
	 *
	 * @param Ai1ec_Registry_Object $system Injected system argument.
	 *
	 * @return void Constructor does not return.
	 */
	public function __construct( Ai1ec_Registry_Object $system ) {
		$this->_sys  = $system;
		$this->_html = $this->_sys->get( 'html.helper' );
	}

	/**
	 * Set value within current object scope
	 *
	 * Value name is formed as {$attribute} with underscore ('_') prefixed.
	 *
	 * @param string $attribute Name of attribute to set.
	 * @param mixed  $value     Value to set for attribute.
	 *
	 * @return Ai1ec_Html_Element_Settings Instance of self.
	 */
	public function set( $attribute, $value ) {
		$this->{'_' . $attribute} = $value;
		return $this;
	}

	/**
	 * Override to include any initialization logics.
	 *
	 * @return void Method output is ignored.
	 */
	protected function _initialize() {
	}

	/**
	 * Generate settings output line.
	 *
	 * @param string $output Generated output to finalize.
	 *
	 * @return string Finalized HTML snippet.
	 */
	public function render( $output ) {
		return '<div class="clearfix">' . $output . '</div>';
	}

}
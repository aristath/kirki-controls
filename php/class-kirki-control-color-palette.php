<?php
/**
 * Customizer Control: color-palette.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       2.2.6
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adds a color-palette control.
 * This is essentially a radio control, styled as a palette.
 */
class Kirki_Control_Color_Palette extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-color-palette';

	/**
	 * Returns an array of extra field dependencies for Kirki controls.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @return array
	 */
	protected function kirki_script_dependencies() {
		return array( 'jquery-ui-button' );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @access public
	 */
	public function to_json() {

		parent::to_json();

		// If no palette has been defined, use Material Design Palette.
		if ( ! isset( $this->json['choices']['colors'] ) || empty( $this->json['choices']['colors'] ) ) {
			$this->json['choices']['colors'] = Kirki_Helper::get_material_design_colors( 'primary' );
		}
		if ( ! isset( $this->json['choices']['size'] ) || empty( $this->json['choices']['size'] ) ) {
			$this->json['choices']['size'] = 20;
		}
	}
}

<?php
/**
 * Customizer Control: kirki-fontawesome.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       1.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Select control.
 */
class Kirki_Control_FontAwesome extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-fontawesome';

	/**
	 * Returns an array of extra field dependencies for Kirki controls.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @return array
	 */
	protected function kirki_script_dependencies() {
		return array( 'select2' );
	}

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_style( 'kirki-fontawesome-font-css', kirki_controls()->get_url( 'vendor/fontawesome/font-awesome.css' ), null );
		wp_enqueue_script( 'select2', kirki_controls()->get_url( 'vendor/select2/js/select2.full.js' ), array( 'jquery' ), '4.0.3', true );
		wp_enqueue_style( 'select2', kirki_controls()->get_url( 'vendor/select2/css/select2.css' ), array(), '4.0.3' );
		parent::enqueue();

		ob_start();
		$json_path = wp_normalize_path( KIRKI_CONTROLS_PATH . '/vendor/fontawesome/fontawesome.json' );
		include( $json_path );
		$font_awesome_json = ob_get_clean();
		wp_localize_script( 'kirki-fontawesome', 'fontAwesomeJSON', $font_awesome_json );
	}
}

<?php
/**
 * Customizer Control: dimension
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A text control with validation for CSS units.
 */
class Kirki_Control_Dimension extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-dimension';

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_script( 'kirki-dynamic-control', Kirki_Controls_Bootstrap::get_url( 'assets/js/dynamic-control.js' ), array( 'jquery', 'customize-base' ), false, true );
		wp_enqueue_script( 'kirki-dimension', Kirki_Controls_Bootstrap::get_url( 'assets/js/dimension.js' ), array( 'jquery', 'customize-base', 'kirki-dynamic-control' ), false, true );
		wp_enqueue_style( 'kirki-styles', Kirki_Controls_Bootstrap::get_url( 'assets/styles.css' ), null );
	}
}

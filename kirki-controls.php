<?php
/**
 * The main kirki controls file.
 * This takes care of bootstrapping and any additional functions.
 *
 * @package     Kirki
 * @category    Controls
 * @author      Aristeides Stathopoulos
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       3.0.10
 */

// Include the bootstrapping class.
include_once dirname( __FILE__ ) . '/php/class-kirki-controls-bootstrap.php';

// Define KIRKI_CONTROLS_PATH.
if ( ! defined( 'KIRKI_CONTROLS_PATH' ) ) {
	define( 'KIRKI_CONTROLS_PATH', dirname( __FILE__ ) );
}

if ( ! function_exists( 'kirki_controls' ) ) {
	/**
	 * Returns an instance of the Kirki_Controls_Bootstrap object.
	 *
	 * @since 3.0.10
	 */
	function kirki_controls() {
		return Kirki_Controls_Bootstrap::get_instance();
	}
}
kirki_controls();

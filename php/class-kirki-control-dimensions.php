<?php
/**
 * Customizer Control: dimensions.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       2.1
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dimensions control.
 * multiple fields with CSS units validation.
 */
class Kirki_Control_Dimensions extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-dimensions';

	/**
	 * Returns an array of translation strings.
	 *
	 * @access protected
	 * @since 3.0.0
	 * @return array
	 */
	protected function l10n() {
		return array(
			'left-top'              => esc_attr__( 'Left Top', 'kirki' ),
			'left-center'           => esc_attr__( 'Left Center', 'kirki' ),
			'left-bottom'           => esc_attr__( 'Left Bottom', 'kirki' ),
			'right-top'             => esc_attr__( 'Right Top', 'kirki' ),
			'right-center'          => esc_attr__( 'Right Center', 'kirki' ),
			'right-bottom'          => esc_attr__( 'Right Bottom', 'kirki' ),
			'center-top'            => esc_attr__( 'Center Top', 'kirki' ),
			'center-center'         => esc_attr__( 'Center Center', 'kirki' ),
			'center-bottom'         => esc_attr__( 'Center Bottom', 'kirki' ),
			'font-size'             => esc_attr__( 'Font Size', 'kirki' ),
			'font-weight'           => esc_attr__( 'Font Weight', 'kirki' ),
			'line-height'           => esc_attr__( 'Line Height', 'kirki' ),
			'font-style'            => esc_attr__( 'Font Style', 'kirki' ),
			'letter-spacing'        => esc_attr__( 'Letter Spacing', 'kirki' ),
			'word-spacing'          => esc_attr__( 'Word Spacing', 'kirki' ),
			'top'                   => esc_attr__( 'Top', 'kirki' ),
			'bottom'                => esc_attr__( 'Bottom', 'kirki' ),
			'left'                  => esc_attr__( 'Left', 'kirki' ),
			'right'                 => esc_attr__( 'Right', 'kirki' ),
			'center'                => esc_attr__( 'Center', 'kirki' ),
			'size'                  => esc_attr__( 'Size', 'kirki' ),
			'height'                => esc_attr__( 'Height', 'kirki' ),
			'spacing'               => esc_attr__( 'Spacing', 'kirki' ),
			'width'                 => esc_attr__( 'Width', 'kirki' ),
			'height'                => esc_attr__( 'Height', 'kirki' ),
			'invalid-value'         => esc_attr__( 'Invalid Value', 'kirki' ),
		);
	}
}

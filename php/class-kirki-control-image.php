<?php
/**
 * Customizer Control: image.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       3.0.0
 */

/**
 * Adds the image control.
 */
class Kirki_Control_Image extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-image';

	/**
	 * Returns an array of translation strings.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @return array
	 */
	protected function l10n() {
		return array(
			'noFileSelected' => esc_attr__( 'No File Selected', 'kirki' ),
			'remove'         => esc_attr__( 'Remove', 'kirki' ),
			'selectFile'     => esc_attr__( 'Select File', 'kirki' ),
			'defaultImage'   => esc_attr__( 'Default', 'kirki' ),
		);
	}
}

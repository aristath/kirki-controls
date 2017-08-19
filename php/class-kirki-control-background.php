<?php
/**
 * Customizer Control: background.
 *
 * Creates a new custom control.
 * Custom controls contains all background-related options.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       1.0
 */

/**
 * Adds multiple input fiels that combined make up the background control.
 */
class Kirki_Control_Background extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-background';

	/**
	 * Returns an array of extra field dependencies for Kirki controls.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @return array
	 */
	protected function kirki_script_dependencies() {
		return array( 'wp-color-picker-alpha' );
	}

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_style( 'wp-color-picker-alpha' );
		wp_enqueue_script( 'wp-color-picker-alpha', kirki_controls()->get_url( 'vendor/wp-color-picker-alpha/wp-color-picker-alpha.js' ), array( 'wp-color-picker' ), '1.2', true );
		wp_enqueue_style( 'wp-color-picker' );

		parent::enqueue();
	}

	/**
	 * Returns an array of translation strings.
	 *
	 * @access protected
	 * @since 3.0.0
	 * @return array
	 */
	protected function l10n() {
		return array(
			'backgroundColor'    => esc_attr__( 'Background Color', 'kirki' ),
			'backgroundImage'    => esc_attr__( 'Background Image', 'kirki' ),
			'noFileSelected'     => esc_attr__( 'No File Selected', 'kirki' ),
			'remove'             => esc_attr__( 'Remove', 'kirki' ),
			'selectFile'         => esc_attr__( 'Select File', 'kirki' ),
			'backgroundRepeat'   => esc_attr__( 'Background Repeat', 'kirki' ),
			'noRepeat'           => esc_attr__( 'No Repeat', 'kirki' ),
			'repeatAll'          => esc_attr__( 'Repeat All', 'kirki' ),
			'repeatX'            => esc_attr__( 'Repeat Horizontally', 'kirki' ),
			'repeatX'            => esc_attr__( 'Repeat Vertically', 'kirki' ),
			'backgroundPosition' => esc_attr__( 'Background Position', 'kirki' ),
			'leftTop'            => esc_attr__( 'Left Top', 'kirki' ),
			'leftCenter'         => esc_attr__( 'Left Center', 'kirki' ),
			'leftBottom'         => esc_attr__( 'Left Bottom', 'kirki' ),
			'rightTop'           => esc_attr__( 'Right Top', 'kirki' ),
			'rightCenter'        => esc_attr__( 'Right Center', 'kirki' ),
			'rightBottom'        => esc_attr__( 'Right Bottom', 'kirki' ),
			'centerTop'          => esc_attr__( 'Center Top', 'kirki' ),
			'centerCenter'       => esc_attr__( 'Center Center', 'kirki' ),
			'centerBottom'       => esc_attr__( 'Center Bottom', 'kirki' ),
			'backgroundSize'     => esc_attr__( 'BackgroundSize', 'kirki' ),
			'cover'              => esc_attr__( 'Cover', 'kirki' ),
			'contain'            => esc_attr__( 'Contain', 'kirki' ),
			'auto'               => esc_attr__( 'Auto', 'kirki' ),
			'backgroundAttach'   => esc_attr__( 'Background Attach', 'kirki' ),
			'scroll'             => esc_attr__( 'Scroll', 'kirki' ),
			'fixed'              => esc_attr__( 'Fixed', 'kirki' ),
		);
	}
}

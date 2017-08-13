<?php
/**
 * Customizer Control: dashicons.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       2.2.4
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dashicons control (modified radio).
 */
class Kirki_Control_Dashicons extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-dashicons';

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @access public
	 */
	public function to_json() {
		parent::to_json();
		$this->json['icons'] = Kirki_Helper::get_dashicons();
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
			'admin-menu'     => esc_attr__( 'Admin Menu', 'kirki' ),
			'welcome-screen' => esc_attr__( 'Welcome Screen', 'kirki' ),
			'post-formats'   => esc_attr__( 'Post Formats', 'kirki' ),
			'media'          => esc_attr__( 'Media', 'kirki' ),
			'image-editing'  => esc_attr__( 'Image Editing', 'kirki' ),
			'tinymce'        => esc_attr__( 'TinyMCE', 'kirki' ),
			'posts'          => esc_attr__( 'Posts', 'kirki' ),
			'sorting'        => esc_attr__( 'Sorting', 'kirki' ),
			'social'         => esc_attr__( 'Social', 'kirki' ),
			'wordpress_org'  => esc_attr__( 'WordPress', 'kirki' ),
			'products'       => esc_attr__( 'Products', 'kirki' ),
			'taxonomies'     => esc_attr__( 'Taxonomies', 'kirki' ),
			'widgets'        => esc_attr__( 'Widgets', 'kirki' ),
			'notifications'  => esc_attr__( 'Notifications', 'kirki' ),
			'misc'           => esc_attr__( 'Miscelaneous', 'kirki' ),
		);
	}
}

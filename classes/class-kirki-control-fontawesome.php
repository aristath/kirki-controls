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
		return array( 'kirki-fontawesome-font-css', 'select2' );
	}

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_style( 'kirki-fontawesome-font-css', Kirki_Controls_Bootstrap::get_url( 'controls/assets/vendor/fontawesome/font-awesome.css' ), null );
		wp_enqueue_script( 'select2', Kirki_Controls_Bootstrap::get_url( 'controls/assets/vendor/select2/js/select2.full.js' ), array( 'jquery' ), '4.0.3', true );
		wp_enqueue_style( 'select2', Kirki_Controls_Bootstrap::get_url( 'controls/assets/vendor/select2/css/select2.css' ), array(), '4.0.3' );
		parent::enqueue();

		ob_start();
		$json_path = wp_normalize_path( Kirki::$path . '/controls/assets/vendor/fontawesome/fontawesome.json' );
		include( $json_path );
		$font_awesome_json = ob_get_clean();
		wp_localize_script( 'kirki-fontawesome', 'fontAwesomeJSON', $font_awesome_json );
	}

	/**
	 * An Underscore (JS) template for this control's content (but not its container).
	 *
	 * Class variables for this control class are available in the `data` JS object;
	 * export custom variables by overriding {@see WP_Customize_Control::to_json()}.
	 *
	 * @see WP_Customize_Control::print_template()
	 *
	 * @access protected
	 */
	protected function content_template() {
		?>
		<label>
			<# if ( data.label ) { #><span class="customize-control-title">{{ data.label }}</span><# } #>
			<# if ( data.description ) { #><span class="description customize-control-description">{{{ data.description }}}</span><# } #>
			<select {{{ data.inputAttrs }}} {{{ data.link }}}></select>
		</label>
		<?php
	}
}

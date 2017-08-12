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
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_script( 'kirki-dynamic-control', trailingslashit( Kirki::$url ) . 'controls/assets/js/dynamic-control.js', array( 'jquery', 'customize-base' ), false, true );
		wp_enqueue_script( 'kirki-fontawesome', trailingslashit( Kirki::$url ) . 'controls/assets/js/fontawesome.js', array( 'jquery', 'customize-base', 'kirki-dynamic-control', 'select2', 'jquery-ui-sortable' ), false, true );
		wp_enqueue_style( 'kirki-fontawesome-font-css', trailingslashit( Kirki::$url ) . 'controls/assets/vendor/fontawesome/font-awesome.css', null );
		wp_enqueue_script( 'select2', trailingslashit( Kirki::$url ) . 'controls/assets/vendor/select2/js/select2.full.js', array( 'jquery' ), '4.0.3', true );
		wp_enqueue_style( 'select2', trailingslashit( Kirki::$url ) . 'controls/assets/vendor/select2/css/select2.css', array(), '4.0.3' );
		wp_enqueue_style( 'kirki-styles', trailingslashit( Kirki::$url ) . 'controls/assets/styles.css', null );
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

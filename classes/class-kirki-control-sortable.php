<?php
/**
 * Customizer Control: sortable.
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
 * Sortable control (uses checkboxes).
 */
class Kirki_Control_Sortable extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-sortable';

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_script( 'kirki-sortable', trailingslashit( Kirki::$url ) . 'controls/assets/js/sortable.js', array( 'jquery', 'customize-base', 'jquery-ui-core', 'jquery-ui-sortable' ), false, true );
		wp_enqueue_style( 'kirki-styles', trailingslashit( Kirki::$url ) . 'controls/assets/styles.css', null );
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
		<label class='kirki-sortable'>
			<span class="customize-control-title">
				{{{ data.label }}}
			</span>
			<# if ( data.description ) { #>
				<span class="description customize-control-description">{{{ data.description }}}</span>
			<# } #>

			<ul class="sortable">
				<# _.each( data.value, function( choiceID ) { #>
					<li {{{ data.inputAttrs }}} class='kirki-sortable-item' data-value='{{ choiceID }}'>
						<i class='dashicons dashicons-menu'></i>
						<i class="dashicons dashicons-visibility visibility"></i>
						{{{ data.choices[ choiceID ] }}}
					</li>
				<# }); #>
				<# _.each( data.choices, function( choiceLabel, choiceID ) { #>
					<# if ( -1 === data.value.indexOf( choiceID ) ) { #>
						<li {{{ data.inputAttrs }}} class='kirki-sortable-item invisible' data-value='{{ choiceID }}'>
							<i class='dashicons dashicons-menu'></i>
							<i class="dashicons dashicons-visibility visibility"></i>
							{{{ data.choices[ choiceID ] }}}
						</li>
					<# } #>
				<# }); #>
			</ul>
		</label>

		<?php
	}
}

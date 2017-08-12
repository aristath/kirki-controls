<?php
/**
 * Customizer Control: kirki-select.
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
class Kirki_Control_Select extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-select';

	/**
	 * Maximum number of options the user will be able to select.
	 * Set to 1 for single-select.
	 *
	 * @access public
	 * @var int
	 */
	public $multiple = 1;

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_script( 'kirki-dynamic-control', trailingslashit( Kirki::$url ) . 'controls/assets/js/dynamic-control.js', array( 'jquery', 'customize-base' ), false, true );
		wp_enqueue_script( 'kirki-select', trailingslashit( Kirki::$url ) . 'controls/assets/js/select.js', array( 'jquery', 'customize-base', 'kirki-dynamic-control', 'select2', 'jquery-ui-sortable' ), false, true );
		wp_enqueue_style( 'kirki-styles', trailingslashit( Kirki::$url ) . 'controls/assets/styles.css', null );
		wp_enqueue_script( 'select2', trailingslashit( Kirki::$url ) . 'controls/assets/vendor/select2/js/select2.full.js', array( 'jquery' ), '4.0.3', true );
		wp_enqueue_style( 'select2', trailingslashit( Kirki::$url ) . 'controls/assets/vendor/select2/css/select2.css', array(), '4.0.3' );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @see WP_Customize_Control::to_json()
	 */
	public function to_json() {

		parent::to_json();
		$this->json['multiple'] = $this->multiple;
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
		<# if ( ! data.choices ) {
			return;
		}
		if ( 1 < data.multiple && data.value && _.isString( data.value ) ) {
			data.value = [ data.value ];
		}
		#>
		<label>
			<# if ( data.label ) { #><span class="customize-control-title">{{ data.label }}</span><# } #>
			<# if ( data.description ) { #><span class="description customize-control-description">{{{ data.description }}}</span><# } #>
			<select {{{ data.inputAttrs }}} {{{ data.link }}}<# if ( 1 < data.multiple ) { #> data-multiple="{{ data.multiple }}" multiple="multiple"<# } #>>
				<# _.each( data.choices, function( optionLabel, optionKey ) { #>
					<# selected = ( data.value === optionKey ); #>
					<# if ( 1 < data.multiple && data.value ) { #>
						<# selected = _.contains( data.value, optionKey ); #>
					<# } #>
					<# if ( _.isObject( optionLabel ) ) { #>
						<optgroup label="{{ optionLabel[0] }}">
							<# _.each( optionLabel[1], function( optgroupOptionLabel, optgroupOptionKey ) { #>
								<# selected = ( data.value === optgroupOptionKey ); #>
								<# if ( 1 < data.multiple && data.value ) { #>
									<# selected = _.contains( data.value, optgroupOptionKey ); #>
								<# } #>
								<option value="{{ optgroupOptionKey }}"<# if ( selected ) { #> selected <# } #>>{{ optgroupOptionLabel }}</option>
							<# }); #>
						</optgroup>
					<# } else { #>
						<option value="{{ optionKey }}"<# if ( selected ) { #> selected <# } #>>{{ optionLabel }}</option>
					<# } #>
				<# }); #>
			</select>
		</label>
		<?php
	}
}

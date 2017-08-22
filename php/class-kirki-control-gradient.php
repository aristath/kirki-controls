<?php
/**
 * Customizer Control: gradient.
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
 * Adds a gradients control.
 *
 * @uses https://github.com/23r9i0/wp-color-picker-alpha
 */
class Kirki_Control_Gradient extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-gradient';

	/**
	 * Colorpicker palette
	 *
	 * @access public
	 * @var bool
	 */
	public $palette = true;

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @access public
	 */
	public function to_json() {

		parent::to_json();
		$this->json['palette']  = $this->palette;
		$this->choices['alpha'] = ( isset( $this->choices['alpha'] ) && $this->choices['alpha'] ) ? 'true' : 'false';
	}

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

		wp_enqueue_script( 'wp-color-picker-alpha', kirki_controls()->get_url( 'vendor/wp-color-picker-alpha/wp-color-picker-alpha.js' ), array( 'wp-color-picker' ), '1.2', true );
		wp_enqueue_style( 'wp-color-picker' );
		parent::enqueue();
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
			<span class="customize-control-title">
				{{{ data.label }}}
			</span>
			<# if ( data.description ) { #>
				<span class="description customize-control-description">{{{ data.description }}}</span>
			<# } #>
		</label>
		<div class="gradient-preview" style="width:{{ data.choices.preview.width }};height:{{ data.choices.preview.height }}"></div>
		<div class="global">
			<!-- <div class="mode">
				<h4><?php esc_attr_e( 'Mode', 'kirki' ); ?></h4>
				<input class="switch-input screen-reader-text" type="radio" value="linear" name="_customize-gradient-{{{ data.id }}}" id="{{ data.id }}linear" <# if ( ! _.isUndefined( data.value.mode ) && 'linear' === data.value.mode ) { #> checked="checked" <# } #>>
					<label class="switch-label switch-label-<# if ( ! _.isUndefined( data.value.mode ) && 'linear' === data.value.mode ) { #>on <# } else { #>off<# } #>" for="{{ data.id }}linear"><span class="dashicons dashicons-minus"></span><span class="screen-reader-text"><?php esc_attr_e( 'Linear', 'kirki' ); ?></span></label>
				</input>
				<input class="switch-input screen-reader-text" type="radio" value="radial" name="_customize-gradient-{{{ data.id }}}" id="{{ data.id }}radial" <# if ( ! _.isUndefined( data.value.mode ) && 'radial' === data.value.mode ) { #> checked="checked" <# } #>>
					<label class="switch-label switch-label-<# if ( ! _.isUndefined( data.value.mode ) && 'radial' === data.value.mode ) { #>on <# } else { #>off<# } #>" for="{{ data.id }}radial"><span class="dashicons dashicons-marker"></span><span class="screen-reader-text"><?php esc_attr_e( 'Radial', 'kirki' ); ?></span></label>
				</input>
			</div> -->
			<div class="angle">
				<h4><?php esc_attr_e( 'Angle', 'kirki' ); ?></h4>
				<input type="range" class="angle gradient-{{ data.id }}" value="{{ data.value.angle }}" min="-90" max="90">
			</div>
		</div>
		<hr>
		<div class="colors">
			<div class="color-start">
				<div class="color">
					<h4><?php esc_attr_e( 'Start Color', 'kirki' ); ?></h4>
					<input type="text" {{{ data.inputAttrs }}} data-palette="{{ data.palette }}" data-default-color="{{ data.default.start.color }}" data-alpha="{{ data.choices['alpha'] }}" value="{{ data.value.start.color }}" class="kirki-gradient-control-start color-picker" />
				</div>
				<div class="position">
					<h4><?php esc_attr_e( 'Color Stop', 'kirki' ); ?></h4>
					<input type="range" class="position gradient-{{ data.id }}-start" value="{{ data.value.start.position }}" min="0" max="100">
				</div>
			</div>
			<hr>
			<div class="color-end">
				<div class="color">
					<h4><?php esc_attr_e( 'End Color', 'kirki' ); ?></h4>
					<input type="text" {{{ data.inputAttrs }}} data-palette="{{ data.palette }}" data-default-color="{{ data.default.end.color }}" data-alpha="{{ data.choices['alpha'] }}" value="{{ data.value.end.color }}" class="kirki-gradient-control-end color-picker" />
				</div>
				<div class="position">
					<h4><?php esc_attr_e( 'Color Stop', 'kirki' ); ?></h4>
					<input type="range" class="position gradient-{{ data.id }}-end" value="{{ data.value.end.position }}" min="0" max="100">
				</div>
			</div>
		</div>
		<?php
	}
}

<?php
/**
 * Customizer Controls Base.
 *
 * Extend this in other controls.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       3.0.10
 */

/**
 * A base for controls.
 */
class Kirki_Control_Base extends WP_Customize_Control {

	/**
	 * Used to automatically generate all CSS output.
	 *
	 * @access public
	 * @var array
	 */
	public $output = array();

	/**
	 * Data type
	 *
	 * @access public
	 * @var string
	 */
	public $option_type = 'theme_mod';

	/**
	 * The kirki_config we're using for this control
	 *
	 * @access public
	 * @var string
	 */
	public $kirki_config = 'global';

	/**
	 * Returns an array of extra field dependencies for Kirki controls.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @return array
	 */
	protected function kirki_script_dependencies() {
		return array();
	}

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_script( 'kirki', kirki_controls()->get_url( 'js/kirki.js' ), array( 'jquery', 'customize-base' ), false, true );
		if ( ! in_array( $this->type, array(
			'kirki-color-palette',
			'kirki-dashicons',
			'kirki-palette',
			'kirki-radio-buttonset',
			'kirki-radio-image',
			'kirki-radio'
		) ) ) {
			$type = str_replace( 'kirki-', '', $this->type );
			wp_enqueue_script( $this->type , kirki_controls()->get_url( "js/$type.js" ), array_merge( $this->kirki_script_dependencies(), array( 'kirki', 'kirki' ) ), false, true );
		}
		wp_enqueue_style( 'kirki-styles', kirki_controls()->get_url( 'css/styles.css' ), null );
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @see WP_Customize_Control::to_json()
	 */
	public function to_json() {
		// Get the basics from the parent class.
		parent::to_json();
		// Default.
		$this->json['default'] = $this->setting->default;
		if ( isset( $this->default ) ) {
			$this->json['default'] = $this->default;
		}
		// Output.
		$this->json['output']  = $this->output;
		// Value.
		$this->json['value']   = $this->value();
		// Choices.
		$this->json['choices'] = $this->choices;
		// The link.
		$this->json['link']    = $this->get_link();
		// The ID.
		$this->json['id']      = $this->id;
		// Translation strings.
		$this->json['l10n']    = $this->l10n();
		// The ajaxurl in case we need it.
		$this->json['ajaxurl'] = admin_url( 'admin-ajax.php' );
		// Input attributes.
		$this->json['inputAttrs'] = '';
		foreach ( $this->input_attrs as $attr => $value ) {
			$this->json['inputAttrs'] .= $attr . '="' . esc_attr( $value ) . '" ';
		}
	}

	/**
	 * Render the control's content.
	 *
	 * Allows the content to be overridden without having to rewrite the wrapper in `$this::render()`.
	 *
	 * Supports basic input types `text`, `checkbox`, `textarea`, `radio`, `select` and `dropdown-pages`.
	 * Additional input types such as `email`, `url`, `number`, `hidden` and `date` are supported implicitly.
	 *
	 * Control content can alternately be rendered in JS. See WP_Customize_Control::print_template().
	 *
	 * @since 3.4.0
	 */
	protected function render_content() {}

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
		// This HTML will be replaced when the control is loaded.
		echo '<h4>' . esc_attr__( 'Please wait while we load the control', 'kirki' ) . '</h4>';
	}

	/**
	 * Returns an array of translation strings.
	 *
	 * @access protected
	 * @since 3.0.0
	 * @return array
	 */
	protected function l10n() {
		return array();
	}
}

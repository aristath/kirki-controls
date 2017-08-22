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

		// Add colorpicker.
		wp_enqueue_style( 'wp-color-picker-alpha' );
		wp_enqueue_script( 'wp-color-picker-alpha', kirki_controls()->get_url( 'vendor/wp-color-picker-alpha/wp-color-picker-alpha.js' ), array( 'wp-color-picker' ), '1.2', true );
		wp_enqueue_style( 'wp-color-picker' );

		if ( 'kirki-code' === $this->type ) {
			// Register codemirror.
			wp_register_script( 'codemirror', kirki_controls()->get_url( 'vendor/codemirror/lib/codemirror.js' ), array( 'jquery' ) );

			// If we're using html mode, we'll also need to include the multiplex addon
			// as well as dependencies for XML, JS, CSS languages.
			switch ( $this->choices['language'] ) {
				case 'html':
				case 'htmlmixed':
					wp_enqueue_script( 'codemirror-multiplex', kirki_controls()->get_url( 'vendor/codemirror/addon/mode/multiplex.js' ), array( 'jquery', 'codemirror' ) );
					wp_enqueue_script( 'codemirror-language-xml', kirki_controls()->get_url( 'vendor/codemirror/mode/xml/xml.js' ), array( 'jquery', 'codemirror' ) );
					wp_enqueue_script( 'codemirror-language-javascript', kirki_controls()->get_url( 'vendor/codemirror/mode/javascript/javascript.js' ), array( 'jquery', 'codemirror' ) );
					wp_enqueue_script( 'codemirror-language-css', kirki_controls()->get_url( 'vendor/codemirror/mode/css/css.js' ), array( 'jquery', 'codemirror' ) );
					wp_enqueue_script( 'codemirror-language-htmlmixed', kirki_controls()->get_url( 'vendor/codemirror/mode/htmlmixed/htmlmixed.js' ), array( 'jquery', 'codemirror', 'codemirror-multiplex', 'codemirror-language-xml', 'codemirror-language-javascript', 'codemirror-language-css' ) );
					break;
				case 'php':
					wp_enqueue_script( 'codemirror-language-xml', kirki_controls()->get_url( 'vendor/codemirror/mode/xml/xml.js' ), array( 'jquery', 'codemirror' ) );
					wp_enqueue_script( 'codemirror-language-clike', kirki_controls()->get_url( 'vendor/codemirror/mode/clike/clike.js' ), array( 'jquery', 'codemirror' ) );
					wp_enqueue_script( 'codemirror-language-php', kirki_controls()->get_url( 'vendor/codemirror/mode/php/php.js' ), array( 'jquery', 'codemirror', 'codemirror-language-xml', 'codemirror-language-clike' ) );
					break;
				default:
					// Add language script.
					wp_enqueue_script( 'codemirror-language-' . $this->choices['language'], kirki_controls()->get_url( 'vendor/codemirror/mode/' . $this->choices['language'] . '/' . $this->choices['language'] . '.js' ), array( 'jquery', 'codemirror' ) );
					break;
			}

			// Add theme styles.
			wp_enqueue_style( 'codemirror-theme-' . $this->choices['theme'], kirki_controls()->get_url( 'vendor/codemirror/theme/' . $this->choices['theme'] . '.css' ) );
		}

		wp_enqueue_style( 'kirki-fontawesome-font-css', kirki_controls()->get_url( 'vendor/fontawesome/font-awesome.css' ), null );
		wp_enqueue_script( 'select2', kirki_controls()->get_url( 'vendor/select2/js/select2.full.js' ), array( 'jquery' ), '4.0.3', true );
		wp_enqueue_style( 'select2', kirki_controls()->get_url( 'vendor/select2/css/select2.css' ), array(), '4.0.3' );
		parent::enqueue();

		ob_start();
		$json_path = wp_normalize_path( KIRKI_CONTROLS_PATH . '/vendor/fontawesome/fontawesome.json' );
		include( $json_path );
		$font_awesome_json = ob_get_clean();

		wp_enqueue_style( 'kirki-styles', kirki_controls()->get_url( 'css/styles.css' ), null );
		$dependencies = array(
			'jquery',
			'customize-base',
			'wp-color-picker-alpha',
			'jquery-ui-button',
			'jquery-ui-datepicker',
			'select2',
			'jquery-ui-spinner',
			'jquery-ui-sortable',
			'jquery-ui-accordion',
		);
		wp_enqueue_script( 'kirki', kirki_controls()->get_url( 'js/kirki.js' ), $dependencies, false, true );
		wp_localize_script( 'kirki', 'fontAwesomeJSON', $font_awesome_json );

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

			'openEditor'   => esc_attr__( 'Open Editor', 'kirki' ),
			'closeEditor'  => esc_attr__( 'Close Editor', 'kirki' ),
			'switchEditor' => esc_attr__( 'Switch Editor', 'kirki' ),

			'noFileSelected' => esc_attr__( 'No File Selected', 'kirki' ),
			'remove'         => esc_attr__( 'Remove', 'kirki' ),
			'selectFile'     => esc_attr__( 'Select File', 'kirki' ),
			'defaultImage'   => esc_attr__( 'Default', 'kirki' ),

			'minError'  => esc_attr__( 'Value lower than allowed minimum', 'kirki' ),
			'maxError'  => esc_attr__( 'Value higher than allowed maximum', 'kirki' ),
			'stepError' => esc_attr__( 'Invalid Value', 'kirki' ),

			'fontFamily'       => esc_attr__( 'Font Family', 'kirki' ),
			'selectFontFamily' => esc_attr__( 'Select Font Family', 'kirki' ),
			'backupFont'       => esc_attr__( 'Backup Font', 'kirki' ),
			'variant'          => esc_attr__( 'Variant', 'kirki' ),
			'fontSize'         => esc_attr__( 'Font Size', 'kirki' ),
			'lineHeight'       => esc_attr__( 'Line Height', 'kirki' ),
			'letterSpacing'    => esc_attr__( 'Letter Spacing', 'kirki' ),
			'wordSpacing'      => esc_attr__( 'Word Spacing', 'kirki' ),
			'textAlign'        => esc_attr__( 'Text Align', 'kirki' ),
			'inherit'          => esc_attr__( 'Inherit', 'kirki' ),
			'left'             => esc_attr__( 'Left', 'kirki' ),
			'center'           => esc_attr__( 'Center', 'kirki' ),
			'justify'          => esc_attr__( 'Justify', 'kirki' ),
			'textTransform'    => esc_attr__( 'Text Transform', 'kirki' ),
			'none'             => esc_attr__( 'None', 'kirki' ),
			'capitalize'       => esc_attr__( 'Capitalize', 'kirki' ),
			'uppercase'        => esc_attr__( 'Uppercase', 'kirki' ),
			'lowercase'        => esc_attr__( 'Lowercase', 'kirki' ),
			'initial'          => esc_attr__( 'Initial', 'kirki' ),
			'inherit'          => esc_attr__( 'Inherit', 'kirki' ),
			'color'            => esc_attr__( 'Color', 'kirki' ),
			'marginTop'        => esc_attr__( 'Margin Top', 'kirki' ),
			'marginBottom'     => esc_attr__( 'Margin Bottom', 'kirki' ),
		);
	}
}

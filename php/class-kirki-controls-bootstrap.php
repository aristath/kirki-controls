<?php
/**
 * Bootstrap Kirki Controls.
 *
 * @package     Kirki
 * @category    Controls
 * @author      Aristeides Stathopoulos
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       3.0.10
 */

if ( class_exists( 'Kirki_Controls_Bootstrap' ) ) {
	return;
}

/**
 * Takes care of bootstrapping Kirki Controls.
 */
class Kirki_Controls_Bootstrap {

	/**
	 * A single instance of this object.
	 *
	 * @static
	 * @access private
	 * @since 3.0.10
	 * @var object Kirki_Controls_Bootstrap
	 */
	private static $instance;

	/**
	 * The URL of the controls folder.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @var string
	 */
	protected $url = '';

	/**
	 * An array of control-types along with their classes.
	 * You can use the "kirki/control_types" filter to change these.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @var array
	 */
	private $control_types = array();

	/**
	 * An array of control classes that we don't want to register.
	 * You can use the "kirki/control_types/exclude" to change these.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @var array
	 */
	protected $skip_types = array(
		'Kirki_Control_Repeater',
		'WP_Customize_Control',
	);

	/**
	 * Get a single instance of this object.
	 *
	 * @static
	 * @access public
	 * @since 3.0.10
	 * @return object Kirki_Controls_Bootstrap
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * The class contructor.
	 *
	 * @access private
	 * @since 3.0.10
	 */
	private function __construct() {

		spl_autoload_register( array( $this, 'autoload' ) );
		add_action( 'customize_register', array( $this, 'register_control_types' ) );
		$this->control_types = $this->get_control_types();
		add_filter( 'kirki/control_types', array( $this, 'get_control_types' ), 1 );

		add_action( 'wp_ajax_kirki_get_googlefonts_ajax', array( $this, 'get_googlefonts_ajax' ) );
		add_action( 'wp_ajax_nopriv_kirki_get_googlefonts_ajax', array( $this, 'get_googlefonts_ajax' ) );
	}

	/**
	 * Registers control types.
	 *
	 * @access public
	 * @since 3.0.10
	 */
	public function register_control_types() {

		global $wp_customize;

		$skip_control_types  = apply_filters( 'kirki/control_types/exclude', $this->skip_types );

		foreach ( $this->control_types as $control_type ) {
			if ( ! in_array( $control_type, $skip_control_types, true ) && class_exists( $control_type ) ) {
				$wp_customize->register_control_type( $control_type );
			}
		}
	}

	/**
	 * Adds default control types for Kirki.
	 *
	 * @access public
	 * @since 3.0.10
	 * @return array
	 */
	public function get_control_types() {
		return array(
			'kirki-background'      => 'Kirki_Control_Background',
			'kirki-checkbox'        => 'Kirki_Control_Checkbox',
			'kirki-code'            => 'Kirki_Control_Code',
			'kirki-color'           => 'Kirki_Control_Color',
			'kirki-color-palette'   => 'Kirki_Control_Color_Palette',
			'kirki-custom'          => 'Kirki_Control_Custom',
			'kirki-date'            => 'Kirki_Control_Date',
			'kirki-dashicons'       => 'Kirki_Control_Dashicons',
			'kirki-dimension'       => 'Kirki_Control_Dimension',
			'kirki-dimensions'      => 'Kirki_Control_Dimensions',
			'kirki-editor'          => 'Kirki_Control_Editor',
			'kirki-fontawesome'     => 'Kirki_Control_FontAwesome',
			'kirki-gradient'        => 'Kirki_Control_Gradient',
			'kirki-image'           => 'Kirki_Control_Image',
			'kirki-multicolor'      => 'Kirki_Control_Multicolor',
			'kirki-multicheck'      => 'Kirki_Control_MultiCheck',
			'kirki-number'          => 'Kirki_Control_Number',
			'kirki-palette'         => 'Kirki_Control_Palette',
			'kirki-preset'          => 'Kirki_Control_Preset',
			'kirki-radio'           => 'Kirki_Control_Radio',
			'kirki-radio-buttonset' => 'Kirki_Control_Radio_ButtonSet',
			'kirki-radio-image'     => 'Kirki_Control_Radio_Image',
			'kirki-repeater'        => 'Kirki_Control_Repeater',
			'kirki-select'          => 'Kirki_Control_Select',
			'kirki-slider'          => 'Kirki_Control_Slider',
			'kirki-sortable'        => 'Kirki_Control_Sortable',
			'kirki-spacing'         => 'Kirki_Control_Dimensions',
			'kirki-switch'          => 'Kirki_Control_Switch',
			'kirki-generic'         => 'Kirki_Control_Generic',
			'kirki-toggle'          => 'Kirki_Control_Toggle',
			'kirki-typography'      => 'Kirki_Control_Typography',
			'image'                 => 'Kirki_Control_Image',
			'cropped_image'         => 'WP_Customize_Cropped_Image_Control',
			'upload'                => 'WP_Customize_Upload_Control',
		);
	}

	/**
	 * The controls autoloader.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @param string $class_name The class-name we want to load.
	 */
	protected function autoload( $class_name ) {

		if ( 0 === stripos( $class_name, 'Kirki_Control_' ) || 0 === stripos( $class_name, 'Kirki_Settings_' ) ) {

			// Build the file-path.
			$path = wp_normalize_path( dirname( __FILE__ ) . '/class-' . strtolower( str_replace( '_', '-', $class_name ) ) . '.php' );
			if ( file_exists( $path ) ) {
				include_once $path;
			}
		}
	}

	/**
	 * Gets the URL of a file relative to the root folder of Kirki Controls.
	 *
	 * @access public
	 * @since 3.0.10
	 * @param string $file The filename with relative path.
	 * @return string      The URL.
	 */
	public function get_url( $file ) {
		if ( '' === $this->url ) {
			// Fallback first.
			$this->url = str_replace( ABSPATH, home_url(), KIRKI_CONTROLS_PATH );
			// Check if in a theme, parent theme or plugin.
			if ( false !== strpos( KIRKI_CONTROLS_PATH, get_stylesheet_directory() ) ) {
				$this->url = str_replace( get_stylesheet_directory(), get_stylesheet_directory_uri(), KIRKI_CONTROLS_PATH );
			} elseif ( false !== strpos( KIRKI_CONTROLS_PATH, get_template_directory() ) ) {
				$this->url = str_replace( get_template_directory(), get_template_directory_uri(), KIRKI_CONTROLS_PATH );
			} elseif ( false !== strpos( KIRKI_CONTROLS_PATH, WP_PLUGIN_DIR ) ) {
				$this->url = str_replace( WP_PLUGIN_DIR, plugins_url(), KIRKI_CONTROLS_PATH );
			}
		}
		return esc_url_raw( trailingslashit( $this->url ) . $file );
	}

	/**
	 * This is fired via AJAX to return an array of googlefonts.
	 *
	 * @access public
	 * @since 3.0.10
	 */
	function get_googlefonts_ajax() {
		if ( ! class_exists( 'Kirki_Fonts' ) ) {
			include_once KIRKI_CONTROLS_PATH . '/php/class-kirki-fonts.php';
		}
		// Add fonts to our JS objects.
		$google_fonts = Kirki_Fonts::get_google_fonts();
		$all_variants = Kirki_Fonts::get_all_variants();
		$all_subsets  = Kirki_Fonts::get_google_font_subsets();

		$google_fonts_final = array();
		foreach ( $google_fonts as $family => $args ) {
			$variants = ( isset( $args['variants'] ) ) ? $args['variants'] : array( 'regular', '700' );
			$subsets  = ( isset( $args['subsets'] ) ) ? $args['subsets'] : array();

			$available_variants = array();
			if ( is_array( $variants ) ) {
				foreach ( $variants as $variant ) {
					if ( array_key_exists( $variant, $all_variants ) ) {
						$available_variants[] = array(
							'id'    => $variant,
							'label' => $all_variants[ $variant ],
						);
					}
				}
			}

			$available_subsets = array();
			if ( is_array( $subsets ) ) {
				foreach ( $subsets as $subset ) {
					if ( array_key_exists( $subset, $all_subsets ) ) {
						$available_subsets[] = array(
							'id'    => $subset,
							'label' => $all_subsets[ $subset ],
						);
					}
				}
			}

			$google_fonts_final[] = array(
				'family'   => $family,
				'label'    => ( isset( $args['label'] ) ) ? $args['label'] : $family,
				'variants' => $available_variants,
				'subsets'  => $available_subsets,
			);
		} // End foreach().

		$standard_fonts = Kirki_Fonts::get_standard_fonts();

		$standard_fonts_final = array();
		$default_variants = $this->format_variants_array( array( 'regular', 'italic', '700', '700italic' ) );
		foreach ( $standard_fonts as $font ) {
			$standard_fonts_final[] = array(
				'family'      => $font['stack'],
				'label'       => $font['label'],
				'subsets'     => array(),
				'is_standard' => true,
				'variants'    => ( isset( $font['variants'] ) ) ? $this->format_variants_array( $font['variants'] ) : $default_variants,
			);
		}

		echo wp_json_encode( array(
			'standard' => $standard_fonts_final,
			'google'   => $google_fonts_final,
		) );
		wp_die();
	}

	/**
	 * Formats variants.
	 *
	 * @access protected
	 * @since 3.0.0
	 * @param array $variants The variants.
	 * @return array
	 */
	protected function format_variants_array( $variants ) {

		if ( ! class_exists( 'Kirki_Fonts' ) ) {
			include_once dirname( __FILE__ ) . '/php/class-kirki-fonts.php';
		}
		$all_variants = Kirki_Fonts::get_all_variants();
		$final_variants = array();
		foreach ( $variants as $variant ) {
			if ( is_string( $variant ) ) {
				$final_variants[] = array(
					'id'    => $variant,
					'label' => isset( $all_variants[ $variant ] ) ? $all_variants[ $variant ] : $variant,
				);
			} elseif ( is_array( $variant ) && isset( $variant['id'] ) && isset( $variant['label'] ) ) {
				$final_variants[] = $variant;
			}
		}
		return $final_variants;
	}
}

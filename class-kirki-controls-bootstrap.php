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

class Kirki_Controls_Bootstrap {

	/**
	 * The URL of the controls folder.
	 *
	 * @static
	 * @access protected
	 * @since 3.0.10
	 * @var string
	 */
	protected static $url = '';

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
	protected $do_not_register_types = array(
		'Kirki_Control_Repeater',
		'WP_Customize_Control',
	);

	/**
	 * The class contructor.
	 *
	 * @access public
	 * @since 3.0.10
	 */
	public function __construct() {

		$this->define_path();
		spl_autoload_register( array( $this, 'autoload' ) );
		add_action( 'customize_register', array( $this, 'register_control_types' ) );
		$this->control_types = $this->get_control_types();
		add_filter( 'kirki/control_types', array( $this, 'get_control_types' ), 1 );
	}

	/**
	 * Registers control types.
	 *
	 * @access public
	 * @since 3.0.10
	 */
	public function register_control_types() {

		global $wp_customize;

		$skip_control_types  = apply_filters( 'kirki/control_types/exclude', $this->do_not_register_types );

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
	 * @param array $control_types Any pre-existing control-types.
	 * @return array
	 */
	public function get_control_types() {
		return array(
			'checkbox'              => 'WP_Customize_Control',
			'kirki-background'      => 'Kirki_Control_Background',
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
			'repeater'              => 'Kirki_Control_Repeater',
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
			$path = wp_normalize_path( dirname( __FILE__ ) . '/classes/' . 'class-' . strtolower( str_replace( '_', '-', $class_name ) ) . '.php' );
			if ( file_exists( $path ) ) {
				include_once $path;
			}
		}
	}

	/**
	 * Defines the KIRKI_CONTROLS_PATH constant.
	 *
	 * @access protected
	 * @since 3.0.10
	 */
	public function define_path() {

		if ( ! defined( 'KIRKI_CONTROLS_PATH' ) ) {
			define( 'KIRKI_CONTROLS_PATH', dirname( __FILE__ ) );
		}
	}

	/**
	 * Gets the URL of a file relative to the root folder of Kirki Controls.
	 *
	 * @static
	 * @access public
	 * @since 3.0.10
	 * @param string $file The filename with relative path.
	 * @return string      The URL.
	 */
	public static function get_url( $file ) {
		if ( '' === self::$url ) {
			// Fallback first.
			self::$url = str_replace( ABSPATH, home_url(), KIRKI_CONTROLS_PATH );
			// Check if in a theme, parent theme or plugin.
			if ( false !== strpos( KIRKI_CONTROLS_PATH, get_stylesheet_directory() ) ) {
				self::$url = str_replace( get_stylesheet_directory(), get_stylesheet_directory_uri(), KIRKI_CONTROLS_PATH );
			} elseif ( false !== strpos( KIRKI_CONTROLS_PATH, get_template_directory() ) ) {
				self::$url = str_replace( get_template_directory(), get_template_directory_uri(), KIRKI_CONTROLS_PATH );
			} elseif ( false !== strpos( KIRKI_CONTROLS_PATH, WP_PLUGIN_DIR ) )  {
				self::$url = str_replace( WP_PLUGIN_DIR, plugins_url(), KIRKI_CONTROLS_PATH );
			}
		}
		return esc_url_raw( trailingslashit( self::$url ) . $file );
	}
}

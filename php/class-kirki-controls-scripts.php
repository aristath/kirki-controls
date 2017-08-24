<?php
/**
 * Gets the scripts for controls.
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
 * Registers and enqueues scripts and styles for kirki-controls.
 */
class Kirki_Controls_Scripts {

	/**
	 * An array of all the control-types.
	 *
	 * @access private
	 * @since 3.0.10
	 * @var array
	 */
	private $control_types = array();

	private $extra_dependencies = array();

	/**
	 * The class constructor.
	 *
	 * @access public
	 * @since 3.0.10
	 */
	public function __construct() {
		$control_types = Kirki_Controls_Bootstrap::get_instance()->get_control_types();
		$this->control_types = array_keys( $control_types );
	}

	public function get_control_handle( $handle, $with_prefix = true ) {
		$handle  = str_replace( 'kirki-', '', $handle );
		if ( ! in_array( 'kirki-' . $handle, $this->control_types ) ) {
			$handle = 'generic';
		}
		if ( $with_prefix ) {
			return 'kirki-' . $handle;
		}
		return $handle;
	}

	public function enqueue_control_assets( $control ) {
		$this->register_all_control_scripts();
		$control = $this->get_control_handle( $control );
		wp_enqueue_script( $control );
		$dependencies = $this->dependencies( $control );
		foreach ( $dependencies['styles'] as $style ) {
			if ( $this->get_asset_url( $style ) ) {
				wp_enqueue_style( $style, $this->get_asset_url( $style ) );
				continue;
			}
			wp_enqueue_style( $style );
		}
		wp_enqueue_style( 'kirki-styles', kirki_controls()->get_url( 'css/styles.css' ), null );
	}

	public function add_extra_dependencies( $handle, $dependencies ) {
		if ( ! isset( $this->extra_dependencies[ $handle ] ) ) {
			$this->extra_dependencies[ $handle ] = array();
		}
		$dependencies = (array) $dependencies;
		$this->extra_dependencies[ $handle ] = array_merge( $this->extra_dependencies[ $handle ], $dependencies );
	}

	public function register_control_scripts( $control_type ) {
		$control_type = $this->get_control_handle( $control_type );
		$dependencies = $this->dependencies( $control_type );
		foreach ( $dependencies['scripts'] as $script ) {
			if ( $this->get_asset_url( $script ) ) {
				$script_dependencies = $this->dependencies( $script );
				wp_register_script(
					$script,
					$this->get_asset_url( $script ),
					(array) $script_dependencies['scripts'],
					false,
					true
				);
			}
		}
		wp_register_script(
			$control_type,
			$this->get_asset_url( $control_type ),
			$dependencies['scripts'],
			false,
			true
		);
	}

	public function register_all_control_scripts() {
		foreach ( $this->control_types as $control_type ) {
			$this->register_control_scripts( $control_type );
		}
	}

	protected function get_asset_url( $handle ) {

		switch ( $handle ) {
			case 'kirki':
				return kirki_controls()->get_url( 'js/kirki.js' );
			case 'wp-color-picker-alpha':
				return kirki_controls()->get_url( 'vendor/wp-color-picker-alpha/wp-color-picker-alpha.js' );
			case 'select2':
				return kirki_controls()->get_url( 'vendor/select2/js/select2.full.js' );
			default:
				if ( false === strpos( $handle, 'kirki-' ) ) {
					return false;
				}
				$handle = $this->get_control_handle( $handle, false );
				return kirki_controls()->get_url( "js/$handle.js" );
				break;
		}
	}

	/**
	 * Returns an array of extra dependencies for scripts.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @param string|null $handle The handle of the script.
	 * @return array
	 */
	protected function dependencies( $handle ) {
		$styles  = array();
		$scripts = array();
		switch ( $handle ) {
			case 'kirki':
				$scripts[] = 'jquery';
				$scripts[] = 'customize-base';
				break;
			case 'kirki-background':
			case 'kirki-color':
			case 'kirki-gradient':
			case 'kirki-multicolor':
				$scripts[] = 'kirki';
				$scripts[] = 'wp-color-picker-alpha';
				$styles[]  = 'wp-color-picker';
				break;
			case 'kirki-date':
				$scripts[] = 'kirki';
				$scripts[] = 'jquery-ui-datepicker';
				break;
			case 'kirki-fontawesome':
				$scripts[] = 'kirki';
				$scripts[] = 'select2';
				$styles[]  = 'select2';
				$styles[]  = 'kirki-fontawesome-font-css';
				break;
			case 'kirki-number':
				$scripts[] = 'kirki';
				$scripts[] = 'jquery-ui-button';
				$scripts[] = 'jquery-ui-spinner';
				break;
			case 'kirki-repeater':
				$scripts[] = 'kirki';
				$scripts[] = 'jquery-ui-sortable';
				$scripts[] = 'jquery-ui-accordion';
				$scripts[] = 'kirki-generic';
				break;
			case 'kirki-select':
				$scripts[] = 'kirki';
				$scripts[] = 'select2';
				$styles[]  = 'select2';
				break;
			case 'kirki-sortable':
				$scripts[] = 'kirki';
				$scripts[] = 'jquery-ui-core';
				$scripts[] = 'jquery-ui-sortable';
			case 'kirki-switch':
			case 'kirki-toggle':
				$scripts[] = 'kirki';
				$scripts[] = 'kirki-checkbox';
				break;
			case 'kirki-typography':
				$scripts[] = 'kirki';
				$scripts[] = 'wp-color-picker-alpha';
				$scripts[] = 'select2';
				$styles[]  = 'wp-color-picker';
				$styles[]  = 'select2';
			case 'kirki-text':
			case 'kirki-textarea':
				$scripts[] = 'kirki-generic';
				break;
			case 'kirki-generic':
			case 'kirki-radio':
			case 'kirki-checkbox':
			case 'kirki-color-palette':
			case 'kirki-dashicons':
				$scripts[] = 'kirki';
				break;
			case 'wp-color-picker-alpha':
				$scripts[] = 'wp-color-picker';
				break;
			case 'select2':
				$scripts[] = 'jquery';
				break;
		}
		if ( isset( $this->extra_dependencies[ $handle ] ) ) {
			$scripts = array_merge( $this->extra_dependencies[ $handle ], $scripts );
		}

		return array(
			'scripts' => $scripts,
			'styles'  => $styles,
		);
	}
}

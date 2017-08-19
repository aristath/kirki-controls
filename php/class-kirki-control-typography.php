<?php
/**
 * Customizer Control: typography.
 *
 * @package     Kirki
 * @subpackage  Controls
 * @copyright   Copyright (c) 2017, Aristeides Stathopoulos
 * @license     http://opensource.org/licenses/https://opensource.org/licenses/MIT
 * @since       2.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Typography control.
 */
class Kirki_Control_Typography extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-typography';

	/**
	 * Returns an array of extra field dependencies for Kirki controls.
	 *
	 * @access protected
	 * @since 3.0.10
	 * @return array
	 */
	protected function kirki_script_dependencies() {
		return array( 'wp-color-picker-alpha', 'select2' );
	}

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		wp_enqueue_script( 'wp-color-picker-alpha', kirki_controls()->get_url( 'vendor/wp-color-picker-alpha/wp-color-picker-alpha.js' ), array( 'wp-color-picker' ), '1.2', true );
		wp_enqueue_style( 'wp-color-picker' );

		wp_enqueue_script( 'select2', kirki_controls()->get_url( 'vendor/select2/js/select2.full.js' ), array( 'jquery' ), '4.0.3', true );
		wp_enqueue_style( 'select2', kirki_controls()->get_url( 'vendor/select2/css/select2.css' ), array(), '4.0.3' );

		parent::enqueue();

		$custom_fonts_array  = ( isset( $this->choices['fonts'] ) && ( isset( $this->choices['fonts']['google'] ) || isset( $this->choices['fonts']['standard'] ) ) && ( ! empty( $this->choices['fonts']['google'] ) || ! empty( $this->choices['fonts']['standard'] ) ) );
		if ( $custom_fonts_array ) {
			wp_localize_script( 'kirki-typography', 'kirkiFonts', array(
				'standard' => $this->get_standard_fonts(),
				'google'   => $this->get_google_fonts(),
			) );
		}
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @see WP_Customize_Control::to_json()
	 */
	public function to_json() {

		parent::to_json();
		$this->json['value']   = Kirki_Field_Typography::sanitize( $this->value() );
		$this->json['default'] = wp_parse_args( $this->json['default'], array(
			'font-family'    => false,
			'font-size'      => false,
			'variant'        => false,
			'line-height'    => false,
			'letter-spacing' => false,
			'word-spacing'   => false,
			'color'          => false,
			'text-align'     => false,
		) );

		// Fix for https://github.com/aristath/kirki/issues/1405.
		foreach ( array_keys( $this->json['value'] ) as $key ) {
			if ( isset( $this->json['default'][ $key ] ) && false === $this->json['default'][ $key ] ) {
				unset( $this->json['value'][ $key ] );
			}
		}
		$this->json['show_variants'] = ( true === Kirki_Fonts_Google::$force_load_all_variants ) ? false : true;
		$this->json['show_subsets']  = ( true === Kirki_Fonts_Google::$force_load_all_subsets ) ? false : true;
		$this->json['languages']     = Kirki_Fonts::get_google_font_subsets();
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

	/**
	 * Gets standard fonts properly formatted for our control.
	 *
	 * @access protected
	 * @since 3.0.0
	 * @return array
	 */
	protected function get_standard_fonts() {
		// Add fonts to our JS objects.
		$standard_fonts = Kirki_Fonts::get_standard_fonts();

		$std_user_keys = $this->choices['fonts']['standard'];

		$standard_fonts_final = array();
		$default_variants = $this->format_variants_array( array(
			'regular',
			'italic',
			'700',
			'700italic',
		) );
		foreach ( $standard_fonts as $key => $font ) {
			if ( ( ! empty( $std_user_keys ) && ! in_array( $key, $std_user_keys, true ) ) || ! isset( $font['stack'] ) || ! isset( $font['label'] ) ) {
				continue;
			}
			$standard_fonts_final[] = array(
				'family'      => $font['stack'],
				'label'       => $font['label'],
				'subsets'     => array(),
				'is_standard' => true,
				'variants'    => ( isset( $font['variants'] ) ) ? $this->format_variants_array( $font['variants'] ) : $default_variants,
			);
		}
		return $standard_fonts_final;
	}

	/**
	 * Gets google fonts properly formatted for our control.
	 *
	 * @access protected
	 * @since 3.0.0
	 * @return array
	 */
	protected function get_google_fonts() {
		// Add fonts to our JS objects.
		$google_fonts = Kirki_Fonts::get_google_fonts();
		$all_variants = Kirki_Fonts::get_all_variants();
		$all_subsets  = Kirki_Fonts::get_google_font_subsets();

		$gf_user_keys = $this->choices['fonts']['google'];

		$google_fonts_final = array();
		foreach ( $google_fonts as $family => $args ) {
			if ( ! empty( $gf_user_keys ) && ! in_array( $family, $gf_user_keys, true ) ) {
				continue;
			}

			$label    = ( isset( $args['label'] ) ) ? $args['label'] : $family;
			$variants = ( isset( $args['variants'] ) ) ? $args['variants'] : array( 'regular', '700' );
			$subsets  = ( isset( $args['subsets'] ) ) ? $args['subsets'] : array();

			$available_variants = array();
			if ( is_array( $variants ) ) {
				foreach ( $variants as $variant ) {
					if ( array_key_exists( $variant, $all_variants ) ) {
						$available_variants[] = array(
							'id' => $variant,
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
							'id' => $subset,
							'label' => $all_subsets[ $subset ],
						);
					}
				}
			}

			$google_fonts_final[] = array(
				'family'       => $family,
				'label'        => $label,
				'variants'     => $available_variants,
				'subsets'      => $available_subsets,
			);
		} // End foreach().
		return $google_fonts_final;
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

<?php
/**
 * Customizer Control: code.
 *
 * Creates a new custom control.
 * Custom controls accept raw HTML/JS.
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
 * Adds a "code" control, using CodeMirror.
 */
class Kirki_Control_Code extends Kirki_Control_Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @var string
	 */
	public $type = 'kirki-code';

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 */
	public function enqueue() {

		// Register codemirror.
		wp_register_script( 'codemirror', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/lib/codemirror.js' ), array( 'jquery' ) );
		wp_enqueue_script( 'kirki-dynamic-control', Kirki_Controls_Bootstrap::get_url( 'assets/js/dynamic-control.js' ), array( 'jquery', 'customize-base' ), false, true );

		// If we're using html mode, we'll also need to include the multiplex addon
		// as well as dependencies for XML, JS, CSS languages.
		switch ( $this->choices['language'] ) {
			case 'html':
			case 'htmlmixed':
				wp_enqueue_script( 'codemirror-multiplex', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/addon/mode/multiplex.js' ), array( 'jquery', 'codemirror' ) );
				wp_enqueue_script( 'codemirror-language-xml', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/xml/xml.js' ), array( 'jquery', 'codemirror' ) );
				wp_enqueue_script( 'codemirror-language-javascript', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/javascript/javascript.js' ), array( 'jquery', 'codemirror' ) );
				wp_enqueue_script( 'codemirror-language-css', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/css/css.js' ), array( 'jquery', 'codemirror' ) );
				wp_enqueue_script( 'codemirror-language-htmlmixed', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/htmlmixed/htmlmixed.js' ), array( 'jquery', 'codemirror', 'codemirror-multiplex', 'codemirror-language-xml', 'codemirror-language-javascript', 'codemirror-language-css' ) );
				break;
			case 'php':
				wp_enqueue_script( 'codemirror-language-xml', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/xml/xml.js' ), array( 'jquery', 'codemirror' ) );
				wp_enqueue_script( 'codemirror-language-clike', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/clike/clike.js' ), array( 'jquery', 'codemirror' ) );
				wp_enqueue_script( 'codemirror-language-php', Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/php/php.js' ), array( 'jquery', 'codemirror', 'codemirror-language-xml', 'codemirror-language-clike' ) );
				break;
			default:
				// Add language script.
				wp_enqueue_script( 'codemirror-language-' . $this->choices['language'], Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/mode/' . $this->choices['language'] . '/' . $this->choices['language'] . '.js' ), array( 'jquery', 'codemirror' ) );
				break;
		}

		// Add theme styles.
		wp_enqueue_style( 'codemirror-theme-' . $this->choices['theme'], Kirki_Controls_Bootstrap::get_url( 'assets/vendor/codemirror/theme/' . $this->choices['theme'] . '.css' ) );

		wp_enqueue_script( 'kirki-code', Kirki_Controls_Bootstrap::get_url( 'assets/js/code.js' ), array( 'jquery', 'customize-base', 'kirki-dynamic-control', 'codemirror' ), false, true );
		wp_enqueue_style( 'kirki-styles', Kirki_Controls_Bootstrap::get_url( 'assets/styles.css' ), null );
	}
}

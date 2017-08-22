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
		wp_register_script( 'codemirror', kirki_controls()->get_url( 'vendor/codemirror/lib/codemirror.js' ), array( 'jquery' ) );
		wp_enqueue_script( 'kirki', kirki_controls()->get_url( 'js/kirki.js' ), array( 'jquery', 'customize-base' ), false, true );

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

		wp_enqueue_script( 'kirki-code', kirki_controls()->get_url( 'js/code.js' ), array( 'jquery', 'customize-base', 'kirki', 'codemirror' ), false, true );
		wp_enqueue_style( 'kirki-styles', kirki_controls()->get_url( 'css/styles.css' ), null );
	}
}

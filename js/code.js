/* global wp, _, CodeMirror, kirki */
kirki.control.code = {
	init: function( control ) {
		var language = ( 'html' === control.params.choices.language ) ? { name: 'htmlmixed' } : control.params.choices.language,
		    element,
		    editor,
		    container,
		    height;

		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.code.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );

		element = kirki.util.controlContainer( control ).find( '.kirki-codemirror-editor' );

		editor = CodeMirror.fromTextArea( element[0], {
			value:        control.setting._value,
			mode:         language,
			lineNumbers:  true,
			lineWrapping: true,
			theme:        control.params.choices.theme
		} );

		if ( ! _.isUndefined( control.params.choices.height ) ) {
			height = Number( control.params.choices.height );
			if ( ! isNaN( height ) ) {
				container = kirki.util.controlContainer( control ).find( '.codemirror-kirki-wrapper' );
				jQuery( container ).css( 'max-height', function() {
					return control.params.choices.height;
				} );
				editor.setSize( null, control.params.choices.height );
			}
		}

		// On change make sure we infor the Customizer API
		editor.on( 'change', function() {
			control.setting.set( editor.getValue() );
		} );

		// Hack to refresh the editor when we open a section
		element.parents( '.accordion-section' ).on( 'click', function() {
			editor.refresh();
		} );
	},

	/**
	 * The HTML Template for 'code' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html    = '';

		html += '<label>';
			html += kirki.control.template.header( control );
			html += '<div class="codemirror-kirki-wrapper">';
				html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-code kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	/**
	 * Changes the value visually for 'code' controls.
	 *
	 * @param {object} [control] The control.
	 * @param {string} [value]   The value.
	 * @returns {void}
	 */
	value: {
		set: function( control, value ) {
			jQuery( kirki.util.controlContainer( control ).find( '.CodeMirror' ) )[0].CodeMirror.setValue( value );
		}
	}
};

wp.customize.controlConstructor['kirki-code'] = wp.customize.kirkiDynamicControl.extend({});

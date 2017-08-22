/* global wp, _, CodeMirror, kirki */

kirki.control.type.code = kirki.control.type['kirki-code'] = 'codeControl';

/**
 * The HTML Template for 'code' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.codeControl = function( control ) {
	var html    = '';

	html += '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div class="codemirror-kirki-wrapper">';
			html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
		html += '</div>';
	html += '</label>';

	return '<div class="kirki-control-wrapper-code">' + html + '</div>';
};


/**
 * Changes the value visually for 'code' controls.
 *
 * @param {object} [control] The control.
 * @param {string} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.codeControl = function( control, value ) {
	jQuery( control.container.find( '.CodeMirror' ) )[0].CodeMirror.setValue( value );
};

wp.customize.controlConstructor['kirki-code'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control  = this,
		    language = ( 'html' === control.params.choices.language ) ? { name: 'htmlmixed' } : control.params.choices.language,
		    element,
		    editor,
		    container,
		    height;

		control.container.html( kirki.control.template.codeControl( control ) );

		element = control.container.find( '.kirki-codemirror-editor' );

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
				container = control.container.find( '.codemirror-kirki-wrapper' );
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
	}
} );

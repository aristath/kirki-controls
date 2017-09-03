/* global wp, _, CodeMirror, kirki */
kirki.control.code = {
	/**
	 * Initialization for code controls.
	 *
	 * @param {object} [args] The arguments.
	 */
	init: function( args ) {
		var self     = this,
		    language = ( 'html' === args.language ) ? { name: 'htmlmixed' } : args.language,
		    element,
		    editor,
		    container,
		    height;

		self.template( args );

		element = jQuery( args.container ).find( '.kirki-codemirror-editor' );

		editor = CodeMirror.fromTextArea( element[0], {
			value: args.value,
			mode: args.language,
			lineNumbers: args.lineNumbers,
			lineWrapping: args.lineWrapping,
			theme: args.theme
		} );

		// On change make sure we infor the Customizer API
		editor.on( 'change', function() {
			kirki.setting.set( args.id, editor.getValue() );
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
	template: function( args ) {
		var html    = '';

		args.label       = args.label || '';
		args.description = args.description || false;
		args.inputAttrs  = args.inputAttrs || '';

		html += '<div class="kirki-control-wrapper-code kirki-control-wrapper" data-setting="' + args.id + '">';
			html += '<label>';
				html += '<span class="customize-control-title">' + args.label + '</span>';
				html += ( args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
				html += '<div class="codemirror-kirki-wrapper">';
					html += '<textarea ' + args.inputAttrs + ' class="kirki-codemirror-editor">' + args.value + '</textarea>';
				html += '</div>';
			html += '</label>';
		html += '</div>';

		jQuery( args.container ).html( html );
	},

	utils: {
		/**
		 * Changes the value visually for 'code' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		setValue: {
			set: function( id, value ) {
				var container = jQuery( '.kirki-control-wrapper[data-setting="' + id + '"]' );
				jQuery( container.find( '.CodeMirror' ) )[0].CodeMirror.setValue( value );
			}
		}
	}
};

wp.customize.controlConstructor['kirki-code'] = wp.customize.kirkiDynamicControl.extend({
	ready: function() {
		var control = this,
		    args    = {
				id: control.id,
				label: control.params.label,
				description: control.params.description,
				'default': control.params['default'],
				container: control.container,
				value: control.setting._value
		    };

		control._setUpSettingRootLinks();
		control._setUpSettingPropertyLinks();

		wp.customize.Control.prototype.ready.call( control );

		control.deferred.embedded.done( function() {

			// Add the control.

			kirki.control.code.init( _.defaults( args, control.params.choices ) );
		});
	}
});

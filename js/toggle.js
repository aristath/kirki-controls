/* global wp, _, kirki */

kirki.control.toggle = {
	init: function( control ) {
	},

	/**
	 * The HTML Template for 'toggle' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {

		var html = '';

		html += '<label for="toggle_' + control.id + '">';
			html += kirki.control.template.header( control );
			html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="toggle_' + control.id + '" id="toggle_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + ' hidden />';
			html += '<span class="switch"></span>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-toggle kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'toggle' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			jQuery( kirki.control.container( control ).find( 'input' ) ).prop( 'checked', value );
		}
	}
};

wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend( {
	kirkiSetValue: function( value ) {
		kirki.value.set.checkboxControl( this, value );
	}
} );

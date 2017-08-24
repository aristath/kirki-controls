/* global wp, _, kirki */
kirki.control.checkbox = {
	init: function( control ) {
		control.container.html( kirki.control.checkbox.template( control ) );

		// Save the value
		kirki.control.container( control ).on( 'change', 'input', function() {
			var checkboxValue = ( jQuery( this ).is( ':checked' ) ) ? true : false;
			kirki.setSettingValue( this, checkboxValue );
		});
	},

	/**
	 * The HTML Template for 'checkbox' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html    = '';

		html += '<label>';
			html += '<input type="checkbox" ' + control.params.inputAttrs + 'value="' + control.params.value + '" ' + control.params.link + ( true === control.params.value ? ' checked' : '' ) + '/>';
			html += control.params.label;
			if ( control.params.description ) {
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			}
		html += '</label>';
		return '<div class="kirki-control-wrapper-checkbox kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'checkbox' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			wp.customize.instance( control.id ).set( value );
		}
	}
};

wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend({});

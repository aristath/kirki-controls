/* global kirki */

kirki.control['radio-buttonset'] = {
	init: function( control ) {
	},

	/**
	 * The HTML Template for 'radio-buttonset' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += kirki.control.template.header( control );
		html += '<div id="input_' + control.id + '" class="buttonset">';
			_.each( control.params.choices, function( value, key ) {
				html += '<input ' + control.params.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( key === control.params.value ? ' checked="checked"' : '' ) + '>';
					html += '<label class="switch-label switch-label-' + ( key === control.params.value ? 'on' : 'off' ) + '" for="' + control.id + key + '">' + value + '</label>';
				html += '</input>';
			} );
		html += '</div>';

		return '<div class="kirki-control-wrapper-radio-buttonset kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'radio-buttonset' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( kirki.util.controlContainer( control ).find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		}
	}
};

wp.customize.controlConstructor['kirki-radio-buttonset'] = wp.customize.kirkiDynamicControl.extend({});

/* global kirki */
kirki.control.palette = {
	init: function( control ) {
	},

	/**
	 * The HTML Template for 'palette' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		if ( ! control.params.choices ) {
			return;
		}
		html += kirki.control.template.header( control );
		html += '<div id="input_' + control.params.id + '" class="buttonset">';
		_.each( control.params.choices, function( colors, key ) {
			html += '<input ' + control.params.inputAttrs + ' type="radio" value="' + key + '" name="_customize-palette-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === key ? ' checked' : '' ) + '>';
				html += '<label for="' + control.id + key + '">';
					_.each( colors, function( color ) {
						html += '<span style="background:' + color + '">' + color + '</span>';
					} );
				html += '</label>';
			html += '</input>';
		} );
		html += '</div>';

		return '<div class="kirki-control-wrapper-palette kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';

	},

	value: {
		/**
		 * Changes the value visually for 'palette' controls.
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

wp.customize.controlConstructor['kirki-palette'] = wp.customize.kirkiDynamicControl.extend({});

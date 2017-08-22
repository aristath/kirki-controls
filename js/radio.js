/* global kirki */

kirki.control.radio = {
	/**
	 * The HTML Template for 'radio' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		if ( ! control.params.choices ) {
			return;
		}

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		_.each( control.params.choices, function( value, key ) {
			html += '<label>';
				html += '<input ' + control.params.inputAttrs + ' type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" ' + control.params.link + ( control.params.value === key ? ' checked' : '' ) + '/>';
				if ( _.isArray( value ) ) {
					html += value[0] + '<span class="option-description">' + value[1] + '</span>';
				} else {
					html += value;
				}
			html += '</label>';
		} );

		return '<div class="kirki-control-wrapper-radio">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'radio' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		}
	}
};

wp.customize.controlConstructor['kirki-radio'] = wp.customize.kirkiDynamicControl.extend({});

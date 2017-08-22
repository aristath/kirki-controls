/* global kirki */

kirki.control['radio-image'] = {
	/**
	 * The HTML Template for 'radio-image' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label class="customizer-text">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '</label>';
		html += '<div id="input_' + control.id + '" class="image">';
			_.each( control.params.choices, function( value, key ) {
				var dataAlt = ( _.isObject( value ) && ! _.isUndefined( value.alt ) ) ? value.alt : '';
				html += '<input ' + control.params.inputAttrs + ' class="image-select" type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === key ? ' checked="checked"' : '' ) + ' data-alt="' + dataAlt + '">';
					html += '<label for="' + control.id + key + '" ' + control.params.labelStyle + ' class="' + control.id + key + '">';
						if ( _.isObject( value ) ) {
							html += '<img src="' + value.src + '" alt="' + value.alt + '">';
							html += '<span class="image-label"><span class="inner">' + value.alt + '</span></span>';
						} else {
							html += '<img src="' + value + '">';
						}
						html += '<span class="image-clickable"></span>';
					html += '</label>';
				html += '</input>';
			} );
		html += '</div>';

		return '<div class="kirki-control-wrapper-radio-image">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'radio-image' controls.
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

wp.customize.controlConstructor['kirki-radio-image'] = wp.customize.kirkiDynamicControl.extend({});

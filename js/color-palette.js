/* global wp, _, kirki */
kirki.control['color-palette'] = {

	/**
	 * The HTML Template for 'color-palette' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html    = '',
			inputWrapperClasses;

		if ( ! control.params.choices ) {
			return;
		}
		control.params.choices = _.defaults( control.params.choices, {
			style: 'square',
			'box-shadow': '',
			margin: false
		});

		inputWrapperClasses  = 'colors-wrapper ' + control.params.choices.style + ( ( true === control.params.choices['box-shadow'] ) ? ' box-shadow' : '' ) + ( inputWrapperClasses += ( true === control.params.choices.margin ) ? ' with-margin' : '' );

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div id="input_' + control.id + '" class="' + inputWrapperClasses + '">';
		_.each( control.params.choices.colors, function( val, key ) {
			html += '<input type="radio" ' + control.params.inputAttrs + ' value="' + val + '" name="_customize-color-palette-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === val ? ' checked' : '' ) + '>';
				html += '<label for="' + control.id + key + '" style="width:' + control.params.choices.size + 'px; height:' + control.params.choices.size + 'px;">';
					html += '<span class="color-palette-color" style="background:' + val + ';">' + val + '</span>';
				html += '</label>';
			html += '</input>';
		} );
		html += '</div>';

		return '<div class="kirki-control-wrapper-color-palette">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'color-palette' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		}
	}
};

wp.customize.controlConstructor['kirki-color-palette'] = wp.customize.kirkiDynamicControl.extend({});

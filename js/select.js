/* global wp, _, kirki */

kirki.control.select = {

	/**
	 * The HTML Template for 'select' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<select ' + control.params.inputAttrs + ' ' + control.params.link + ( 1 < control.params.multiple ? ' data-multiple="' + control.params.multiple + '" multiple="multiple"' : '' ) + '>';

				_.each( control.params.choices, function( optionLabel, optionKey ) {
					var selected = ( control.params.value === optionKey );
					if ( 1 < control.params.multiple && control.params.value ) {
						selected = _.contains( control.params.value, optionKey );
					}
					if ( _.isObject( optionLabel ) ) {
						html += '<optgroup label="' + optionLabel[0] + '">';
						_.each( optionLabel[1], function( optgroupOptionLabel, optgroupOptionKey ) {
							selected = ( control.params.value === optgroupOptionKey );
							if ( 1 < control.params.multiple && control.params.value ) {
								selected = _.contains( control.params.value, optgroupOptionKey );
							}
							html += '<option value="' + optgroupOptionKey + '"' + ( selected ? ' selected' : '' ) + '>' + optgroupOptionLabel + '</option>';
						} );
						html += '</optgroup>';
					} else {
						html += '<option value="' + optionKey + '"' + ( selected ? ' selected' : '' ) + '>' + optionLabel + '</option>';
					}
				} );
			html += '</select>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-select">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'select' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			control.setSelect2( control.container.find( 'select' ), value );
		}
	}
};

wp.customize.controlConstructor['kirki-select'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control  = this,
		    element,
		    multiple,
		    selectValue,
		    select2Options = {
				escapeMarkup: function( markup ) {
					return markup;
				}
		    };

		if ( ! control.params.choices ) {
			return;
		}
		if ( 1 < control.params.multiple && control.params.value && _.isString( control.params.value ) ) {
			control.params.value = [ control.params.value ];
		}

		control.container.html( kirki.control.select.template( control ) );

		element  = control.container.find( 'select' );
		multiple = parseInt( element.data( 'multiple' ), 10 );

		if ( 1 < multiple ) {
			select2Options.maximumSelectionLength = multiple;
		}
		jQuery( element ).select2( select2Options ).on( 'change', function() {
			selectValue = jQuery( this ).val();
			control.setting.set( selectValue );
		} );
	}
} );

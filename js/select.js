/* global wp, _, kirki */

kirki.control.select = {
	init: function( control ) {
		var element,
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

		element  = kirki.util.controlContainer( control ).find( 'select' );
		multiple = parseInt( element.data( 'multiple' ), 10 );

		if ( 1 < multiple ) {
			select2Options.maximumSelectionLength = multiple;
		}
		jQuery( element ).select2( select2Options ).on( 'change', function() {
			selectValue = jQuery( this ).val();
			control.setting.set( selectValue );
		} );
	},

	/**
	 * The HTML Template for 'select' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += kirki.control.template.header( control );
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

		return '<div class="kirki-control-wrapper-select kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
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
			control.setSelect2( kirki.util.controlContainer( control ).find( 'select' ), value );
		}
	}
};

wp.customize.controlConstructor['kirki-select'] = wp.customize.kirkiDynamicControl.extend();

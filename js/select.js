/* global wp, _, kirki */
kirki.util.select = {

	/**
	 * Gets the HTML for a dropdown.
	 *
	 * @since 3.1.0
	 * @param {object} [params] Parameters. See _.defaults() call inside the function for a format example.
	 * @returns string
	 */
	getHTML: function( params ) {
		var html = '';

		params = _.defaults( params, {
			id: '',
			choices: {},
			'default': '',
			multiple: 0,
			value: '',
			inputAttrs: ''
		});

		// Make sure multiple argument is an integer.
		params.multiple = parseInt( params.multiple, 10 );
		params.multiple = ( 1 < params.multiple ) ? params.multiple : 0;

		// Wrapper.
		html += '<div class="kirki select" data-id="' + params.id + '" data-multiple="' + params.multiple + '" data-default="' + params['default'] + '">';

			// The select.
			html += '<select ' + params.inputAttrs + ( 1 < params.multiple ? ' data-multiple="' + params.multiple + '" multiple="multiple"' : '' ) + '>';
				_.each( params.choices, function( optionLabel, optionKey ) {

					// Is this option selected?
					var selected = ( params.value === optionKey );
					if ( 1 < params.multiple && params.value ) {
						selected = _.contains( params.value, optionKey );
					}

					// If instead of a label (string) we have an object,
					// then treat this as an optgroup element.
					if ( _.isObject( optionLabel ) ) {
						html += '<optgroup label="' + optionLabel[0] + '">';
						_.each( optionLabel[1], function( optgroupOptionLabel, optgroupOptionKey ) {

							// Is this option selected? (re-loop because of optgroup).
							selected = ( params.value === optgroupOptionKey );
							if ( 1 < params.multiple && params.value ) {
								selected = _.contains( params.value, optgroupOptionKey );
							}

							// Add option in optgroup.
							html += '<option value="' + optgroupOptionKey + '"' + ( selected ? ' selected' : '' ) + '>' + optgroupOptionLabel + '</option>';
						} );
						html += '</optgroup>';
					} else {

						// Add hte option.
						html += '<option value="' + optionKey + '"' + ( selected ? ' selected' : '' ) + '>' + optionLabel + '</option>';
					}
				} );
			html += '</select>';
		html += '</div>';

		return html;
	},

	/**
	 * Gets the HTML for a dropdown.
	 *
	 * @since 3.1.0
	 * @param {object} [params] Parameters. See _.defaults() call inside the function for a format example.
	 * @returns string
	 */
	init: function( params ) {
		params = _.defaults( params, {
			id: '',
			choices: {},
			'default': '',
			multiple: 0,
			value: '',
			inputAttrs: ''
		});

		// Make sure multiple argument is an integer.
		params.multiple = parseInt( params.multiple, 10 );
		params.multiple = ( 1 < params.multiple ) ? params.multiple : 0;

		// Init select2 for this element.
		jQuery( '.kirki.select[data-id=' + params.id + '] select' ).select2({
			escapeMarkup: function( markup ) {
				return markup;
			},
			maximumSelectionLength: params.multiple
		}).on( 'change', function() {
			kirki.util.select.saveValue( this, jQuery( this ).val() );
		});
	},

	/**
	 * This is a helper function.
	 * Since other controls may extend this object, using this helper allows us
	 * to override the save function depending on the needs of other control-types.
	 *
	 * @since 3.1.0
	 * @param {string}                     [element] The DOM element whose value has changed.
	 *                                               We'll use this to find the setting from its wrapper parent.
	 * @param {(string|array|bool|object)} [value]   Depends on the control-type.
	 * @param {string}                     [key]     If we only want to save an item in an object
	 *                                               we can define the key here.
	 * @returns {void}
	 */
	saveValue: function( element, value, key ) {
		kirki.setSettingValue( element, value, key );
	}
};

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

		// Add the template.
		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.select.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );

		// Init.
		kirki.util.select.init({
			id: control.id,
			choices: control.params.choices,
			'default': control.params['default'],
			multiple: control.params.multiple,
			value: control.params.value,
			inputAttrs: control.params.inputAttrs
		});
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
			html += kirki.util.select.getHTML({
				id: control.id,
				choices: control.params.choices,
				'default': control.params['default'],
				multiple: control.params.multiple,
				value: control.params.value,
				inputAttrs: control.params.inputAttrs
			});
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

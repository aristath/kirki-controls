/* global wp, _, kirki */

kirki.control.slider = {
	init: function( control ) {
		var value,
		    thisInput,
		    inputDefault,
		    changeAction;

		control.container.html( kirki.control.slider.template( control ) );

		// Update the text value
		jQuery( 'input[type=range]' ).on( 'mousedown', function() {
			value = jQuery( this ).attr( 'value' );
			jQuery( this ).mousemove( function() {
				value = jQuery( this ).attr( 'value' );
				jQuery( this ).closest( 'label' ).find( '.kirki_range_value .value' ).text( value );
			} );
		} );

		// Handle the reset button
		jQuery( '.kirki-slider-reset' ).click( function() {
			thisInput    = jQuery( this ).closest( 'label' ).find( 'input' );
			inputDefault = thisInput.data( 'reset_value' );
			thisInput.val( inputDefault );
			thisInput.change();
			jQuery( this ).closest( 'label' ).find( '.kirki_range_value .value' ).text( inputDefault );
		} );

		changeAction = ( 'postMessage' === control.setting.transport ) ? 'mousemove change' : 'change';

		// Save changes.
		kirki.control.container( control ).on( changeAction, 'input', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	},

	/**
	 * The HTML Template for 'slider' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += kirki.control.template.header( control );
			html += '<div class="wrapper">';
				html += '<input ' + control.params.inputAttrs + ' type="range" min="' + control.params.choices.min + '" max="' + control.params.choices.max + '" step="' + control.params.choices.step + '" value="' + control.params.value + '" ' + control.params.link + ' data-reset_value="' + control.params['default'] + '" />';
				html += '<div class="kirki_range_value">';
					html += '<span class="value">' + control.params.value + '</span>';
					html += control.params.choices.suffix ? control.params.choices.suffix : '';
				html += '</div>';
				html += '<div class="kirki-slider-reset"><span class="dashicons dashicons-image-rotate"></span></div>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-slider kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'slider' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {float}  [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( kirki.control.container( control ).find( 'input' ) ).prop( 'value', value );
			jQuery( kirki.control.container( control ).find( '.kirki_range_value .value' ) ).html( value );
		}
	}
};

wp.customize.controlConstructor['kirki-slider'] = wp.customize.kirkiDynamicControl.extend();

wp.customize.controlConstructor['kirki-slider'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {
		var control = this,
		    value,
		    thisInput,
		    inputDefault,
		    changeAction;

		control.addHTML();

		// Update the text value
		jQuery( 'input[type=range]' ).on( 'mousedown', function() {
			value = jQuery( this ).attr( 'value' );
			jQuery( this ).mousemove( function() {
				value = jQuery( this ).attr( 'value' );
				jQuery( this ).closest( 'label' ).find( '.kirki_range_value .value' ).text( value );
			});
		});

		// Handle the reset button
		jQuery( '.kirki-slider-reset' ).click( function() {
			thisInput    = jQuery( this ).closest( 'label' ).find( 'input' );
			inputDefault = thisInput.data( 'reset_value' );
			thisInput.val( inputDefault );
			thisInput.change();
			jQuery( this ).closest( 'label' ).find( '.kirki_range_value .value' ).text( inputDefault );
		});

		changeAction = ( 'postMessage' === control.setting.transport ) ? 'mousemove change' : 'change';

		// Save changes.
		control.container.on( changeAction, 'input', function() {
			control.setting.set( jQuery( this ).val() );
		});
	},

	addHTML: function() {
		var control = this,
		    html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="wrapper">';
				html += '<input ' + control.params.inputAttrs + ' type="range" min="' + control.params.choices.min + '" max="' + control.params.choices.max + '" step="' + control.params.choices.step + '" value="' + control.params.value + '" ' + control.params.link + ' data-reset_value="' + control.params['default'] + '" />';
				html += '<div class="kirki_range_value">';
					html += '<span class="value">' + control.params.value + '</span>';
					html += control.params.choices.suffix ? control.params.choices.suffix : '';
				html += '</div>';
				html += '<div class="kirki-slider-reset"><span class="dashicons dashicons-image-rotate"></span></div>';
			html += '</div>';
		html += '</label>';

		control.container.html( html );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input' ) ).prop( 'value', value );
		jQuery( control.container.find( '.kirki_range_value .value' ) ).html( value );
	}
});

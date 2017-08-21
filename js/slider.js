/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-slider'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {
		var control = this,
		    value,
		    thisInput,
		    inputDefault,
		    changeAction;

		control.container.html( kirkiControlsHTML.sliderTemplate( control ) );

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
		control.container.on( changeAction, 'input', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input' ) ).prop( 'value', value );
		jQuery( control.container.find( '.kirki_range_value .value' ) ).html( value );
	}
} );

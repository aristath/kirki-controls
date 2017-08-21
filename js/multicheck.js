/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-multicheck'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this;

		control.container.html( kirkiControlsHTML.multicheckTemplate( control ) );

		// Save the value
		control.container.on( 'change', 'input', function() {
			var value = [],
			    i = 0;

			// Build the value as an object using the sub-values from individual checkboxes.
			jQuery.each( control.params.choices, function( key ) {
				if ( control.container.find( 'input[value="' + key + '"]' ).is( ':checked' ) ) {
					value[ i ] = key;
					i++;
				}
			} );

			// Update the value in the customizer.
			control.setting.set( value );
		} );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		control.container.find( 'input' ).each( function() {
			jQuery( this ).prop( 'checked', false );
		} );
		_.each( value, function( subValue, i ) {
			jQuery( control.container.find( 'input[value="' + value[ i ] + '"]' ) ).prop( 'checked', true );
		} );
	}
} );

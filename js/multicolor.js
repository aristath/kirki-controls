/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-multicolor'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {
		var control = this,
		    colors  = control.params.choices,
		    keys    = Object.keys( colors ),
		    value   = this.params.value,
			i       = 0,
		    target,
		    irisInput,
		    irisPicker;

		control.container.html( kirki.template.multicolorControl( control ) );
  		target = control.container.find( '.iris-target' );

		// Colors loop
		while ( i < Object.keys( colors ).length ) {

			control.kirkiMulticolorChangeHandler( this, value, keys[ i ] );

			// Move colorpicker to the 'iris-target' container div
			irisInput  = control.container.find( '.wp-picker-container .wp-picker-input-wrap' ),
			irisPicker = control.container.find( '.wp-picker-container .wp-picker-holder' );
			jQuery( irisInput[0] ).detach().appendTo( target[0] );
			jQuery( irisPicker[0] ).detach().appendTo( target[0] );

			i++;
		}
	},

	// Proxy function that handles changing the individual colors
	kirkiMulticolorChangeHandler: function( control, value, subSetting ) {

		var colors  = control.params.choices,
		    target = control.container.find( '.iris-target' ),
		    picker = control.container.find( '.multicolor-index-' + subSetting ),
		    args   = {
				target: target[0],
				change: function() {
					setTimeout( function() {

						// Set the value.
						control.kirkiSetValue( picker.val(), subSetting );

						// Trigger the change.
						control.container.find( '.multicolor-index-' + subSetting ).trigger( 'change' );
					}, 100 );
				}
			};

		if ( _.isObject( colors.irisArgs ) ) {
			_.each( colors.irisArgs, function( irisValue, irisKey ) {
				args[ irisKey ] = irisValue;
			} );
		}

		// Did we change the value?
		picker.wpColorPicker( args );
	}
} );

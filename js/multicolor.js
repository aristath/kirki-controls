/* global wp, _ */
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

		control.addHTML();
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
	},

	addHTML: function() {
		var control = this,
		    html    = '';

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div class="multicolor-group-wrapper">';
			_.each( control.params.choices, function( val, key ) {
				if ( 'irisArgs' !== key ) {
					html += '<div class="multicolor-single-color-wrapper">';
						html += ( val ) ? '<label for="' + control.id + '-' + key + '">' + val + '</label>' : '';
						html += '<input ' + control.params.inputAttrs + ' id="' + control.id + '-' + key + '" type="text" data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'][ key ] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value[ key ] + '" class="kirki-color-control color-picker multicolor-index-' + key + '" />';
					html += '</div>';
				}
			} );
		html += '</div>';
		html += '<div class="iris-target"></div>';

		control.container.html( html );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		_.each( value, function( subVal, index ) {
			control.setColorPicker( control.container.find( '.multicolor-index-' + index ), subVal );
		} );
	}
} );

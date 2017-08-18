wp.customize.controlConstructor['kirki-multicolor'] = wp.customize.Control.extend({

	// When we're finished loading continue processing
	ready: function() {
		var control = this;

		control.addHTML();

		control.initKirkiControl();
	},

	initKirkiControl: function() {
		var control = this,
		    colors  = control.params.choices,
		    keys    = Object.keys( colors ),
		    value   = this.params.value,
		    target  = control.container.find( '.iris-target' ),
		    i       = 0,
		    irisInput,
		    irisPicker;

		// Proxy function that handles changing the individual colors
		function kirkiMulticolorChangeHandler( control, value, subSetting ) {

			var picker = control.container.find( '.multicolor-index-' + subSetting ),
			    args   = {
					target: target[0],
					change: function() {

						// Color controls require a small delay.
						setTimeout( function() {

							// Set the value.
							control.saveValue( subSetting, picker.val() );

							// Trigger the change.
							control.container.find( '.multicolor-index-' + subSetting ).trigger( 'change' );
						}, 100 );
					}
			    };

			if ( _.isObject( colors.irisArgs ) ) {
				_.each( colors.irisArgs, function( irisValue, irisKey ) {
					args[ irisKey ] = irisValue;
				});
			}

			// Did we change the value?
			picker.wpColorPicker( args );
		}

		// Colors loop
		while ( i < Object.keys( colors ).length ) {

			kirkiMulticolorChangeHandler( this, value, keys[ i ] );

			// Move colorpicker to the 'iris-target' container div
			irisInput  = control.container.find( '.wp-picker-container .wp-picker-input-wrap' ),
			irisPicker = control.container.find( '.wp-picker-container .wp-picker-holder' );
			jQuery( irisInput[0] ).detach().appendTo( target[0] );
			jQuery( irisPicker[0] ).detach().appendTo( target[0] );

			i++;
		}
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
			});
		html += '</div>';
		html += '<div class="iris-target"></div>';
		html += '<input class="multicolor-hidden-value" type="hidden" value=\'' + JSON.stringify( control.params.value ) + '\' ' + control.params.link + '>';

		control.container.html( html );
	},

	/**
	 * Saves the value.
	 */
	saveValue: function( property, value ) {

		'use strict';

		var control   = this,
		    input     = control.container.find( '.multicolor-hidden-value' ),
		    valueJSON = jQuery( input ).val(),
		    valueObj  = JSON.parse( valueJSON );

		valueObj[ property ] = value;
		jQuery( input ).attr( 'value', JSON.stringify( valueObj ) ).trigger( 'change' );
		control.setting.set( valueObj );
	}
});

/* global wp, _, kirki */
kirki.control.multicolor = {
	init: function( control ) {
		var colors  = control.params.choices,
		    keys    = Object.keys( colors ),
		    value   = this.params.value,
			i       = 0,
		    target,
		    irisInput,
		    irisPicker;

		control.container.html( kirki.control.multicolor.template( control ) );
		target = kirki.control.container( control ).find( '.iris-target' );

		// Colors loop.
		while ( i < Object.keys( colors ).length ) {

			kirki.control.multicolor.util.changeHandler( control, value, keys[ i ] );

			// Move colorpicker to the 'iris-target' container div
			irisInput  = kirki.control.container( control ).find( '.wp-picker-container .wp-picker-input-wrap' );
			irisPicker = kirki.control.container( control ).find( '.wp-picker-container .wp-picker-holder' );
			jQuery( irisInput[0] ).detach().appendTo( target[0] );
			jQuery( irisPicker[0] ).detach().appendTo( target[0] );

			i++;
		}
	},

	/**
	 * The HTML Template for 'multicolor' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

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

		return '<div class="kirki-control-wrapper-multicolor kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'multicolor' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( value ) {
			var control = this;
			_.each( value, function( subVal, index ) {
				control.setColorPicker( kirki.control.container( control ).find( '.multicolor-index-' + index ), subVal );
			} );
		}
	},

	util: {
		changeHandler: function( control, value, subSetting ) {
			var colors  = control.params.choices,
				target = kirki.control.container( control ).find( '.iris-target' ),
				picker = kirki.control.container( control ).find( '.multicolor-index-' + subSetting ),
				args   = {
					target: target[0],
					change: function() {
						setTimeout( function() {

							// Set the value.
							control.kirkiSetValue( picker.val(), subSetting );

							// Trigger the change.
							kirki.control.container( control ).find( '.multicolor-index-' + subSetting ).trigger( 'change' );
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
	}
};

wp.customize.controlConstructor['kirki-multicolor'] = wp.customize.kirkiDynamicControl.extend();

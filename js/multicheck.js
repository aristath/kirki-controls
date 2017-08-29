/* global wp, _, kirki */
kirki.control.multicheck = {
	init: function( control ) {
		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.multicheck.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );

		// Save the value
		kirki.util.controlContainer( control ).on( 'change', 'input', function() {
			var value = [],
				i = 0;

			// Build the value as an object using the sub-values from individual checkboxes.
			jQuery.each( control.params.choices, function( key ) {
				if ( kirki.util.controlContainer( control ).find( 'input[value="' + key + '"]' ).is( ':checked' ) ) {
					value[ i ] = key;
					i++;
				}
			} );

			// Update the value in the customizer.
			control.setting.set( value );
		} );
	},

	/**
	 * The HTML Template for 'multicheck' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';
		if ( ! control.params.choices ) {
			return;
		}
		html += kirki.control.template.header( control );
		html += '<ul>';
			_.each( control.params.choices, function( val, key ) {
				html += '<li><label><input ' + control.params.inputAttrs + ' type="checkbox" value="' + key + '"' + ( _.contains( control.params.value, key ) ? ' checked' : '' ) + '/>' + val + '</label></li>';
			} );
		html += '</ul>';
		return '<div class="kirki-control-wrapper-multicheck kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'multicheck' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			kirki.util.controlContainer( control ).find( 'input' ).each( function() {
				jQuery( this ).prop( 'checked', false );
			} );
			_.each( value, function( subValue, i ) {
				jQuery( kirki.util.controlContainer( control ).find( 'input[value="' + value[ i ] + '"]' ) ).prop( 'checked', true );
			} );
		}
	}
};

wp.customize.controlConstructor['kirki-multicheck'] = wp.customize.kirkiDynamicControl.extend();

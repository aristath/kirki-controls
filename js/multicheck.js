/* global wp, _, kirki */

kirki.control.type.multicheck = kirki.control.type['kirki-multicheck'] = 'multicheckControl';

/**
 * The HTML Template for 'multicheck' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.multicheckControl = function( control ) {
	var html = '';
	if ( ! control.params.choices ) {
		return;
	}
	html += '<span class="customize-control-title">' + control.params.label + '</span>';
	html += '<span class="description customize-control-description">' + control.params.description + '</span>';
	html += '<ul>';
		_.each( control.params.choices, function( val, key ) {
			html += '<li><label><input ' + control.params.inputAttrs + ' type="checkbox" value="' + key + '"' + ( _.contains( control.params.value, key ) ? ' checked' : '' ) + '/>' + val + '</label></li>';
		} );
	html += '</ul>';
	return '<div class="kirki-control-wrapper-multicheck">' + html + '</div>';
};

/**
 * Changes the value visually for 'multicheck' controls.
 *
 * @param {object} [control] The control.
 * @param {object} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.multicheckControl = function( control, value ) {
	control.container.find( 'input' ).each( function() {
		jQuery( this ).prop( 'checked', false );
	} );
	_.each( value, function( subValue, i ) {
		jQuery( control.container.find( 'input[value="' + value[ i ] + '"]' ) ).prop( 'checked', true );
	} );
};

wp.customize.controlConstructor['kirki-multicheck'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this;

		control.container.html( kirki.control.template.multicheckControl( control ) );

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
	}
} );

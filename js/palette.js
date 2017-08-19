/* global wp, _ */
wp.customize.controlConstructor['kirki-palette'] = wp.customize.kirkiDynamicControl.extend( {

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
} );

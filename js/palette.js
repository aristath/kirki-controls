/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-palette'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirkiControlsHTML.paletteTemplate( control );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
} );

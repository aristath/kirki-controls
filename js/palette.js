/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-palette'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirki.template.paletteControl( control );
	},

	kirkiSetControlValue: function( value ) {
		kirki.setControlValue.paletteControl( this, value );
	}
} );

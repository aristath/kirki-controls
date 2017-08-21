/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-radio-image'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirki.template.radioImageControl( control );
	},

	kirkiSetControlValue: function( value ) {
		kirki.setControlValue.radioImageControl( this, value );
	}
} );

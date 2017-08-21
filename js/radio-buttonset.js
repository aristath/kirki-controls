/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-radio-buttonset'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirki.template.radioButtonsetControl( control );
	},

	kirkiSetControlValue: function( value ) {
		kirki.setControlValue.radioButtonsetControl( this, value );
	}
} );

/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-dashicons'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirki.template.dashiconsControl( control );
	},

	kirkiSetControlValue: function( value ) {
		kirki.setControlValue.dashiconsControl( this, value );
	}
} );

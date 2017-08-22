/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend( {

	kirkiSetValue: function( value ) {
		kirki.setValue.checkboxControl( this, value );
	}
} );

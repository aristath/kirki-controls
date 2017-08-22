/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend( {
	kirkiSetValue: function( value ) {
		kirki.setValue.checkboxControl( this, value );
	}
} );

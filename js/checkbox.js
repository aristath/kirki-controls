/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend( {

	kirkiSetValue: function( value ) {
		kirki.value.set.checkboxControl( this, value );
	}
} );

/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend( {
	kirkiSetValue: function( value ) {
		kirki.value.set.checkboxControl( this, value );
	}
} );

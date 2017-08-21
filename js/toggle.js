/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend( {
	kirkiSetValue: function( value ) {
		var control = this;
		value = ( 1 === value || '1' === value || true === value ) ? true : false;
		wp.customize.instance( control.id ).set( value );
	}
} );

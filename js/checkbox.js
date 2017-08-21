/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirkiControlsHTML.checkboxTemplate( control );
	},

	kirkiSetValue: function( value ) {
		var control = this;
		value = ( 1 === value || '1' === value || true === value ) ? true : false;
		wp.customize.instance( control.id ).set( value );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		value = ( 1 === value || '1' === value || true === value ) ? true : false;
		jQuery( control.container.find( 'input' ) ).prop( 'checked', value );
	}
} );

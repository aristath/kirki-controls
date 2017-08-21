/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-dashicons'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirkiControlsHTML.dashiconsTemplate( control );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
} );

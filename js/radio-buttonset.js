/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-radio-buttonset'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirkiControlsHTML.radioButtonsetTemplate( control );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
} );

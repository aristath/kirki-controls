wp.customize.controlConstructor['kirki-palette'] = wp.customize.kirkiDynamicControl.extend({

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.findElement( control.id, 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
});

/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-generic'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
			element = control.params.choices.element ? control.params.choices.element : 'input';

		control.container.html( kirki.template.genericControl( control ) );

		// Save the value
		this.container.on( 'change keyup paste click', element, function() {
			control.setting.set( jQuery( this ).val() );
		} );
	}
} );

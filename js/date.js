/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-date'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control  = this,
		    selector = control.selector + ' input.datepicker';

		control.container.html( kirki.template.dateControl( control ) );

		// Init the datepicker
		jQuery( selector ).datepicker();

		// Save the changes
		this.container.on( 'change keyup paste', 'input.datepicker', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	}
} );

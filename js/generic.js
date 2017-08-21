/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-generic'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
			element = control.params.choices.element ? control.params.choices.element : 'input';

		control.container.html( kirkiControlsHTML.genericTemplate( control ) );

		// Save the value
		this.container.on( 'change keyup paste click', element, function() {
			control.setting.set( jQuery( this ).val() );
		} );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;

		if ( _.isUndefined( control.params.choices ) ) {
			control.params.choices = {};
		}
		control.params.choices = _.defaults( control.params.choices, {
			element: 'input'
		} );

		if ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.element ) ) {
			control.params.choices.element = 'input';
		}

		if ( 'textarea' === control.params.choices.element ) {
			control.container.find( 'textarea' ).html( value );
		}
		jQuery( control.container.find( control.params.choices.element ) ).prop( 'value', value );
		jQuery( control.container.find( control.params.choices.element ) ).val( value );
	}
} );

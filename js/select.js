/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-select'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control  = this,
		    element,
		    multiple,
		    selectValue,
		    select2Options = {
				escapeMarkup: function( markup ) {
					return markup;
				}
		    };

		if ( ! control.params.choices ) {
			return;
		}
		if ( 1 < control.params.multiple && control.params.value && _.isString( control.params.value ) ) {
			control.params.value = [ control.params.value ];
		}

		control.container.html( kirki.template.selectControl( control ) );

		element  = this.container.find( 'select' );
		multiple = parseInt( element.data( 'multiple' ), 10 );

		if ( 1 < multiple ) {
			select2Options.maximumSelectionLength = multiple;
		}
		jQuery( element ).select2( select2Options ).on( 'change', function() {
			selectValue = jQuery( this ).val();
			control.setting.set( selectValue );
		} );
	}
} );

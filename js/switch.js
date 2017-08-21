/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-switch'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {
		var control       = this,
		    checkboxValue = control.setting._value,
		    html          = '',
		    on,
		    off;

		control.container.html( kirkiControlsHTML.switchTemplate( control ) );

		on  = jQuery( control.container.find( '.switch-on' ) );
		off = jQuery( control.container.find( '.switch-off' ) );

		// CSS modifications depending on label sizes.
		jQuery( control.container.find( '.switch label ' ) ).css( 'width', ( on.width() + off.width() + 40 ) + 'px' );
		jQuery( '#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) ).append(
			'<style>#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch label:after{width:' + ( on.width() + 13 ) + 'px;}#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch input:checked + label:after{left:' + ( on.width() + 22 ) + 'px;width:' + ( off.width() + 13 ) + 'px;}</style>'
		);

		// Save the value
		this.container.on( 'change', 'input', function() {
			checkboxValue = ( jQuery( this ).is( ':checked' ) ) ? true : false;
			control.setting.set( checkboxValue );
		} );
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

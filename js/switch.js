wp.customize.controlConstructor['kirki-switch'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {
		var control       = this,
		    checkboxValue = control.setting._value,
		    html          = '',
		    on,
		    off;

		control.addHTML();

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
		});
	},

	addHTML: function() {
		var control = this,
		    html = '';

		html += '<div class="switch' + ( ( control.params.choices.round ) ? ' round' : '' ) + '">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="switch_' + control.id + '" id="switch_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + '/>';
			html += '<label class="switch-label" for="switch_' + control.id + '">';
				html += '<span class="switch-on">' + control.params.choices.on + '</span>';
				html += '<span class="switch-off">' + control.params.choices.off + '</span>';
			html += '</label>';
		html += '</div>';

		control.container.html( html );
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
});

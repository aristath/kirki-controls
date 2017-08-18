wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend({

	addHTML: function() {

		var control = this,
		    html = '';

		html += '<label for="toggle_' + control.id + '">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="toggle_' + control.id + '" id="toggle_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + ' hidden />';
			html += '<span class="switch"></span>';
		html += '</label>';

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
		jQuery( control.findElement( control.id, 'input' ) ).prop( 'checked', value );
	}
});

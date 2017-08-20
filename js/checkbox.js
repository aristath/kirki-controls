/* global wp, _ */
wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend( {

	addHTML: function() {

		var control = this,
		    html = '';

		html += '<label>';
			html += '<input type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( ( true === control.params.value || 'true' === control.params.value || 1 === control.params.value || '1' === control.params.value ) ? ' checked="checked"' : '' ) + '/>';
			html += control.params.label;
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
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
		jQuery( control.container.find( 'input' ) ).prop( 'checked', value );
	}
} );

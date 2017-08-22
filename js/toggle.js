/* global wp, _, kirki */

kirki.control.type.toggle = kirki.control.type['kirki-toggle'] = 'toggleControl';

/**
 * The HTML Template for 'toggle' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.toggleControl = function( control ) {

	var html = '';

	html += '<label for="toggle_' + control.id + '">';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="toggle_' + control.id + '" id="toggle_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + ' hidden />';
		html += '<span class="switch"></span>';
	html += '</label>';

	return '<div class="kirki-control-wrapper-toggle">' + html + '</div>';
};

/**
 * Changes the value visually for 'toggle' controls.
 *
 * @param {object} [control] The control.
 * @param {bool}   [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.toggleControl = function( control, value ) {
	value = ( 1 === value || '1' === value || true === value ) ? true : false;
	jQuery( control.container.find( 'input' ) ).prop( 'checked', value );
};

wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend( {
	kirkiSetValue: function( value ) {
		kirki.value.set.checkboxControl( this, value );
	}
} );

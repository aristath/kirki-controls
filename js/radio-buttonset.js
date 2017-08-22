/* global kirki */

kirki.control.type['radio-buttonset'] = kirki.control.type['kirki-radio-buttonset'] = 'radioButtonsetControl';

/**
 * The HTML Template for 'radio-buttonset' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.radioButtonsetControl = function( control ) {
	var html = '';

	html += '<span class="customize-control-title">' + control.params.label + '</span>';
	html += '<span class="description customize-control-description">' + control.params.description + '</span>';
	html += '<div id="input_' + control.id + '" class="buttonset">';
		_.each( control.params.choices, function( value, key ) {
			html += '<input ' + control.params.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( key === control.params.value ? ' checked="checked"' : '' ) + '>';
				html += '<label class="switch-label switch-label-' + ( key === control.params.value ? 'on' : 'off' ) + '" for="' + control.id + key + '">' + value + '</label>';
			html += '</input>';
		} );
	html += '</div>';

	return '<div class="kirki-control-wrapper-radio-buttonset">' + html + '</div>';
};

/**
 * Changes the value visually for 'radio-buttonset' controls.
 *
 * @param {object} [control] The control.
 * @param {string} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.radioButtonsetControl = function( control, value ) {
	jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
};

wp.customize.controlConstructor['kirki-radio-buttonset'] = wp.customize.kirkiDynamicControl.extend({});

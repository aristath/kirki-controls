/* global wp, _, kirki */

kirki.control.type.generic = kirki.control.type['kirki-generic'] = kirki.control.type.text = kirki.control.type['kirki-text'] = kirki.control.type.textarea = kirki.control.type['kirki-textarea'] = 'genericControl';

/**
 * The HTML Template for 'text', 'textarea', 'email' and other generic controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.genericControl = function( control ) {
	var element = control.params.choices.element ? control.params.choices.element : 'input',
		html    = '',
		extras  = '';

	html += '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div class="customize-control-content">';
			if ( 'textarea' === control.params.choices.element ) {
				_.each( control.params.choices, function( value, key ) {
					extras += ' ' + key + '="' + value + '"';
				} );
				html += '<textarea ' + control.params.inputAttrs + ' ' + control.params.link + extras + '>' + control.params.value + '</textarea>';
			} else {
				html += '<' + element + ' value="' + control.params.value + '" ' + control.params.link + control.params.inputAttrs + ' ';
				_.each( control.params.choices, function( value, key ) {
					html += key += '"' + value + '"';
				} );
				if ( control.params.choices.content ) {
					html += '>' + control.params.choices.content + '</' + element + '>';
				} else {
					html += '/>';
				}
			}
		html += '</div>';
	html += '</label>';

	return '<div class="kirki-control-wrapper-generic">' + html + '</div>';
};

/**
 * Changes the value visually for 'generic' controls.
 *
 * @param {object} [control] The control.
 * @param {string} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.genericControl = function( control, value ) {
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
};

wp.customize.controlConstructor['kirki-generic'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
			element = control.params.choices.element ? control.params.choices.element : 'input';

		control.container.html( kirki.control.template.genericControl( control ) );

		// Save the value
		this.container.on( 'change keyup paste click', element, function() {
			control.setting.set( jQuery( this ).val() );
		} );
	}
} );

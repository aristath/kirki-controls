/* global wp, _, kirki */

kirki.control.type.date = kirki.control.type['kirki-date'] = 'dateControl';

/**
 * The HTML Template for 'date' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.dateControl = function( control ) {
	var html = '';

	html += '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div class="customize-control-content">';
			html += '<input ' + control.params.inputAttrs + ' class="datepicker" type="text" id="' + control.params.id + '" value="' + control.params.value + '" ' + control.params.link + '/>';
		html += '</div>';
	html += '</label>';

	return '<div class="kirki-control-wrapper-date">' + html + '</div>';

};

/**
 * Changes the value visually for 'date' controls.
 *
 * @param {object} [control] The control.
 * @param {string} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.dateControl = function( control, value ) {
	/* TODO */
};

wp.customize.controlConstructor['kirki-date'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control  = this,
		    selector = control.selector + ' input.datepicker';

		control.container.html( kirki.control.template.dateControl( control ) );

		// Init the datepicker
		jQuery( selector ).datepicker();

		// Save the changes
		this.container.on( 'change keyup paste', 'input.datepicker', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	}
} );

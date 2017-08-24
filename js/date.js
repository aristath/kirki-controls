/* global wp, _, kirki */

kirki.control.date = {
	init: function( control ) {
		var selector = control.selector + ' input.datepicker';

		control.container.html( kirki.control.date.template( control ) );

		// Init the datepicker
		jQuery( selector ).datepicker();

		// Save the changes
		kirki.control.container( control ).on( 'change keyup paste', 'input.datepicker', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	},

	/**
	 * The HTML Template for 'date' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<input ' + control.params.inputAttrs + ' class="datepicker" type="text" id="' + control.params.id + '" value="' + control.params.value + '" ' + control.params.link + '/>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-date kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';

	},

	value: {
		/**
		 * Changes the value visually for 'date' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			/* TODO */
		}
	}
};

wp.customize.controlConstructor['kirki-date'] = wp.customize.kirkiDynamicControl.extend({});

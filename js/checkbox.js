/* global wp, _, kirki */
kirki.control.checkbox = {

	/**
	 * The HTML Template for 'checkbox' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html    = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="codemirror-kirki-wrapper">';
				html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-checkbox">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'checkbox' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			wp.customize.instance( control.id ).set( value );
		}
	}
};

wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend({});

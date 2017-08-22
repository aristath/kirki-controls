/* global wp, _, kirki */

kirki.control.type.color = kirki.control.type['kirki-color'] = 'colorControl';

/**
 * The HTML Template for 'color' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.colorControl = function( control ) {
	var html    = '';

	html  = '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<input type="text" ' + control.params.inputAttrs + ' data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value + '" class="kirki-color-control" ' + control.params.link + ' />';
	html += '</label>';

	return '<div class="kirki-control-wrapper-color">' + html + '</div>';

};

/**
 * Changes the value visually for 'color' controls.
 *
 * @param {object} [control] The control.
 * @param {string} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.colorControl = function( control, value ) {
	control.setColorPicker( control.container.find( '.kirki-color-control' ), value );
};

wp.customize.controlConstructor['kirki-color'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {
		var control = this,
		    clear,
		    picker;

		control.container.html( kirki.control.template.colorControl( control ) );

		picker = control.container.find( '.kirki-color-control' );

		// If we have defined any extra choices, make sure they are passed-on to Iris.
		if ( ! _.isUndefined( control.params.choices ) ) {
			picker.wpColorPicker( control.params.choices );
		}

		// Tweaks to make the "clear" buttons work.
		setTimeout( function() {
			clear = control.container.find( '.wp-picker-clear' );
			clear.click( function() {
				control.setting.set( '' );
			} );
		}, 200 );

		// Saves our settings to the WP API
		picker.wpColorPicker( {
			change: function() {

				// Small hack: the picker needs a small delay
				setTimeout( function() {
					control.setting.set( picker.val() );
				}, 20 );
			}
		} );
	}
} );

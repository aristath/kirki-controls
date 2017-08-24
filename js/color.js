/* global wp, _, kirki */
kirki.control.color = {

	init: function( control ) {
		var clear,
		    picker;

		control.container.html( kirki.control.color.template( control ) );

		picker = kirki.control.container( control ).find( '.kirki-color-control' );

		// If we have defined any extra choices, make sure they are passed-on to Iris.
		if ( ! _.isUndefined( control.params.choices ) ) {
			picker.wpColorPicker( control.params.choices );
		}

		// Tweaks to make the "clear" buttons work.
		setTimeout( function() {
			clear = kirki.control.container( control ).find( '.wp-picker-clear' );
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
	},

	/**
	 * The HTML Template for 'color' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html    = '';

		html  = '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input type="text" ' + control.params.inputAttrs + ' data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value + '" class="kirki-color-control" ' + control.params.link + ' />';
		html += '</label>';

		return '<div class="kirki-control-wrapper-color kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';

	},

	value: {
		/**
		 * Changes the value visually for 'color' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			control.setColorPicker( kirki.control.container( control ).find( '.kirki-color-control' ), value );
		}
	}
};

wp.customize.controlConstructor['kirki-color'] = wp.customize.kirkiDynamicControl.extend({});

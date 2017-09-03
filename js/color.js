/* global wp, _, kirki */
kirki.control.color = {

	init: function( args ) {
		var self = this,
		    clear,
		    picker;

		self.template( args );

		picker = jQuery( args.container ).find( '.kirki-color-control' );

		// If we have defined any extra choices, make sure they are passed-on to Iris.
		if ( ! _.isUndefined( args.choices ) ) {
			picker.wpColorPicker( args.choices );
		}

		// Tweaks to make the "clear" buttons work.
		setTimeout( function() {
			clear = jQuery( args.container ).find( '.wp-picker-clear' );
			clear.click( function() {
				kirki.setting.set( args.id, '' );
			} );
		}, 100 );

		// Saves our settings to the WP API
		picker.wpColorPicker( {
			change: function() {

				// Small hack: the picker needs a small delay
				setTimeout( function() {
					kirki.setting.set( args.id, picker.val() );
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
	template: function( args ) {
		var html    = '';

		html += '<div class="kirki-control-wrapper-color kirki-control-wrapper" data-setting="' + args.id + '">';
			html  = '<label>';
				html += '<span class="customize-control-title">' + args.label + '</span>';
				html += ( args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
				html += '<input type="text" ' + args.inputAttrs + ' data-setting="' + args.id + '" data-palette="' + args.palette + '" data-default-color="' + args.params['default'] + '" data-alpha="' + args.alpha + '" value="' + args.value + '" class="kirki-color-control"/>';
			html += '</label>';
		html += '</div>';

		jQuery( args.container ).html( html );
	},

	utils: {
		setValue: function( id, value ) {
			jQuery( 'input[data-setting="' + id + '"]' ).wpColorPicker( 'color', value );
		}
	}
};

wp.customize.controlConstructor['kirki-color'] = wp.customize.kirkiDynamicControl.extend({
	ready: function() {
		var control = this;

		control._setUpSettingRootLinks();
		control._setUpSettingPropertyLinks();

		wp.customize.Control.prototype.ready.call( control );

		control.deferred.embedded.done( function() {

			// Add the control.
			kirki.control.color.init({
				id: control.id,
				label: control.params.label,
				description: control.params.description,
				'default': control.params['default'],
				container: control.container,
				inputAttrs: control.params.inputAttrs || '',
				palette: control.params.palette || true,
				alpha: control.params.choices.alpha || true,
				choices: control.params.choices || {},
				value: control.setting._value
			});
		});
	}
});

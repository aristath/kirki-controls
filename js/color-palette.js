/* global wp, _, kirki */
kirki.control['color-palette'] = {
	/**
	 * Initialization for checkbox controls.
	 *
	 * @param {object} [args] The arguments.
	 */
	init: function( args ) {
		var self = this;

		self.template( args );

		jQuery( '.kirki-control-wrapper-color-palette' ).on( 'click', 'input', function() {
			kirki.setting.set( this, jQuery( this ).val() );
		});
	},

	/**
	 * The HTML Template for 'color-palette' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( args ) {
		var html    = '',
			inputWrapperClasses;

		if ( ! args.choices ) {
			return;
		}
		args.choices = _.defaults( args.choices, {
			style: 'square',
			'box-shadow': '',
			margin: false
		});

		inputWrapperClasses  = 'colors-wrapper ' + args.choices.style + ( ( true === args.choices['box-shadow'] ) ? ' box-shadow' : '' ) + ( inputWrapperClasses += ( true === args.choices.margin ) ? ' with-margin' : '' );

		html += '<div class="kirki-control-wrapper-color-palette kirki-control-wrapper" data-setting="' + args.id + '">';
			html += '<span class="customize-control-title">' + args.label + '</span>';
			html += ( args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
			html += '<div id="input_' + args.id + '" class="' + inputWrapperClasses + '">';
			_.each( args.choices.colors, function( val, key ) {
				html += '<input type="radio" ' + args.inputAttrs + ' value="' + val + '" name="_customize-color-palette-' + args.id + '" id="' + args.id + key + '" ' + ( args.value === val ? ' checked' : '' ) + '>';
					html += '<label for="' + args.id + key + '" style="width:' + args.choices.size + 'px; height:' + args.choices.size + 'px;">';
						html += '<span class="color-palette-color" style="background:' + val + ';">' + val + '</span>';
					html += '</label>';
				html += '</input>';
			} );
			html += '</div>';
		html += '</div>';

		jQuery( args.container ).html( html );
	},

	value: {
		/**
		 * Changes the value visually for 'color-palette' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		setValue: function( id, value ) {
			jQuery( '[data-setting="' + id + '"]' ).find( 'input[value="' + value + '"]' ).prop( 'checked', true );
		}
	}
};

wp.customize.controlConstructor['kirki-color-palette'] = wp.customize.kirkiDynamicControl.extend({
	ready: function() {
		var control = this;

		control._setUpSettingRootLinks();
		control._setUpSettingPropertyLinks();

		wp.customize.Control.prototype.ready.call( control );

		control.deferred.embedded.done( function() {

			// Add the control.
			kirki.control.checkbox.init({
				id: control.id,
				label: control.params.label,
				description: control.params.description,
				'default': control.params['default'],
				container: control.container,
				choices: control.params.choices,
				value: control.setting._value
			});
		});
	}
});

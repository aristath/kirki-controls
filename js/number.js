/* global wp, _, kirki */
kirki.control.number = {
	init: function( control ) {
		var step    = 1,
		    element;

		control.params.choices = _.defaults( control.params.choices, {
			min: -99999,
			max: 99999,
			step: 1
		} );

		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.number.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );

		element = kirki.util.controlContainer( control ).find( 'input' );

		// Set step value.
		if ( ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.step ) ) {
			step = ( 'any' === control.params.choices.step ) ? '0.001' : control.params.choices.step;
		}

		// Init the spinner
		jQuery( element ).spinner( control.params.choices );

		// On change
		kirki.util.controlContainer( control ).on( 'change click keyup paste', 'input', function() {
			control.setting.set( jQuery( this ).val() );
		} );

		// Notifications.
		kirki.control.number.notifications( control );
	},

	/**
	 * The HTML Template for 'number' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += kirki.control.template.header( control );
			html += '<div class="customize-control-content">';
				html += '<input ' + control.params.inputAttrs + ' type="text" ' + control.params.link + ' value="' + control.params.value + '" />';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-number kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'number' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( kirki.util.controlContainer( control ).find( 'input' ) ).attr( 'value', value );
		}
	},

	/**
	 * Handles notifications.
	 */
	notifications: function( control ) {
		wp.customize( control.id, function( setting ) {
			setting.bind( function( value ) {
				var code    = 'long_title',
					min     = ( ! _.isUndefined( control.params.choices.min ) ) ? Number( control.params.choices.min ) : false,
					max     = ( ! _.isUndefined( control.params.choices.max ) ) ? Number( control.params.choices.max ) : false,
					step    = ( ! _.isUndefined( control.params.choices.step ) ) ? Number( control.params.choices.step ) : false,
					invalid = false;

				// Make sure value is a number.
				value = Number( value );

				if ( false !== min && value < min ) {
					invalid = 'minError';
				} else if ( false !== max && value > max ) {
					invalid = 'maxError';
				} else if ( false !== step && false !== min && ! Number.isInteger( ( value - min ) / step ) ) {
					invalid = 'stepError';
				}

				if ( false !== invalid ) {
					setting.notifications.add( code, new wp.customize.Notification( code, {
						type: 'warning',
						message: control.params.l10n[ invalid ]
					} ) );
				} else {
					setting.notifications.remove( code );
				}
			} );
		} );
	}
};

wp.customize.controlConstructor['kirki-number'] = wp.customize.kirkiDynamicControl.extend({});

/* global wp, _, kirki */
kirki.control.dimensions = {
	init: function( control ) {
		var subControls = control.params.choices.controls,
			value       = {},
			subsArray   = [];

		control.container.html( kirki.control.dimensions.template( control ) );

		_.each( subControls, function( v, i ) {
			if ( true === v ) {
				subsArray.push( i );
			}
		} );

		kirki.util.controlContainer( control ).on( 'change keyup paste', 'input', function() {
			var choice = jQuery( this ).data( 'choice' );
			value[ choice ] = jQuery( this ).val();

			// Save the value
			kirki.control.dimension.value.save( value );
		} );

		// Notifications.
		kirki.control.dimensions.notifications( control );
	},

	/**
	 * The HTML Template for 'dimensions' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		control.params = _.defaults( control.params, {
			label: '',
			description: '',
			'default': {},
			choices: {},
			value: {}
		} );
		control.params.value = _.defaults( control.params.value, control.params['default'] );

		html += '<label>';
			html += kirki.control.template.header( control );
			html += '<div class="wrapper">';
				html += '<div class="control">';
					_.each( control.params['default'], function( choiceVal, choiceKey ) {
						html += '<div class="' + choiceKey + '">';
							html += '<h5>';
								if ( ! _.isUndefined( control.params.choices.labels ) && ! _.isUndefined( control.params.choices.labels[ choiceKey ] ) ) {
									html += control.params.choices.labels[ choiceKey ];
								} else if ( ! _.isUndefined( control.params.l10n[ choiceKey ] ) ) {
									html += control.params.l10n[ choiceKey ];
								} else {
									html += choiceKey;
								}
							html += '</h5>';
							html += '<div class="' + choiceKey + ' input-wrapper">';
								html += '<input type="text" ' + control.params.inputAttrs + ' data-choice="' + choiceKey + '" value="' + control.params.value[ choiceKey ].replace( '%%', '%' ) + '"/>';
							html += '</div>';
						html += '</div>';
					} );
				html += '</div>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-dimensions kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'dimensions' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			_.each( value, function( subValue, id ) {
				jQuery( kirki.util.controlContainer( control ).find( '.' + id + ' input' ) ).prop( 'value', subValue );
			} );
		},

		/**
		 * Saves the value.
		 */
		save: function( control, value ) {
			var newValue = {};

			_.each( value, function( newSubValue, i ) {
				newValue[ i ] = newSubValue;
			} );
			control.setting.set( newValue );
		}

	},

	/**
	 * Handles notifications.
	 */
	notifications: function( control ) {
		wp.customize( control.id, function( setting ) {
			setting.bind( function( value ) {
				var code = 'long_title',
					subs = {},
					message;

				setting.notifications.remove( code );

				_.each( value, function( subVal, key ) {
					if ( false === kirki.util.kirkiValidateCSSValue( subVal ) ) {
						subs[ key ] = control.params.l10n[ key ];
					} else {
						delete subs[ key ];
					}
				} );

				if ( ! _.isEmpty( subs ) ) {
					message = control.params.l10n['invalid-value'] + ' (' + _.values( subs ).toString() + ') ';
					setting.notifications.add( code, new wp.customize.Notification( code, {
						type: 'warning',
						message: message
					} ) );
				} else {
					setting.notifications.remove( code );
				}
			} );
		} );
	}
};

wp.customize.controlConstructor['kirki-dimensions'] = wp.customize.kirkiDynamicControl.extend({});

wp.customize.controlConstructor['kirki-number'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control = this,
		    step    = 1,
		    element;

		control.params.choices = _.defaults( control.params.choices, {
			min: -99999,
			max: 99999,
			step: 1
		});

		control.addHTML();

		element = this.container.find( 'input' );

		// Set step value.
		if ( ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.step ) ) {
			step = ( 'any' === control.params.choices.step ) ? '0.001' : control.params.choices.step;
		}

		// Init the spinner
		jQuery( element ).spinner( control.params.choices );

		// On change
		this.container.on( 'change click keyup paste', 'input', function() {
			control.setting.set( jQuery( this ).val() );
		});

		// Notifications.
		control.kirkiNotifications();
	},

	addHTML: function() {
		var control = this,
		    html    = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<input ' + control.params.inputAttrs + ' type="text" ' + control.params.link + ' value="' + control.params.value + '" />';
			html += '</div>';
		html += '</label>';

		control.container.html( html );
	},

	/**
	 * Handles notifications.
	 */
	kirkiNotifications: function() {

		var control = this;

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
			});
		});
	}
});

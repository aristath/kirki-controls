/* global dimensionskirkiL10n */
wp.customize.controlConstructor['kirki-dimensions'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control     = this,
		    subControls = control.params.choices.controls,
		    value       = {},
		    subsArray   = [],
		    i;

		control.container.html( control.getHTML() );

		_.each( subControls, function( v, i ) {
			if ( true === v ) {
				subsArray.push( i );
			}
		} );

		for ( i = 0; i < subsArray.length; i++ ) {
			value[ subsArray[ i ] ] = control.setting._value[ subsArray[ i ] ];
			control.updateDimensionsValue( subsArray[ i ], value );
		}
	},

	/**
	 * Gets the HTML for this control.
	 */
	getHTML: function() {
		var control = this,
		    html    = '';

		control.params = _.defaults( control.params, {
			label: '',
			description: '',
			'default': {},
			choices: {},
			value: {}
		});

		html += '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div class="wrapper"><div class="control">';
		_.each( control.params['default'], function( choiceVal, choiceKey ) {
			html += '<div class="' + choiceKey + '">';
			html += '<h5>';
			if ( ! _.isUndefined( control.params.choices.labels ) && ! _.isUndefined( control.params.choices.labels[ choiceKey ] ) ) {
				html += control.params.choices.labels[ choiceKey ];
			} else if ( ! _.isUndefined( dimensionskirkiL10n[ choiceKey ] ) ) {
				html += dimensionskirkiL10n[ choiceKey ];
			} else {
				html += choiceKey;
			}
			html += '</h5>';
			html += '<div class="' + choiceKey + ' input-wrapper">' + '<input type="text" value="' + control.params.value[ choiceKey ].replace( '%%', '%' ) + '"/></div>';
			html += '</div>';
		});
		html += '</div></div></label>';

		return html;
	},

	/**
	 * Updates the value.
	 */
	updateDimensionsValue: function( context, value ) {

		var control = this;

		control.container.on( 'change keyup paste', '.' + context + ' input', function() {
			value[ context ] = jQuery( this ).val();

			// Notifications.
			control.kirkiNotifications();

			// Save the value
			control.saveValue( value );
		});
	},

	/**
	 * Saves the value.
	 */
	saveValue: function( value ) {

		var control  = this,
		    newValue = {};

		_.each( value, function( newSubValue, i ) {
			newValue[ i ] = newSubValue;
		});

		control.setting.set( newValue );
	},

	/**
	 * Handles notifications.
	 */
	kirkiNotifications: function() {

		var control = this;

		wp.customize( control.id, function( setting ) {
			setting.bind( function( value ) {
				var code = 'long_title',
				    subs = {},
				    message;

				setting.notifications.remove( code );

				_.each( ['top', 'bottom', 'left', 'right'], function( direction ) {
					if ( ! _.isUndefined( value[ direction ] ) ) {
						if ( false === control.kirkiValidateCSSValue( value[ direction ] ) ) {
							subs[ direction ] = dimensionskirkiL10n[ direction ];
						} else {
							delete subs[ direction ];
						}
					}
				});

				if ( ! _.isEmpty( subs ) ) {
					message = dimensionskirkiL10n['invalid-value'] + ' (' + _.values( subs ).toString() + ') ';
					setting.notifications.add( code, new wp.customize.Notification(
						code,
						{
							type: 'warning',
							message: message
						}
					) );
				} else {
					setting.notifications.remove( code );
				}
			} );
		} );
	}
});

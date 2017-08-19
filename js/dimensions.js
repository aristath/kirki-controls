/* global wp, _ */
wp.customize.controlConstructor['kirki-dimensions'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control     = this,
		    subControls = control.params.choices.controls,
		    value       = {},
		    subsArray   = [],
		    i;

		control.addHTML();

		_.each( subControls, function( v, i ) {
			if ( true === v ) {
				subsArray.push( i );
			}
		} );

		control.container.on( 'change keyup paste', 'input', function() {
			var choice = jQuery( this ).data( 'choice' );
			value[ choice ] = jQuery( this ).val();

			// Save the value
			control.saveValue( value );
		} );

		// Notifications.
		control.kirkiNotifications();
	},

	/**
	 * Adds the HTML for this control.
	 */
	addHTML: function() {
		var control = this,
		    html    = '';

		control.params = _.defaults( control.params, {
			label: '',
			description: '',
			'default': {},
			choices: {},
			value: {}
		} );
		control.params.value = _.defaults( control.params.value, control.params['default'] );

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
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

		control.container.html( html );
	},

	/**
	 * Saves the value.
	 */
	saveValue: function( value ) {

		var control  = this,
		    newValue = {};

		_.each( value, function( newSubValue, i ) {
			newValue[ i ] = newSubValue;
		} );

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

				_.each( value, function( subVal, key ) {
					if ( false === control.kirkiValidateCSSValue( subVal ) ) {
						subs[ key ] = control.params.l10n[ key ];
					} else {
						delete subs[ key ];
					}
				} );

				if ( ! _.isEmpty( subs ) ) {
					message = control.params.l10n['invalid-value'] + ' (' + _.values( subs ).toString() + ') ';
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
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		_.each( value, function( subValue, id ) {
			jQuery( control.container.find( '.' + id + ' input' ) ).prop( 'value', subValue );
		} );
	}
} );

/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-dimensions'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control     = this,
		    subControls = control.params.choices.controls,
		    value       = {},
		    subsArray   = [],
		    i;

		control.container.html( kirki.template.dimensionsControl( control ) );

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
	}
} );

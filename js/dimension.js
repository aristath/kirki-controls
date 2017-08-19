/* global wp, _ */
wp.customize.controlConstructor['kirki-dimension'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
		    value;

		control.addHTML();

		// Notifications.
		control.kirkiNotifications();

		// Save the value
		this.container.on( 'change keyup paste', 'input', function() {

			value = jQuery( this ).val();
			control.setting.set( value );
		} );
	},

	addHTML: function() {
		var control = this,
		    html    = '';

		html += '<label class="customizer-text">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="input-wrapper">';
				html += '<input type="text" ' + control.params.inputAttrs + 'value="' + control.params.value.replace( '%%', '%' ) + '"/>';
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
				var code = 'long_title';

				if ( false === control.kirkiValidateCSSValue( value ) ) {
					setting.notifications.add( code, new wp.customize.Notification(
						code,
						{
							type: 'warning',
							message: control.params.l10n.invalidValue
						}
					) );
				} else {
					setting.notifications.remove( code );
				}
			} );
		} );
	}
} );

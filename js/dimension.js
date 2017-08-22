/* global wp, _, kirki */
kirki.control.dimension = {
	init: function( control ) {
		control.container.html( kirki.control.dimension.template( control ) );

		// Notifications.
		kirki.control.dimension.notifications( control );

		// Save the value
		this.container.on( 'change keyup paste', 'input', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	},

	/**
	 * The HTML Template for 'dimension' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label class="customizer-text">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="input-wrapper">';
				html += '<input type="text" ' + control.params.inputAttrs + 'value="' + control.params.value.replace( '%%', '%' ) + '"/>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-dimension">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'dimension' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( control.container.find( 'input' ) ).attr( 'value', value );
		}
	},

	notifications: function( control ) {
		wp.customize( control.id, function( setting ) {
			setting.bind( function( value ) {
				var code = 'long_title';

				if ( false === control.kirkiValidateCSSValue( value ) ) {
					setting.notifications.add( code, new wp.customize.Notification( code, {
						type: 'warning',
						message: control.params.l10n.invalidValue
					} ) );
				} else {
					setting.notifications.remove( code );
				}
			} );
		} );
	}
};

wp.customize.controlConstructor['kirki-dimension'] = wp.customize.kirkiDynamicControl.extend({});

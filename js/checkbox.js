/* global wp, _, kirki */

/**
 * Define the checkbox control functions.
 */
kirki.control.checkbox = {
	/**
	 * Initialization for checkbox controls.
	 *
	 * @param {object} [args] The arguments.
	 */
	init: function( args ) {
		var self = this;

		// Add the template.
		self.template( args );

		_.defer( function() {

			// Save the value
			jQuery( args.container + ' input' ).on( 'change', function() {
				var $this = jQuery( this ),
				    checkboxValue = ( $this.is( ':checked' ) ) ? true : false;

				kirki.setting.set( args.id, checkboxValue );
			} );
		} );
	},

	/**
	 * The HTML Template for 'checkbox' controls.
	 *
	 * @param {object} [args] The arguments.
	 * @returns {string}
	 */
	template: function( args ) {
		var html = '';

		html += '<div class="kirki-control-wrapper-checkbox kirki-control-wrapper" data-setting="' + args.id + '">';
			html += '<label>';
				html += '<input data-setting="' + args.id + '" type="checkbox" ' + args.inputAttrs + 'value="' + args.value + '" ' + ( true === args.value ? ' checked' : '' ) + '/>';
				html += args.label;
				html += ( args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
			html += '</label>';
		html += '</div>';

		jQuery( args.container ).html( html );
	},

	utils: {
		setValue: function( id, value ) {
			value = ( _.isBoolean( value ) ) ? value : false;
			jQuery( 'input[data-setting="' + id + '"]' ).attr( 'checked', value );
		}
	}
};

/**
 * Add the checkbox control to the customizer API.
 */
wp.customize.controlConstructor['kirki-checkbox'] = wp.customize.kirkiDynamicControl.extend({
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
				container: control.container
			});
		});
	}
});

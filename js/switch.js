/* global wp, _, kirki */

kirki.control['switch'] = _.extend( kirki.control.checkbox, {

	init: function( args ) {
		var self          = this,
		    checkboxValue = args.value,
		    on,
		    off;

		self.template( args );

		on  = jQuery( args.container ).find( '.switch-on' );
		off = jQuery( args.container ).find( '.switch-off' );

		// CSS modifications depending on label sizes.
		jQuery( args.container ).find( '.switch label ' ).css( 'width', ( on.width() + off.width() + 40 ) + 'px' );
		jQuery( '#customize-control-' + args.id.replace( '[', '-' ).replace( ']', '' ) ).append(
			'<style>#customize-control-' + args.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch label:after{width:' + ( on.width() + 13 ) + 'px;}#customize-control-' + args.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch input:checked + label:after{left:' + ( on.width() + 22 ) + 'px;width:' + ( off.width() + 13 ) + 'px;}</style>'
		);

		// Save the value
		jQuery( args.container ).on( 'change', 'input', function() {
			checkboxValue = ( jQuery( this ).is( ':checked' ) ) ? true : false;
			kirki.settinf.set( args.id, checkboxValue );
		} );
	},

	/**
	 * The HTML Template for 'switch' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( args ) {
		var html = '';

		html += '<div class="kirki-control-wrapper-switch kirki-control-wrapper" id="kirki-control-wrapper-' + args.id + '" data-setting="' + args.id + '">';
			html += '<div class="switch' + ( ( args.round ) ? ' round' : '' ) + '">';
				html += '<span class="customize-control-title">' + args.label + '</span>';
				html += ( args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
				html += '<input ' + args.inputAttrs + ' class="screen-reader-text" data-setting="' + args.id + '" name="switch_' + args.id + '" id="switch_' + args.id + '" type="checkbox" value="' + args.value + '" ' + ( '1' === args.value ? ' checked' : '' ) + '/>';
				html += '<label class="switch-label" for="switch_' + args.id + '">';
					html += '<span class="switch-on">' + args.on + '</span>';
					html += '<span class="switch-off">' + args.off + '</span>';
				html += '</label>';
			html += '</div>';
		html += '</div>';

		jQuery( args.container ).html( html );
	}
} );

wp.customize.controlConstructor['kirki-switch'] = wp.customize.kirkiDynamicControl.extend( {

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
				round: control.params.choices.round || false,
				inputAttrs: control.params.inputAttrs || '',
				on: control.params.choices.on || 'On',
				off: control.params.choices.on || 'Off'
			});
		});
	}
} );

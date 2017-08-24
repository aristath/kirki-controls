/* global wp, _, kirki */

kirki.control['switch'] = {

	init: function( control ) {
		var checkboxValue = control.setting._value,
		    html          = '',
		    on,
		    off;

		control.container.html( kirki.control['switch'].template( control ) );

		on  = jQuery( kirki.control.container( control ).find( '.switch-on' ) );
		off = jQuery( kirki.control.container( control ).find( '.switch-off' ) );

		// CSS modifications depending on label sizes.
		jQuery( kirki.control.container( control ).find( '.switch label ' ) ).css( 'width', ( on.width() + off.width() + 40 ) + 'px' );
		jQuery( '#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) ).append(
			'<style>#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch label:after{width:' + ( on.width() + 13 ) + 'px;}#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch input:checked + label:after{left:' + ( on.width() + 22 ) + 'px;width:' + ( off.width() + 13 ) + 'px;}</style>'
		);

		// Save the value
		kirki.control.container( control ).on( 'change', 'input', function() {
			checkboxValue = ( jQuery( this ).is( ':checked' ) ) ? true : false;
			control.setting.set( checkboxValue );
		} );
	},

	/**
	 * The HTML Template for 'switch' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<div class="switch' + ( ( control.params.choices.round ) ? ' round' : '' ) + '">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="switch_' + control.id + '" id="switch_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + '/>';
			html += '<label class="switch-label" for="switch_' + control.id + '">';
				html += '<span class="switch-on">' + control.params.choices.on + '</span>';
				html += '<span class="switch-off">' + control.params.choices.off + '</span>';
			html += '</label>';
		html += '</div>';

		return '<div class="kirki-control-wrapper-switch kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'switch' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			jQuery( kirki.control.container( control ).find( 'input' ) ).prop( 'checked', value );
		}
	}
};

wp.customize.controlConstructor['kirki-switch'] = wp.customize.kirkiDynamicControl.extend( {

	kirkiSetValue: function( value ) {
		kirki.value.set.checkboxControl( this, value );
	}
} );

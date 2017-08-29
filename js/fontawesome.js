/* global wp, _, fontAwesomeJSON, kirki */

kirki.control.fontawesome = {
	init: function( control ) {
		var icons   = jQuery.parseJSON( fontAwesomeJSON ),
			element,
		    selectValue,
		    select2Options = {
				data: [],
				escapeMarkup: function( markup ) {
					return markup;
				},
				templateResult: function( val ) {
					return '<i class="fa fa-lg fa-' + val.id + '" aria-hidden="true"></i>' + ' ' + val.text;
				},
				templateSelection: function( val ) {
					return '<i class="fa fa-lg fa-' + val.id + '" aria-hidden="true"></i>' + ' ' + val.text;
				}
		    },
		    select;

		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.fontawesome.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );

		element = kirki.util.controlContainer( control ).find( 'select' ),

		_.each( icons.icons, function( icon ) {
			select2Options.data.push( {
				id: icon.id,
				text: icon.name
			} );
		} );

		select = jQuery( element ).select2( select2Options );

		select.on( 'change', function() {
			selectValue = jQuery( this ).val();
			control.setting.set( selectValue );
		} );
		select.val( control.setting._value ).trigger( 'change' );
	},

	/**
	 * The HTML Template for 'fontawesome' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += kirki.control.template.header( control );
			html += '<select ' + control.params.inputAttrs + ' ' + control.params.link + '</select>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-fontawesome kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'fontawesome' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			control.setSelect2( kirki.util.controlContainer( control ).find( 'select' ), value );
		}
	}
};

wp.customize.controlConstructor['kirki-fontawesome'] = wp.customize.kirkiDynamicControl.extend({});

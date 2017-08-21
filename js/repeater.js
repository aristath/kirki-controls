/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend( {
	initKirkiControl: function() {
		var control     = this,
		    rowDefaults = {};

		_.each( control.params.fields, function( field, key ) {
			rowDefaults[ key ] = ( ! _.isUndefined( field['default'] ) ) ? field['default'] : '';
		} );

		control.container.html( kirki.template.repeaterControl( control ) );

		control.container.find( '.add-row' ).click( function() {
			jQuery( control.container.find( '.repeater-fields' ) )
				.append( kirki.template.repeaterControlRow( control, rowDefaults ) );
		});
	}
} );

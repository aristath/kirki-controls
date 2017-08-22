/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend( {
	initKirkiControl: function() {
		var control     = this;

		control.container.html( kirki.template.repeaterControl( control ) );

		control.repeaterRowAddButton();
		control.repeaterRowRemoveButton();
		control.repeaterRowSortable();

	},

	/**
	 * Actions to run when clicking on the "add row" button.
	 */
	repeaterRowAddButton: function() {
		var control = this,
		    rowDefaults = {};

		_.each( control.params.fields, function( field, key ) {
			rowDefaults[ key ] = ( ! _.isUndefined( field['default'] ) ) ? field['default'] : '';
		} );

		control.container.find( '.add-row' ).click( function( e ) {
			e.preventDefault();
			jQuery( control.container.find( '.repeater-rows' ) )
				.append( kirki.template.repeaterControlRow( control, rowDefaults ) );
		});
	},

	/**
	 * Actions to run when clicking on the "remove row" button.
	 */
	repeaterRowRemoveButton: function() {
		var control = this;

		control.container.find( '.repeater-row-remove-button' ).click( function( e ) {
			jQuery( this ).parents( '.repeater-row' ).remove();
		});
	},

	/**
	 * Sortable.
	 */
	repeaterRowSortable: function() {
		var control = this;

		control.container.find( '.repeater-rows' ).sortable();
	}
} );

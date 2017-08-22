/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend( {
	initKirkiControl: function() {
		var control     = this;

		control.container.html( kirki.control.template.repeaterControl( control ) );

		control.repeaterRowAddButton();
		control.repeaterRowRemoveButton();
		control.repeaterRowSortableAccordion();

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
				.append( kirki.control.template.repeaterControlRow( control, rowDefaults ) );
		});

		control.repeaterRowSortableAccordion();
	},

	/**
	 * Actions to run when clicking on the "remove row" button.
	 */
	repeaterRowRemoveButton: function() {
		var control = this;

		control.container.find( '.action.trash' ).click( function( e ) {
			jQuery( this ).parents( '.repeater-row' ).remove();
		});
	},

	/**
	 * Sortable.
	 */
	repeaterRowSortableAccordion: function() {
		var control = this;

		jQuery( control.container.find( '.repeater-rows' ) ).accordion({
			header: '> .repeater-row > .row-header',
			collapsible: true,
			animate: 150
		}).sortable({
			axis: 'y',
			handle: '.action.move',
			stop: function( event, ui ) {
				ui.item.children( '.action.move' ).triggerHandler( 'focusout' );
				jQuery( this ).accordion( 'refresh' );
			}
		});
	}
} );

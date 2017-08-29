/* global wp, _, kirki */
kirki.control.repeater = {

	/**
	 * Initialize this control.
	 *
	 * @since 2.0.0
	 * @param {object} [control] The control object.
	 * @returns {void}
	 */
	init: function( control ) {
		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.repeater.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );

		kirki.control.repeater.util.addRowButton( control );
		kirki.control.repeater.util.removeRowButton( control );
		kirki.control.repeater.util.sortableAccordion( control );

	},

	/**
	 * The HTML Template for 'repeater' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		// Do not proceed if no fields are defined.
		if ( ! control.params.fields ) {
			return;
		}

		// The control header.
		html += kirki.control.template.header( control );

		// Add the rows.
		html += '<ul class="repeater-rows">';
			_.each( control.params.value, function( rowValue, key ) {
				html += kirki.control.repeater.rowTemplate( control, rowValue, key );
			} );
		html += '</ul>';

		// Add row button.
		html += '<button class="add-row button"><span class="dashicons dashicons-plus"></span> Add Row</button>';

		return '<div class="kirki-control-wrapper-repeater kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	/**
	 * The HTML Template for a single row inside a repeater control.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	rowTemplate: function( control, value, rowKey ) {
		var rowTemplate = '';

		rowTemplate = '<li class="repeater-row" data-row="' + rowKey + '">';

			// The template for the row header.
			rowTemplate += '<div class="row-header">';
				rowTemplate += 'Row Title';
				rowTemplate += '<div class="repeater-row-actions">';
					rowTemplate += '<span class="action move"><span class="dashicons dashicons-move"></span></span>';
					rowTemplate += '<span class="action trash"><span class="dashicons dashicons-trash"></span></span>';
				rowTemplate += '</div>';
			rowTemplate += '</div>';

			// The template for the row content.
			rowTemplate += '<div class="row-content">';

				// Go through each field.
				_.each( control.params.fields, function( field, key ) {

					// Add the ID.
					field.params    = ( _.isUndefined( field.params ) ) ? {} : field.params;
					field.params.id = control.id + '[' + rowKey + '][' + key + ']';

					// Get missing arguments for the field.
					field = kirki.control.getArgs( field );

					// Add the value to the field.
					if ( ! _.isUndefined( value ) && ! _.isUndefined( value[ key ] ) ) {
						field.params.value = value[ key ];
					}

					// Add the template.
					rowTemplate += kirki.control[ field.type.replace( 'kirki-', '' ) ].template( field );

					// Init the field.
					kirki.control[ field.type.replace( 'kirki-', '' ) ].init( field );
				} );
			rowTemplate += '</div>';
		rowTemplate += '</li>';

		return rowTemplate;
	},

	util: {
		/**
		 * Add a new row.
		 *
		 * @since 2.0.0
		 * @param {object} [control] The control/field.
		 * @returns {void}
		 */
		addRowButton: function( control ) {
			var rowDefaults = {};

			_.each( control.params.fields, function( field, key ) {
				rowDefaults[ key ] = ( ! _.isUndefined( field['default'] ) ) ? field['default'] : '';
			} );

			kirki.util.controlContainer( control ).find( '.add-row' ).click( function( e ) {
				e.preventDefault();

				jQuery( kirki.util.controlContainer( control )
					.find( '.repeater-rows' ) )
					.append( kirki.control.repeater.rowTemplate( control, rowDefaults, kirki.util.controlContainer( control ).find( '.repeater-row' ).length ) );

				kirki.control.repeater.util.sortableAccordion( control );
			} );
		},

		/**
		 * Actions to run when clicking on the "remove row" button.
		 */
		removeRowButton: function( control ) {
			kirki.util.controlContainer( control ).find( '.action.trash' ).click( function( e ) {
				jQuery( this ).parents( '.repeater-row' ).remove();
			});
		},

		/**
		 * Sortable.
		 */
		sortableAccordion: function( control ) {
			jQuery( kirki.util.controlContainer( control ).find( '.repeater-rows' ) ).accordion({
				header: '> .repeater-row > .row-header',
				collapsible: true,
				animate: 150
			}).sortable({
				axis: 'y',
				handle: '.action.move',
				stop: function( event, ui ) {
					ui.item.children( '.action.move' ).triggerHandler( 'focusout' );
					jQuery( this ).accordion( 'refresh' );
					kirki.control.repeater.util.reorderIDs( control );
				}
			});
		},

		reorderIDs: function( control ) {
			var rows = jQuery( kirki.util.controlContainer( control ) ).find( '.repeater-row' ),
			    i    = 0;

			setTimeout( function() {
				_.each( rows, function( row ) {
					var oldRowID     = jQuery( row ).attr( 'data-row' ),
					    newRowID     = i,
					    oldSettingID = jQuery( row ).find( '.kirki-control-wrapper' ).attr( 'data-setting' ),
						newSettingID = oldSettingID.replace( '[' + oldRowID + ']', '[' + newRowID + ']' );

					jQuery( row ).attr( 'data-row', i );
					jQuery( row ).find( '.kirki-control-wrapper' ).attr( 'data-setting', newSettingID );
					i++;
				} );
			}, 50 );
		},

		getLastRowID: function( control ) {
			var rows = jQuery( kirki.util.controlContainer( control ) ).find( '.repeater-row' ),
			    lastRow = 0;

			// If there are no rows, return 0.
			if ( 0 === rows.length ) {
				return -1;
			}

			// Get the biggest row-ID.
			setTimeout( function() {
				_.each( rows, function( row ) {
					if ( jQuery( row ).attr( 'data-row' ) > lastRow ) {
						lastRow = jQuery( row ).attr( 'data-row' );
					}
				} );
			}, 30 );
			return lastRow;
		}
	}
};

wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend();

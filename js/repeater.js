/* global wp, _, kirki */
kirki.control.repeater = {
	init: function( control ) {
		control.container.html( kirki.control.repeater.template( control ) );

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

		if ( ! control.params.fields ) {
			return;
		}
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';

		html += '<ul class="repeater-rows">';
			_.each( control.params.value, function( rowValue, key ) {
				html += kirki.control.repeater.rowTemplate( control, rowValue, key );
			} );
		html += '</ul>';

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
			rowTemplate += '<div class="row-header">';
				rowTemplate += 'Row Title';
				rowTemplate += '<div class="repeater-row-actions">';
					rowTemplate += '<span class="action move"><span class="dashicons dashicons-move"></span></span>';
					rowTemplate += '<span class="action trash"><span class="dashicons dashicons-trash"></span></span>';
				rowTemplate += '</div>';
			rowTemplate += '</div>';

			rowTemplate += '<div class="row-content">';

				// Go through each field.
				_.each( control.params.fields, function( field, key ) {

					// Get the correct method for this control.
					if ( _.isUndefined( field.type ) || _.isUndefined( kirki.control[ field.type ] ) ) {
						field.type = 'generic';
					}
					field.settings = field.id;
					field.params   = _.defaults( field, {
						label: '',
						description: '',
						choices: {},
						inputAttrs: '',
						link: '',
						multiple: 1
					} );
					field.params.id = control.id + '[' + rowKey + ']' + '[' + key + ']';

					// Add the value to the field.
					if ( ! _.isUndefined( value ) && ! _.isUndefined( value[ key ] ) ) {
						field.params.value = value[ key ];
					}

					field = kirki.control.getArgs( field );

					// Add the template.
					rowTemplate += kirki.control[ field.type.replace( 'kirki-', '' ) ].template( field );
					kirki.control[ field.type.replace( 'kirki-', '' ) ].init( field );
				} );
			rowTemplate += '</div>';
		rowTemplate += '</li>';

		return rowTemplate;
	},

	util: {
		/**
		 * Actions to run when clicking on the "add row" button.
		 */
		addRowButton: function( control ) {
			var rowDefaults = {};

			_.each( control.params.fields, function( field, key ) {
				rowDefaults[ key ] = ( ! _.isUndefined( field['default'] ) ) ? field['default'] : '';
			} );
			kirki.control.container( control ).find( '.add-row' ).click( function( e ) {
				e.preventDefault();
				jQuery( kirki.control.container( control ).find( '.repeater-rows' ) )
					.append( kirki.control.repeater.rowTemplate( control, rowDefaults ) );
			});
			kirki.control.repeater.util.sortableAccordion( control );
		},

		/**
		 * Actions to run when clicking on the "remove row" button.
		 */
		removeRowButton: function( control ) {
			kirki.control.container( control ).find( '.action.trash' ).click( function( e ) {
				jQuery( this ).parents( '.repeater-row' ).remove();
			});
		},

		/**
		 * Sortable.
		 */
		sortableAccordion: function( control ) {
			jQuery( kirki.control.container( control ).find( '.repeater-rows' ) ).accordion({
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
			var rows = jQuery( kirki.control.container( control ) ).find( '.repeater-row' ),
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
		}
	}
};

wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend();

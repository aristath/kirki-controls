/* global wp, _, kirki */
kirki.control.repeater = {
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

		return '<div class="kirki-control-wrapper-repeater">' + html + '</div>';
	},

	/**
	 * The HTML Template for a single row inside a repeater control.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	rowTemplate: function( control, value, rowKey ) {
		var rowTemplate = '';

		rowTemplate = '<li class="repeater-row">';
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
					if ( _.isUndefined( field.type ) || _.isUndefined( kirki.control.type[ 'kirki-' + field.type ] ) ) {
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
					field.params.id = control.id + '[]' + '[' + key + ']';

					// Add the value to the field.
					if ( ! _.isUndefined( value ) && ! _.isUndefined( value[ key ] ) ) {
						field.params.value = value[ key ];
					}

					// Add the template.
					rowTemplate += kirki.control[ kirki.control.type[ field.type ] ].template( field );
				} );
			rowTemplate += '</div>';
		rowTemplate += '</li>';

		return rowTemplate;
	}
};

wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend( {
	initKirkiControl: function() {
		var control     = this;

		control.container.html( kirki.control.repeater.template( control ) );

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
				.append( kirki.control.repeater.rowTemplate( control, rowDefaults ) );
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

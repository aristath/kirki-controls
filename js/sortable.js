/* global wp, _, kirki */
kirki.control.sortable = {
	init: function( control ) {
		control.container.html( kirki.control.sortable.template( control ) );

		kirki.control.container( control ).find( '.kirki-controls-loading-spinner' ).hide();

		// Set the sortable container.
		control.sortableContainer = kirki.control.container( control ).find( 'ul.sortable' ).first();

		// Init sortable.
		control.sortableContainer.sortable( {

			// Update value when we stop sorting.
			stop: function() {
				kirki.control.sortable.value.save( control );
			}
		} ).disableSelection().find( 'li' ).each( function() {

			// Enable/disable options when we click on the eye of Thundera.
			jQuery( this ).find( 'i.visibility' ).click( function() {
				jQuery( this ).toggleClass( 'dashicons-visibility-faint' ).parents( 'li:eq(0)' ).toggleClass( 'invisible' );
			} );
		} ).click( function() {

			// Update value on click.
			kirki.control.sortable.value.save( control );
		} );
	},

	/**
	 * The HTML Template for 'sortable' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label class="kirki-sortable">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';

			html += '<ul class="sortable">';
				_.each( control.params.value, function( choiceID ) {
					html += '<li ' + control.params.inputAttrs + ' class="kirki-sortable-item" data-value="' + choiceID + '">';
						html += '<i class="dashicons dashicons-menu"></i>';
						html += '<i class="dashicons dashicons-visibility visibility"></i>';
						html += control.params.choices[ choiceID ];
					html += '</li>';
				} );
				_.each( control.params.choices, function( choiceLabel, choiceID ) {
					if ( -1 === control.params.value.indexOf( choiceID ) ) {
						html += '<li ' + control.params.inputAttrs + ' class="kirki-sortable-item invisible" data-value="' + choiceID + '">';
							html += '<i class="dashicons dashicons-menu"></i>';
							html += '<i class="dashicons dashicons-visibility visibility"></i>';
							html += control.params.choices[ choiceID ];
						html += '</li>';
					}
				} );
			html += '</ul>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-sortable kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		save: function( control ) {
			var newValue = [];

			this.sortableContainer.find( 'li' ).each( function() {
				if ( ! jQuery( this ).is( '.invisible' ) ) {
					newValue.push( jQuery( this ).data( 'value' ) );
				}
			} );
			control.setting.set( newValue );
		}
	}
};

wp.customize.controlConstructor['kirki-sortable'] = wp.customize.kirkiDynamicControl.extend({});

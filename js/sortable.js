/* global wp, _ */
wp.customize.controlConstructor['kirki-sortable'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {
		var control = this;

		control.addHTML();

		control.container.find( '.kirki-controls-loading-spinner' ).hide();

		// Set the sortable container.
		control.sortableContainer = control.container.find( 'ul.sortable' ).first();

		// Init sortable.
		control.sortableContainer.sortable( {

			// Update value when we stop sorting.
			stop: function() {
				control.kirkiSetValue();
			}
		} ).disableSelection().find( 'li' ).each( function() {

			// Enable/disable options when we click on the eye of Thundera.
			jQuery( this ).find( 'i.visibility' ).click( function() {
				jQuery( this ).toggleClass( 'dashicons-visibility-faint' ).parents( 'li:eq(0)' ).toggleClass( 'invisible' );
			} );
		} ).click( function() {

			// Update value on click.
			control.kirkiSetValue();
		} );
	},

	addHTML: function() {
		var control = this,
		    data    = control.params,
		    html    = '';

		html += '<label class="kirki-sortable">';
			html += '<span class="customize-control-title">' + data.label + '</span>';
			html += '<span class="description customize-control-description">' + data.description + '</span>';

			html += '<ul class="sortable">';
				_.each( data.value, function( choiceID ) {
					html += '<li ' + data.inputAttrs + ' class="kirki-sortable-item" data-value="' + choiceID + '">';
						html += '<i class="dashicons dashicons-menu"></i>';
						html += '<i class="dashicons dashicons-visibility visibility"></i>';
						html += data.choices[ choiceID ];
					html += '</li>';
				} );
				_.each( data.choices, function( choiceLabel, choiceID ) {
					if ( -1 === data.value.indexOf( choiceID ) ) {
						html += '<li ' + data.inputAttrs + ' class="kirki-sortable-item invisible" data-value="' + choiceID + '">';
							html += '<i class="dashicons dashicons-menu"></i>';
							html += '<i class="dashicons dashicons-visibility visibility"></i>';
							html += data.choices[ choiceID ];
						html += '</li>';
					}
				} );
			html += '</ul>';
		html += '</label>';
	},

	/**
	 * Updates the sorting list
	 */
	kirkiSetValue: function() {
		var control = this,
		    newValue = [];

		this.sortableContainer.find( 'li' ).each( function() {
			if ( ! jQuery( this ).is( '.invisible' ) ) {
				newValue.push( jQuery( this ).data( 'value' ) );
			}
		} );
		control.setting.set( newValue );
	}
} );

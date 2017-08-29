/* global kirki */
kirki.control.dashicons = {
	init: function( control ) {
		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.dashicons.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );
		jQuery( '.kirki-control-wrapper-dashicons' ).on( 'click', 'input', function() {
			kirki.setSettingValue( this, jQuery( this ).val() );
		});
	},

	/**
	 * The HTML Template for 'dashicons' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '',
		    data = control.params,
		    cats = ['admin-menu', 'welcome-screen', 'post-formats', 'media', 'image-editing', 'tinymce', 'posts', 'sorting', 'social', 'wordpress_org', 'products', 'taxonomies', 'widgets', 'notifications', 'misc'];

		html += kirki.control.template.header( control );
		html += '<div class="icons-wrapper">';
			if ( ! _.isUndefined( data.choices ) && 1 < _.size( data.choices ) ) {
				_.each( data.choices, function( val, key ) {
					html += '<input ' + data.inputAttrs + ' class="dashicons-select" type="radio" value="' + key + '" name="_customize-dashicons-radio-' + data.id + '" id="' + data.id + key + '" ' + data.link + ( data.value === key ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + data.id + key + '"><span class="dashicons dashicons-' + data.choices[ key ] + '"></span></label>';
					html += '</input>';
				} );
			} else {
				_.each( cats, function( cat ) {
					html += '<h4>' + data.l10n[ cat ] + '</h4>';
					_.each( data.icons[ cat ], function( val ) {
						html += '<input ' + data.inputAttrs + ' class="dashicons-select" type="radio" value="' + val + '" name="_customize-dashicons-radio-' + data.id + '" id="' + data.id + val + '" ' + data.link + ( data.value === val ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + data.id + val + '"><span class="dashicons dashicons-' + val + '"></span></label>';
						html += '</input>';
					} );
				} );
			}
		html += '</div>';

		return '<div class="kirki-control-wrapper-dashicons kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'dashicons' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			jQuery( kirki.util.controlContainer( control ).find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		}
	}
};

wp.customize.controlConstructor['kirki-dashicons'] = wp.customize.kirkiDynamicControl.extend({});

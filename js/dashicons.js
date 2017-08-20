/* global wp, _ */
wp.customize.controlConstructor['kirki-dashicons'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		var html    = '',
		    data    = control.params,
		    cats    = ['admin-menu', 'welcome-screen', 'post-formats', 'media', 'image-editing', 'tinymce', 'posts', 'sorting', 'social', 'wordpress_org', 'products', 'taxonomies', 'widgets', 'notifications', 'misc'];

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + data.description + '</span>';
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
					_.each( data.icons[ cat ], function( val, key ) {
						html += '<input ' + data.inputAttrs + ' class="dashicons-select" type="radio" value="' + val + '" name="_customize-dashicons-radio-' + data.id + '" id="' + data.id + val + '" ' + data.link + ( data.value === val ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + data.id + val + '"><span class="dashicons dashicons-' + val + '"></span></label>';
						html += '</input>';
					} );
				} );
			}
		html += '</div>';

		return html;
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
} );

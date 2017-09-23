/* global kirki */
kirki.control.dashicons = {
	init: function( args ) {
		var self = this;

		args.container.html( self.template( args ) );
		jQuery( args.container + '.kirki-control-wrapper-dashicons' ).on( 'click', 'input', function() {
			kirki.setting.set( args.id, jQuery( this ).val() );
		});
	},

	/**
	 * The HTML Template for 'dashicons' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( args ) {
		var html = '',
		    cats = ['admin-menu', 'welcome-screen', 'post-formats', 'media', 'image-editing', 'tinymce', 'posts', 'sorting', 'social', 'wordpress_org', 'products', 'taxonomies', 'widgets', 'notifications', 'misc'];

		html += '<span class="customize-control-title">' + args.label + '</span>';
		html += ( args.description ) ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
		html += '<div class="icons-wrapper">';
			if ( ! _.isUndefined( args.choices ) && 1 < _.size( args.choices ) ) {
				_.each( args.choices, function( val, key ) {
					html += '<input ' + args.inputAttrs + ' class="dashicons-select" type="radio" value="' + key + '" name="_customize-dashicons-radio-' + args.id + '" id="' + args.id + key + '" ' + args.link + ( args.value === key ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + args.id + key + '"><span class="dashicons dashicons-' + args.choices[ key ] + '"></span></label>';
					html += '</input>';
				} );
			} else {
				_.each( cats, function( cat ) {
					html += '<h4>' + args.l10n[ cat ] + '</h4>';
					_.each( args.icons[ cat ], function( val ) {
						html += '<input ' + args.inputAttrs + ' class="dashicons-select" type="radio" value="' + val + '" name="_customize-dashicons-radio-' + args.id + '" id="' + args.id + val + '" ' + args.link + ( args.value === val ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + args.id + val + '"><span class="dashicons dashicons-' + val + '"></span></label>';
						html += '</input>';
					} );
				} );
			}
		html += '</div>';

		return '<div class="kirki-control-wrapper-dashicons kirki-control-wrapper" id="kirki-control-wrapper-' + args.id + '" data-setting="' + args.id + '">' + html + '</div>';
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

wp.customize.controlConstructor['kirki-dashicons'] = wp.customize.kirkiDynamicControl.extend({
	ready: function() {
		var control = this;

		control._setUpSettingRootLinks();
		control._setUpSettingPropertyLinks();

		wp.customize.Control.prototype.ready.call( control );

		control.deferred.embedded.done( function() {

			// Add the control.
			kirki.control.color.init({
				id: control.id,
				label: control.params.label,
				description: control.params.description,
				'default': control.params['default'],
				container: control.container,
				inputAttrs: control.params.inputAttrs || '',
				choices: control.params.choices || {},
				value: control.setting._value,
				link: control.link
			});
		});
	}
});

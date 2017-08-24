/* global wp, _, kirki */
kirki.control.image = {
	init: function( control ) {
		var value   = _.defaults( control.setting._value, control.params['default'] );

		control.container.html( kirki.control.image.template( control ) );
		control.kirkiSetControlValue( value );

		kirki.control.image.util.addImage( control );
		kirki.control.image.util.removeImage( control );
	},

	/**
	 * The HTML Template for 'image' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html    = '',
			saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as,
			value   = control.params.value,
			url     = value;

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '</label>';
		html += '<div class="wrapper">';
			html += '<div class="image">';
				html += '<div class="attachment-media-view image-upload">';
					html += '<div class="thumbnail thumbnail-image"><img class="' + control.id + '-image" src="" alt="" /></div>';
					html += '<div class="actions">';
						html += '<button class="button image-upload-remove-button' + ( ! control.params.value ? ' hidden' : '' ) + '">' + control.params.l10n.remove + '</button> ';
						html += '<button type="button" class="button image-upload-button">' + control.params.l10n.selectFile + '</button> ';
						if ( control.params['default'] && '' !== control.params['default'] ) {
							html += '<button type="button" class="button image-default-button"' + ( ( control.params['default'] === control.params.value || ( ! _.isUndefined( control.params.value.url ) && control.params['default'] === control.params.value.url ) ) ? ' style="display:none;' : '' ) + '">' + control.params.l10n.defaultImage + '</button>';
						}
					html += '</div>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		return '<div class="kirki-control-wrapper-image kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'image' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {mixed}  [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as,
				url     = value;

			if ( _.isObject( value ) && ! _.isUndefined( value.url ) ) {
				jQuery( kirki.control.container( control ).find( '.' + control.id + '-image' ) ).prop( 'src', value.url );
			} else if ( 'id' === saveAs && ! isNaN( value ) ) {
				wp.media.attachment( value ).fetch().then( function( mediaData ) {
					setTimeout( function() {
						jQuery( kirki.control.container( control ).find( '.' + control.id + '-image' ) ).prop( 'src', wp.media.attachment( value ).get( 'url' ) );
					}, 500 );
				} );
			} else {
				jQuery( kirki.control.container( control ).find( '.' + control.id + '-image' ) ).prop( 'src', value );
			}
		},

		save: function( control, value, property ) {
			/* TODO */
			control.setting.set( value );
		}
	},

	util: {
		addImage: function( control ) {
			var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as,
				image,
				uploadedImage;

			kirki.control.container( control ).on( 'click', '.image-upload-button', function( e ) {
				image = wp.media( { multiple: false } ).open().on( 'select', function() {
					uploadedImage = image.state().get( 'selection' ).first();

					// Save the value.
					if ( 'id' === saveAs ) {
						kirki.control.image.value.save( control, uploadedImage.toJSON().id );
					} else if ( 'array' === saveAs ) {
						kirki.control.image.value.save( control, {
							id: uploadedImage.toJSON().id,
							url: uploadedImage.toJSON().sizes.full.url,
							width: uploadedImage.toJSON().width,
							height: uploadedImage.toJSON().height
						});
					} else {
						kirki.control.image.value.save( control, uploadedImage.toJSON().sizes.full.url );
					}

					// Add the image to the placeholder.
					if ( kirki.control.container( control ).find( '.placeholder, .thumbnail' ).length ) {
						kirki.control.container( control ).find( '.placeholder, .thumbnail' ).removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + uploadedImage.toJSON().sizes.full.url + '" alt="" />' );
					}

					// Add the remove button.
					if ( kirki.control.container( control ).find( '.image-upload-remove-button' ).length ) {
						kirki.control.container( control ).find( '.image-upload-remove-button' ).show();
					}
				} );
				e.preventDefault();
			} );
		},

		removeImage: function( control ) {
			var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

			kirki.control.container( control ).on( 'click', '.image-upload-remove-button', function( e ) {
				e.preventDefault();

				// Update the value.
				if ( 'array' === saveAs ) {
					kirki.control.image.value.save( control, {
						id: '',
						url: '',
						width: '',
						height: ''
					} );
				} else {
					kirki.control.image.value.save( control, '' );
				}

				// Remove image and add placeholder text.
				if ( kirki.control.container( control ).find( '.placeholder, .thumbnail' ).length ) {
					kirki.control.container( control ).find( '.placeholder, .thumbnail' ).removeClass().addClass( 'placeholder' ).html( 'No file selected' );
				}

				// Hide the "Remove" button.
				if ( kirki.control.container( control ).find( '.image-upload-remove-button' ).length ) {
					kirki.control.container( control ).find( '.image-upload-remove-button' ).hide();
				}
			} );
		},

		defaultImage: function( control ) {
			var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

			kirki.control.container( control ).on( 'click', '.image-default-button', function( e ) {
				e.preventDefault();

				// Update the value both in the settings and visually.
				kirki.control.image.value.save( control, control.params['default'], 'url' );
				control.kirkiSetControlValue( control.params['default'] );

				if ( kirki.control.container( control ).find( '.image-upload-remove-button' ).length ) {
					kirki.control.container( control ).find( '.image-upload-remove-button' ).show();
					kirki.control.container( control ).find( '.image-default-button' ).hide();
				}
			} );
		}
	}
};

wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend({});

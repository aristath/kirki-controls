/* global wp, _ */
wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
		    value   = _.defaults( control.setting._value, control.params['default'] ),
		    saveAs,
		    preview,
		    previewImage,
		    removeButton,
		    defaultButton;

		control.addHTML();

		preview       = control.container.find( '.placeholder, .thumbnail' );
	    previewImage  = ( 'array' === saveAs ) ? value.url : value;
	    removeButton  = control.container.find( '.image-upload-remove-button' );
	    defaultButton = control.container.find( '.image-default-button' );

		control.container.find( '.kirki-controls-loading-spinner' ).hide();

		// Tweaks for save_as = id.
		if ( ( 'id' === saveAs || 'ID' === saveAs ) && '' !== value ) {
			wp.media.attachment( value ).fetch().then( function( mediaData ) {
				setTimeout( function() {
					var url = wp.media.attachment( value ).get( 'url' );
					preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + url + '" alt="" />' );
				}, 700 );
			} );
		}

		// If value is not empty, hide the "default" button.
		if ( ( 'url' === saveAs && '' !== value ) || ( 'array' === saveAs && ! _.isUndefined( value.url ) && '' !== value.url ) ) {
			control.container.find( 'image-default-button' ).hide();
		}

		// If value is empty, hide the "remove" button.
		if ( ( 'url' === saveAs && '' === value ) || ( 'array' === saveAs && ( _.isUndefined( value.url ) || '' === value.url ) ) ) {
			removeButton.hide();
		}

		// If value is default, hide the default button.
		if ( value === control.params['default'] ) {
			control.container.find( 'image-default-button' ).hide();
		}

		if ( '' !== previewImage ) {
			preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
		}

		control.container.on( 'click', '.image-upload-button', function( e ) {
			var image = wp.media( { multiple: false } ).open().on( 'select', function() {

					// This will return the selected image from the Media Uploader, the result is an object.
					var uploadedImage = image.state().get( 'selection' ).first(),
					    previewImage  = uploadedImage.toJSON().sizes.full.url;

					if ( ! _.isUndefined( uploadedImage.toJSON().sizes.medium ) ) {
						previewImage = uploadedImage.toJSON().sizes.medium.url;
					} else if ( ! _.isUndefined( uploadedImage.toJSON().sizes.thumbnail ) ) {
						previewImage = uploadedImage.toJSON().sizes.thumbnail.url;
					}

					if ( 'array' === saveAs ) {
						control.kirkiSetValue( uploadedImage.toJSON().id, 'id' );
						control.kirkiSetValue( uploadedImage.toJSON().sizes.full.url, 'url' );
						control.kirkiSetValue( uploadedImage.toJSON().width, 'width' );
						control.kirkiSetValue( uploadedImage.toJSON().height, 'height' );
					} else if ( 'id' === saveAs ) {
						control.kirkiSetValue( uploadedImage.toJSON().id, 'id' );
					} else {
						control.kirkiSetValue( uploadedImage.toJSON().sizes.full.url, 'url' );
					}

					if ( preview.length ) {
						preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
					}
					if ( removeButton.length ) {
						removeButton.show();
						defaultButton.hide();
					}
			    } );

			e.preventDefault();
		} );

		control.container.on( 'click', '.image-upload-remove-button', function( e ) {

			var preview,
			    removeButton,
			    defaultButton;

			e.preventDefault();

			control.kirkiSetValue( '', 'id' );
			control.kirkiSetValue( '', 'url' );
			control.kirkiSetValue( '', 'width' );
			control.kirkiSetValue( '', 'height' );

			preview       = control.container.find( '.placeholder, .thumbnail' );
			removeButton  = control.container.find( '.image-upload-remove-button' );
			defaultButton = control.container.find( '.image-default-button' );

			if ( preview.length ) {
				preview.removeClass().addClass( 'placeholder' ).html( 'No file selected' );
			}
			if ( removeButton.length ) {
				removeButton.hide();
				if ( jQuery( defaultButton ).hasClass( 'button' ) ) {
					defaultButton.show();
				}
			}
		} );

		control.container.on( 'click', '.image-default-button', function( e ) {

			var preview,
			    removeButton,
			    defaultButton;

			e.preventDefault();

			control.kirkiSetValue( 'url', control.params['default'] );

			preview       = control.container.find( '.placeholder, .thumbnail' );
			removeButton  = control.container.find( '.image-upload-remove-button' );
			defaultButton = control.container.find( '.image-default-button' );

			if ( preview.length ) {
				preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + control.params['default'] + '" alt="" />' );
			}
			if ( removeButton.length ) {
				removeButton.show();
				defaultButton.hide();
			}
		} );
	},

	addHTML: function() {
		var control = this,
		    html = '',
		    saveAs,
		    url;

		saveAs = ( ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.save_as ) ) ? control.params.choices.save_as : 'url';

		url = control.params.value;
		url = ( _.isObject( control.params.value ) && ! _.isUndefined( control.params.value.url ) ) ? control.params.value.url : url;

		html += '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '</label>';
		html += '<div class="image-wrapper attachment-media-view image-upload" ' + control.params.inputAttrs + '>';
		if ( '' !== url ) {
			html += '<div class="thumbnail thumbnail-image"><img src="' + url + '" alt="" /></div>';
		} else {
			html += '<div class="placeholder">' + control.params.l10n.noFileSelected + '</div>';
		}
		html += '<div class="actions">';
		html += '<button class="button image-upload-remove-button' + ( '' === url ? ' hidden' : '' ) + '">' + control.params.l10n.remove + '</button>';
		if ( control.params['default'] && '' !== control.params['default'] ) {
			html += '<button type="button" class="button image-default-button"' + ( ( control.params['default'] === control.params.value || ( ! _.isUndefined( control.params.value.url ) && control.params['default'] === control.params.value.url ) ) ? ' style="display:none;' : '' ) + '">' + control.params.l10n.defaultImage + '</button>';
		}
		html += '<button type="button" class="button image-upload-button">' + control.params.l10n.selectFile + '</button>';
		html += '</div></div>';

		control.container.html( html );
	}
} );

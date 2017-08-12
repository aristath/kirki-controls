wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control = this,
		    value   = control.getValue(),
		    saveAs,
		    preview,
		    previewImage,
		    removeButton,
		    defaultButton,
			url;

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
			var image = wp.media({ multiple: false }).open().on( 'select', function() {

					// This will return the selected image from the Media Uploader, the result is an object.
					var uploadedImage = image.state().get( 'selection' ).first(),
					    previewImage  = uploadedImage.toJSON().sizes.full.url;

					if ( ! _.isUndefined( uploadedImage.toJSON().sizes.medium ) ) {
						previewImage = uploadedImage.toJSON().sizes.medium.url;
					} else if ( ! _.isUndefined( uploadedImage.toJSON().sizes.thumbnail ) ) {
						previewImage = uploadedImage.toJSON().sizes.thumbnail.url;
					}

					if ( 'array' === saveAs ) {
						control.saveValue( 'id', uploadedImage.toJSON().id );
						control.saveValue( 'url', uploadedImage.toJSON().sizes.full.url );
						control.saveValue( 'width', uploadedImage.toJSON().width );
						control.saveValue( 'height', uploadedImage.toJSON().height );
					} else if ( 'id' === saveAs ) {
						control.saveValue( 'id', uploadedImage.toJSON().id );
					} else {
						control.saveValue( 'url', uploadedImage.toJSON().sizes.full.url );
					}

					if ( preview.length ) {
						preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
					}
					if ( removeButton.length ) {
						removeButton.show();
						defaultButton.hide();
					}
			    });

			e.preventDefault();
		});

		control.container.on( 'click', '.image-upload-remove-button', function( e ) {

			var preview,
			    removeButton,
			    defaultButton;

			e.preventDefault();

			control.saveValue( 'id', '' );
			control.saveValue( 'url', '' );
			control.saveValue( 'width', '' );
			control.saveValue( 'height', '' );

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
		});

		control.container.on( 'click', '.image-default-button', function( e ) {

			var preview,
			    removeButton,
			    defaultButton;

			e.preventDefault();

			control.saveValue( 'url', control.params['default'] );

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
		});
	},

	addHTML: function() {
		var control = this,
		    html = '';

		saveAs = ( ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.save_as ) ) ? control.params.choices.save_as : 'url';

		url = control.params.value;
		url = ( _.isObject( control.params.value ) && ! _.isUndefined( control.params.value.url ) ) ? control.params.value.url : url;

		html += '<label>';
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '</label>';
		html += '<div class="image-wrapper attachment-media-view image-upload">';
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
	},

	/**
	 * Gets the value.
	 */
	getValue: function() {

		var control = this;
		return _.defaults( control.setting._value, control.params['default'] );
	},

	/**
	 * Saves the value.
	 */
	saveValue: function( property, value ) {

		var control  = this,
		    sumValue = control.getValue(),
			saveAs    = ( ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.save_as ) ) ? control.params.choices.save_as : 'url';

		sumValue[ property ] = value;

		if ( 'array' === saveAs ) {
			wp.customize( control.id, function( obj ) {

				// Reset the setting value, so that the change is triggered
				obj.set( '' );

				// Set the right value
				obj.set( sumValue );
			});
			return;
		}
		control.setting.set( value );
	}
});

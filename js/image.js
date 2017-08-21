/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
		    value   = _.defaults( control.setting._value, control.params['default'] );

		control.container.html( kirki.template.imageControl( control ) );
		control.kirkiSetControlValue( value );

		control.kirkiAddImage();
		control.kirkiRemoveImage();
	},

	kirkiAddImage: function() {
		var control = this,
		    saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as,
		    image,
		    uploadedImage;

		control.container.on( 'click', '.image-upload-button', function( e ) {
			image = wp.media( { multiple: false } ).open().on( 'select', function() {
				uploadedImage = image.state().get( 'selection' ).first();

				// Save the value.
				if ( 'id' === saveAs ) {
					control.kirkiSetValue( uploadedImage.toJSON().id );
				} else if ( 'array' === saveAs ) {
					control.kirkiSetValue({
						id: uploadedImage.toJSON().id,
						url: uploadedImage.toJSON().sizes.full.url,
						width: uploadedImage.toJSON().width,
						height: uploadedImage.toJSON().height
					});
				} else {
					control.kirkiSetValue( uploadedImage.toJSON().sizes.full.url );
				}

				// Add the image to the placeholder.
				if ( control.container.find( '.placeholder, .thumbnail' ).length ) {
					control.container.find( '.placeholder, .thumbnail' ).removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + uploadedImage.toJSON().sizes.full.url + '" alt="" />' );
				}

				// Add the remove button.
				if ( control.container.find( '.image-upload-remove-button' ).length ) {
					control.container.find( '.image-upload-remove-button' ).show();
				}
		    } );
			e.preventDefault();
		} );
	},

	kirkiRemoveImage: function() {
		var control = this,
		    saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

		control.container.on( 'click', '.image-upload-remove-button', function( e ) {
			e.preventDefault();

			// Update the value.
			if ( 'array' === saveAs ) {
				control.kirkiSetValue( {
					id: '',
					url: '',
					width: '',
					height: ''
				} );
			} else {
				control.kirkiSetValue( '' );
			}

			// Remove image and add placeholder text.
			if ( control.container.find( '.placeholder, .thumbnail' ).length ) {
				control.container.find( '.placeholder, .thumbnail' ).removeClass().addClass( 'placeholder' ).html( 'No file selected' );
			}

			// Hide the "Remove" button.
			if ( control.container.find( '.image-upload-remove-button' ).length ) {
				control.container.find( '.image-upload-remove-button' ).hide();
			}
		} );
	},

	kirkiDefaultImage: function() {
		var control = this,
		    saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

		control.container.on( 'click', '.image-default-button', function( e ) {
			e.preventDefault();

			// Update the value both in the settings and visually.
			control.kirkiSetValue( control.params['default'], 'url' );
			control.kirkiSetControlValue( control.params['default'] );

			if ( control.container.find( '.image-upload-remove-button' ).length ) {
				control.container.find( '.image-upload-remove-button' ).show();
				control.container.find( '.image-default-button' ).hide();
			}
		} );
	},

	kirkiSetValue: function( value, property ) {
		/* TODO */
		var control = this;
		control.setting.set( value );
	}
} );

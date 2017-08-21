/* global wp, _, kirkiControlsHTML */
wp.customize.controlConstructor['kirki-background'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
		    value   = _.defaults( control.setting._value, control.params['default'] ),
		    picker;

			control.container.html( kirkiControlsHTML.backgroundTemplate( control ) );

		picker = control.container.find( '.kirki-color-control' );

		// Hide unnecessary controls if the value doesn't have an image.
		if ( _.isUndefined( value['background-image'] ) || '' === value['background-image'] ) {
			control.container.find( '.background-wrapper > .background-repeat', '.background-wrapper > .background-position', '.background-wrapper > .background-size', '.background-wrapper > .background-attachment' ).hide();
		}

		// Color.
		picker.wpColorPicker( {
			change: function() {
				setTimeout( function() {
					control.kirkiSetValue( picker.val(), 'background-color' );
				}, 100 );
			}
		} );

		_.each( {
			'repeat': ['change', 'select'],
			'size': ['change click', 'input'],
			'position': ['change', 'select'],
			'attachment': ['change click', 'input']
		}, function( args, key ) {
			control.container.on( args[0], '.background-' + key + ' ' + args[1], function() {
				control.kirkiSetValue( jQuery( this ).val(), 'background-' + key );
			} );
		} );

		control.kirkiAddImage();
		control.kirkiRemoveImage();
	},

	kirkiAddImage: function() {
		var control = this;

		control.container.on( 'click', '.background-image-upload-button', function( e ) {
			var image = wp.media( { multiple: false } ).open().on( 'select', function() {

				// This will return the selected image from the Media Uploader, the result is an object.
				var uploadedImage = image.state().get( 'selection' ).first(),
				    previewImage   = uploadedImage.toJSON().sizes.full.url,
				    imageUrl,
				    imageID,
				    imageWidth,
				    imageHeight,
				    preview,
				    removeButton;

				if ( ! _.isUndefined( uploadedImage.toJSON().sizes.medium ) ) {
					previewImage = uploadedImage.toJSON().sizes.medium.url;
				} else if ( ! _.isUndefined( uploadedImage.toJSON().sizes.thumbnail ) ) {
					previewImage = uploadedImage.toJSON().sizes.thumbnail.url;
				}

				imageUrl    = uploadedImage.toJSON().sizes.full.url;
				imageID     = uploadedImage.toJSON().id;
				imageWidth  = uploadedImage.toJSON().width;
				imageHeight = uploadedImage.toJSON().height;

				// Show extra controls if the value has an image.
				if ( '' !== imageUrl ) {
					control.container.find( '.background-wrapper > .background-repeat, .background-wrapper > .background-position, .background-wrapper > .background-size, .background-wrapper > .background-attachment' ).show();
				}

				control.kirkiSetValue( imageUrl, 'background-image' );
				preview      = control.container.find( '.placeholder, .thumbnail' );
				removeButton = control.container.find( '.background-image-upload-remove-button' );

				if ( preview.length ) {
					preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
				}
				if ( removeButton.length ) {
					removeButton.show();
				}
		    } );

			e.preventDefault();
		} );
	},

	kirkiRemoveImage: function() {
		var control = this;

		control.container.on( 'click', '.background-image-upload-remove-button', function( e ) {

			var preview,
			    removeButton;

			e.preventDefault();

			control.kirkiSetValue( '', 'background-image' );

			preview      = control.container.find( '.placeholder, .thumbnail' );
			removeButton = control.container.find( '.background-image-upload-remove-button' );

			// Hide unnecessary controls.
			control.container.find( '.background-wrapper > .background-repeat', '.background-wrapper > .background-position', '.background-wrapper > .background-size', '.background-wrapper > .background-attachment' ).hide();

			if ( preview.length ) {
				preview.removeClass().addClass( 'placeholder' ).html( 'No file selected' );
			}
			if ( removeButton.length ) {
				removeButton.hide();
			}
		} );
	},

	// Changes the value visually.
	kirkiSetControlValue: function( value, property ) {
		var control = this;

		// Change the value visually.
		if ( ! _.isUndefined( value['background-color'] ) ) {
			control.setColorPicker( control.container.find( '.kirki-color-control' ), value['background-color'] );
		}
		control.container.find( '.placeholder, .thumbnail' ).removeClass().addClass( 'placeholder' ).html( 'No file selected' );
		_.each( ['background-repeat', 'background-position'], function( subVal ) {
			if ( ! _.isUndefined( value[ subVal ] ) ) {
				control.setSelect2( control.container.find( '.' + subVal + ' select' ), value[ subVal ] );
			}
		} );
		_.each( ['background-size', 'background-attachment'], function( subVal ) {
			jQuery( control.container.find( '.' + subVal + ' input[value="' + value + '"]' ) ).prop( 'checked', true );
		} );
	}
} );

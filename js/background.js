/* global wp, _, kirki */
kirki.control.background = {
	/**
	 * The HTML Template for 'background' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {

		var html    = '',
			data    = control.params;

		html += '<label>';
			html += '<span class="customize-control-title">' + data.label + '</span>';
			html += '<span class="description customize-control-description">' + data.description + '</span>';
		html += '</label>';
		html += '<div class="background-wrapper">';

			// Background Color.
			html += '<div class="background-color">';
				html += '<h4>' + data.l10n.backgroundColor + '</h4>';
				html += '<input type="text" data-default-color="' + data['default']['background-color'] + '" data-alpha="true" value="' + data.value['background-color'] + '" class="kirki-color-control"/>';
			html += '</div>';

			// Background Image.
			html += '<div class="background-image">';
				html += '<h4>' + data.l10n.backgroundImage + '</h4>';
				html += '<div class="attachment-media-view background-image-upload">';
					if ( data.value['background-image'] ) {
						html += '<div class="thumbnail thumbnail-image"><img src="' + data.value['background-image'] + '" alt="" /></div>';
					} else {
						html += '<div class="placeholder">' + data.l10n.noFileSelected + '</div>';
					}
					html += '<div class="actions">';
						html += '<button class="button background-image-upload-remove-button' + ( ! data.value['background-image'] ? ' hidden' : '' ) + '">' + data.l10n.remove + '</button> ';
						html += '<button type="button" class="button background-image-upload-button">' + data.l10n.selectFile + '</button> ';
					html += '</div>';
				html += '</div>';
			html += '</div>';

			// Background Repeat.
			html += '<div class="background-repeat">';
				html += '<h4>' + data.l10n.backgroundRepeat + '</h4>';
				html += '<select ' + data.inputAttrs + '>';
					html += '<option value="no-repeat"' + ( 'no-repeat' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.noRepeat + '</option>';
					html += '<option value="repeat-all"' + ( 'repeat-all' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.repeatAll + '</option>';
					html += '<option value="repeat-x"' + ( 'repeat-x' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.repeatX + '</option>';
					html += '<option value="repeat-y"' + ( 'repeat-y' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.repeatY + '</option>';
				html += '</select>';
			html += '</div>';

			// Background Position.
			html += '<div class="background-position">';
				html += '<h4>' + data.l10n.backgroundPosition + '</h4>';
				html += '<select ' + data.inputAttrs + '>';
					_.each( {
						'left top': 'leftTop',
						'left center': 'leftCenter',
						'left bottom': 'leftTop',
						'center top': 'centerTop',
						'center center': 'centerCenter',
						'center bottom': 'centerBottom',
						'right top': 'rightTop',
						'right center': 'rightCenter',
						'right bottom': 'rightBottom'
					}, function( val, key ) {
						html += '<option value="' + key + '"' + ( key === data.value['background-position'] ? 'selected' : '' ) + '>' + data.l10n[ val ] + '</option>';
					} );
				html += '</select>';
			html += '</div>';

			// Background Size.
			html += '<div class="background-size">';
				html += '<h4>' + data.l10n.backgroundSize + '</h4>';
				html += '<div class="buttonset">';
					_.each( ['cover', 'contain', 'auto'], function( val ) {
						html += '<input ' + data.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="' + val + '" name="_customize-bg-' + data.id + '-size" id="' + data.id + val + '" ' + ( val === data.value['background-size'] ? 'checked="checked"' : '' ) + '>';
							html += '<label class="switch-label switch-label-' + ( val === data.value['background-size'] ? 'on' : 'off' ) + '" for="' + data.id + val + '">' + data.l10n[ val ] + '</label>';
						html += '</input>';
					} );
				html += '</div>';
			html += '</div>';

			// Background Attachment.
			html += '<div class="background-attachment">';
				html += '<h4>' + data.l10n.backgroundAttach + '</h4>';
				html += '<div class="buttonset">';
					html += '<input ' + data.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="scroll" name="_customize-bg-' + data.id + '-attachment" id="' + data.id + 'scroll" ' + ( 'scroll' === data.value['background-attachment'] ? ' checked="checked"' : '' ) + '>';
						html += '<label class="switch-label switch-label-' + ( 'scroll' === data.value['background-attachment'] ? 'on' : 'off' ) + '" for="' + data.id + 'scroll">' + data.l10n.scroll + '</label>';
					html += '</input>';
					html += '<input ' + data.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="fixed" name="_customize-bg-' + data.id + '-attachment" id="' + data.id + 'fixed" ' + ( 'fixed' === data.value['background-attachment'] ? ' checked="checked"' : '' ) + '>';
						html += '<label class="switch-label switch-label-' + ( 'fixed' === data.value['background-attachment'] ? 'on' : 'off' ) + '" for="' + data.id + 'fixed">' + data.l10n.fixed + '</label>';
					html += '</input>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		return '<div class="kirki-control-wrapper-background">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'background' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
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
	}
};

wp.customize.controlConstructor['kirki-background'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
		    value   = _.defaults( control.setting._value, control.params['default'] ),
		    picker;

			control.container.html( kirki.control.background.template( control ) );

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
	}
} );

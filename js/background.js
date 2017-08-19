wp.customize.controlConstructor['kirki-background'] = wp.customize.Control.extend({

	/**
	 * @inheritdoc
	 */
	ready: function() {
		var control = this;

		control.addHTML();
		control.initKirkiControl();
	},

	initKirkiControl: function() {

		var control = this,
		    value   = control.getValue(),
		    picker  = control.container.find( '.kirki-color-control' );

		// Hide unnecessary controls if the value doesn't have an image.
		if ( _.isUndefined( value['background-image'] ) || '' === value['background-image'] ) {
			control.container.find( '.background-wrapper > .background-repeat' ).hide();
			control.container.find( '.background-wrapper > .background-position' ).hide();
			control.container.find( '.background-wrapper > .background-size' ).hide();
			control.container.find( '.background-wrapper > .background-attachment' ).hide();
		}

		// Color.
		picker.wpColorPicker({
			change: function() {
				setTimeout( function() {
					control.kirkiSetValue( 'background-color', picker.val() );
				}, 100 );
			}
		});

		_.each({
			'repeat': ['change', '.background-repeat select'],
			'size': ['change click', '.background-size input'],
			'position': ['change', '.background-position select'],
			'attachment': ['change click', '.background-attachment input']
		}, function( args, key ) {
			control.container.on( args[0], args[1], function() {
				control.kirkiSetValue( key, jQuery( this ).val() );
			});
		});

		// Background-Image.
		control.container.on( 'click', '.background-image-upload-button', function( e ) {
			var image = wp.media({ multiple: false }).open().on( 'select', function() {

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

				control.kirkiSetValue( 'background-image', imageUrl );
				preview      = control.container.find( '.placeholder, .thumbnail' );
				removeButton = control.container.find( '.background-image-upload-remove-button' );

				if ( preview.length ) {
					preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
				}
				if ( removeButton.length ) {
					removeButton.show();
				}
		    });

			e.preventDefault();
		});

		control.container.on( 'click', '.background-image-upload-remove-button', function( e ) {

			var preview,
			    removeButton;

			e.preventDefault();

			control.kirkiSetValue( 'background-image', '' );

			preview      = control.container.find( '.placeholder, .thumbnail' );
			removeButton = control.container.find( '.background-image-upload-remove-button' );

			// Hide unnecessary controls.
			control.container.find( '.background-wrapper > .background-repeat' ).hide();
			control.container.find( '.background-wrapper > .background-position' ).hide();
			control.container.find( '.background-wrapper > .background-size' ).hide();
			control.container.find( '.background-wrapper > .background-attachment' ).hide();

			if ( preview.length ) {
				preview.removeClass().addClass( 'placeholder' ).html( 'No file selected' );
			}
			if ( removeButton.length ) {
				removeButton.hide();
			}
		});
	},

	addHTML: function() {

		var control = this,
		    html    = '',
		    data    = control.params,
		    valueJSON;

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
						html += '<button class="button background-image-upload-remove-button' + ( ! data.value['background-image'] ? ' hidden' : '' ) + '">' + data.l10n.remove + '</button>';
						html += '<button type="button" class="button background-image-upload-button">' + data.l10n.selectFile + '</button>';
					html += '</div>';
				html += '</div>';
			html += '</div>';

			// Background Repeat.
			html += '<div class="background-repeat">';
				html += '<h4>' + data.l10n.backgroundRepeat + '</h4>';
				html += '<select ' + data.inputAttrs + '>';
					html += '<option value="no-repeat"' + ( 'no-repeat' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.noRepeat + '</option>';
					html += '<option value="no-repeat"' + ( 'repeat-all' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.repeatAll + '</option>';
					html += '<option value="no-repeat"' + ( 'repeat-x' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.repeatHor + '</option>';
					html += '<option value="no-repeat"' + ( 'repeat-y' === data.value['background-repeat'] ? ' selected' : '' ) + '>' + data.l10n.repeatVer + '</option>';
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
					});
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
					});
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

			valueJSON = JSON.stringify( data.value ).replace( /'/g, '&#39' );
			html += '<input class="background-hidden-value" type="hidden" value=\'' + valueJSON + '\' ' + data.link + '>';
		html += '</div>';

		control.container.html( html );
	},

	/**
	 * Gets the value.
	 */
	getValue: function() {

		var control = this,
		    value   = {};

		// Make sure everything we're going to need exists.
		_.each( control.params['default'], function( defaultParamValue, param ) {
			if ( false !== defaultParamValue ) {
				value[ param ] = defaultParamValue;
				if ( ! _.isUndefined( control.setting._value[ param ] ) ) {
					value[ param ] = control.setting._value[ param ];
				}
			}
		});
		_.each( control.setting._value, function( subValue, param ) {
			if ( _.isUndefined( value[ param ] ) ) {
				value[ param ] = subValue;
			}
		});
		return value;
	},

	/**
	 * Saves the value.
	 */
	kirkiSetValue: function( value, property ) {
		var control   = this,
		    input     = jQuery( '#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .background-hidden-value' ),
		    valueJSON = jQuery( input ).val(),
		    valueObj  = JSON.parse( valueJSON );

		// Set the value.
		valueObj[ property ] = value;
		control.setting.set( valueObj );
		jQuery( input ).attr( 'value', JSON.stringify( valueObj ) ).trigger( 'change' );
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
		});
		_.each( ['background-size', 'background-attachment'], function( subVal ) {
			jQuery( control.container.find( '.' + subVal + ' input[value="' + value + '"]' ) ).prop( 'checked', true );
		});
	}
});

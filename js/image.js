/* global wp, _, kirki */

kirki.control.type.image = kirki.control.type['kirki-image'] = 'imageControl';

/**
 * The HTML Template for 'image' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.imageControl = function( control ) {
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

	return '<div class="kirki-control-wrapper-image">' + html + '</div>';
};

/**
 * Changes the value visually for 'image' controls.
 *
 * @param {object} [control] The control.
 * @param {mixed}  [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.imageControl = function( control, value ) {
	var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as,
		url     = value;

	if ( _.isObject( value ) && ! _.isUndefined( value.url ) ) {
		jQuery( control.container.find( '.' + control.id + '-image' ) ).prop( 'src', value.url );
	} else if ( 'id' === saveAs && ! isNaN( value ) ) {
		wp.media.attachment( value ).fetch().then( function( mediaData ) {
			setTimeout( function() {
				jQuery( control.container.find( '.' + control.id + '-image' ) ).prop( 'src', wp.media.attachment( value ).get( 'url' ) );
			}, 500 );
		} );
	} else {
		jQuery( control.container.find( '.' + control.id + '-image' ) ).prop( 'src', value );
	}
};

wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control = this,
		    value   = _.defaults( control.setting._value, control.params['default'] );

		control.container.html( kirki.control.template.imageControl( control ) );
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

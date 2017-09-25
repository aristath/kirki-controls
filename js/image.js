/* global wp, _, kirki */
kirki.util.image = {

	initFunctions: [],

	init: function() {
		var self = this;

		self.addImage();
		self.removeImage();
		self.defaultImage();
	},

	/**
	 * Gets the HTML for an image-uploader.
	 *
	 * @since 3.1.0
	 * @param {object} [params] Parameters. See _.defaults() call inside the function for a format example.
	 * @returns string
	 */
	getHTML: function( params ) {
		var self = this,
		    html = '';

		params = _.defaults( params, {
			id: '',
			label: '',
			description: '',
			'default': '',
			l10n: {
				remove: 'Remove',
				selectFile: 'Select File',
				defaultImage: 'Default Image'
			},
			url: '',
			saveAs: 'url'
		});

		// Header markup.
		html += '<label>';
			html += '<span class="customize-control-title">' + params.label + '</span>';
			if ( params.description && '' !== params.description ) {
				html += '<span class="description customize-control-description">' + params.description + '</span>';
			}
		html += '</label>';

		// Wrapper.
		html += '<div class="wrapper">';
			html += '<div class="image">';
				html += '<div class="kirki attachment-media-view image-upload" data-save-as="' + params.saveAs + '" data-image-upload-id="' + params.id + '" data-default="' + params['default'] + '">';

					// The thumbnail.
					html += '<div class="thumbnail thumbnail-image">';
						html += '<img class="' + params.id + '-image" src="' + params.url + '" alt="" />';
					html += '</div>';
					html += '<div class="actions">';

						// Remove button.
						html += '<button class="button image-upload-remove-button' + ( ! params.url ? ' hidden' : '' ) + '">';
						 	html += params.l10n.remove;
						html += '</button> ';

						// Upload button.
						html += '<button type="button" class="button image-upload-button">';
						 	html += params.l10n.selectFile;
						html += '</button> ';

						// Default button.
						if ( '' !== params['default'] ) {
							html += '<button type="button" class="button image-default-button' + ( params.url === params['default'] ? ' hidden' : '' ) + '">';
							 	html += params.l10n.defaultImage;
							html += '</button>';
						}
					html += '</div>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		return '<div class="kirki-control-wrapper-image kirki-control-wrapper" id="kirki-control-wrapper-' + params.id + '" data-setting="' + params.id + '">' + html + '</div>';

	},

	/**
	 * Handles adding an image when the button is clicked,
	 * and then saving the value for that image.
	 *
	 * @since 3.1.0
	 * @returns {void}
	 */
	addImage: function() {
		var self = this,
		    image,
			uploadedImage,
		    value;

		// No need to run this every time, once it's init we're good for all controls.
		if ( -1 !== _.indexOf( this.initFunctions, 'addImage' ) ) {
			return;
		}
		this.initFunctions.push( 'addImage' );

		// Handles clicking the button.
		jQuery( '.kirki .image-upload-button' ).on( 'click', function( event ) {
			var wrapper      = jQuery( event.currentTarget ).parents( '.image-upload' ),
			    setting      = jQuery( wrapper ).attr( 'data-image-upload-id' ),
			    saveAs       = jQuery( wrapper ).attr( 'data-save-as' ),
			    placeholder  = jQuery( wrapper ).find( '.placeholder, .thumbnail' ),
			    removeButton = jQuery( wrapper ).find( '.image-upload-remove-button' );

			// Prevent button click from refreshing the page.
			event.preventDefault();

			// Init wp.media.
			image = wp.media( { multiple: false } ).open().on( 'select', function() {
				uploadedImage = image.state().get( 'selection' ).first();

				// Save the value.
				if ( 'id' === saveAs ) {
					value = uploadedImage.toJSON().id;
				} else if ( 'array' === saveAs ) {
					value = {
						id: uploadedImage.toJSON().id,
						url: uploadedImage.toJSON().sizes.full.url,
						width: uploadedImage.toJSON().width,
						height: uploadedImage.toJSON().height
					};
				} else {
					value = uploadedImage.toJSON().sizes.full.url;
				}

				// Add the image to the placeholder.
				if ( jQuery( placeholder ).length ) {
					jQuery( placeholder )
						.removeClass()
						.addClass( 'thumbnail thumbnail-image' )
						.html( '<img src="' + uploadedImage.toJSON().sizes.full.url + '" alt="" />' );
				}

				// Add the remove button.
				if ( jQuery( removeButton ).length ) {
					jQuery( removeButton ).show();
				}

				// Save the value.
				self.saveValue( event.currentTarget, value );
			} );
		} );
	},

	/**
	 * Handles removing an image when the button is clicked,
	 * and then saving the empty value.
	 *
	 * @since 3.1.0
	 * @returns {void}
	 */
	removeImage: function( params ) {
		var self = this,
		    value;

		// No need to run this every time, once it's init we're good for all controls.
		if ( -1 !== _.indexOf( this.initFunctions, 'removeImage' ) ) {
			return;
		}
		this.initFunctions.push( 'addImage' );

		// Handle clicking the button.
		jQuery( '.kirki .image-upload-remove-button' ).on( 'click', function( event ) {
			var wrapper      = jQuery( event.currentTarget ).parents( '.image-upload' ),
			    setting      = jQuery( wrapper ).attr( 'data-image-upload-id' ),
			    saveAs       = jQuery( wrapper ).attr( 'data-save-as' ),
			    placeholder  = jQuery( wrapper ).find( '.placeholder, .thumbnail' ),
			    removeButton = jQuery( wrapper ).find( '.image-upload-remove-button' );

			// Prevent the page-refresh.
			event.preventDefault();

			// Update the value.
			if ( 'array' === saveAs ) {
				value = {
					id: '',
					url: '',
					width: '',
					height: ''
				};
			} else {
				value = '';
			}

			// Remove image and add placeholder text.
			if ( jQuery( placeholder ).length ) {
				jQuery( placeholder )
					.removeClass()
					.addClass( 'placeholder' )
					.html( 'No file selected' );
			}

			// Hide the "Remove" button.
			if ( jQuery( removeButton ).length ) {
				jQuery( removeButton ).hide();
			}

			self.saveValue( event.currentTarget, value );
		} );
	},

	/**
	 * Handles clicking the default button.
	 *
	 * @since 3.1.0
	 * @returns {void}
	 */
	defaultImage: function() {
		var self = this,
		    value;

		// No need to run this every time, once it's init we're good for all controls.
		if ( -1 !== _.indexOf( this.initFunctions, 'removeImage' ) ) {
			return;
		}
		this.initFunctions.push( 'addImage' );

		// Handle clicking the button.
		jQuery( '.kirki .image-default-button' ).on( 'click', function( event ) {
			var wrapper       = jQuery( event.currentTarget ).parents( '.image-upload' ),
			    setting       = jQuery( wrapper ).attr( 'data-image-upload-id' ),
			    saveAs        = jQuery( wrapper ).attr( 'data-save-as' ),
			    placeholder   = jQuery( wrapper ).find( '.placeholder, .thumbnail' ),
			    defaultButton = jQuery( wrapper ).find( '.image-default-button' ),
				defaultImage  = jQuery( wrapper ).attr( 'data-default-value' );

			event.preventDefault();

			// Update the value.
			if ( 'array' === saveAs ) {
				self.saveValue( event.currentTarget, {
					id: '',
					url: defaultImage,
					width: '',
					height: ''
				} );
			} else {
				self.saveValue( event.currentTarget, defaultImage );
			}

			// Update visually.
			if ( 'array' === saveAs || 'url' === saveAs ) {
				if ( jQuery( placeholder ).length ) {
					jQuery( placeholder )
						.removeClass()
						.addClass( 'thumbnail thumbnail-image' )
						.html( '<img src="' + defaultImage + '" alt="" />' );
				}
			}

			// Hide the default button.
			if ( jQuery( defaultButton ).length ) {
				jQuery( defaultButton ).hide();
			}
		} );
	},

	/**
	 * This is a helper function.
	 * Since other controls may extend this object, using this helper allows us
	 * to override the save function depending on the needs of other control-types.
	 *
	 * @since 3.1.0
	 * @param {string}                     [element] The DOM element whose value has changed.
	 *                                               We'll use this to find the setting from its wrapper parent.
	 * @param {(string|array|bool|object)} [value]   Depends on the control-type.
	 * @param {string}                     [key]     If we only want to save an item in an object
	 *                                               we can define the key here.
	 * @returns {void}
	 */
	saveValue: function( element, value, key ) {
		kirki.setSettingValue( element, value, key );
	},

	/**
	 * Get the URL from the value.
	 * Allows us to get the image-URL if the value is formatted as an object or ID.
	 *
	 * @since 3.1.0
	 * @param {object|string|int} [value] The value.
	 * @returns string
	 */
	getURL: function( value ) {
		var url = '';

		// Handle object values.
		if ( _.isObject( value ) && ! _.isUndefined( value.url ) ) {
			return value.url;
		}

		// If not a number, then it's a URL so we can return it directly.
		if ( isNaN( value ) ) {
			return value;
		}

		// If we got this far then it's an ID.
		wp.media.attachment( value ).fetch().then( function( mediaData ) {
			setTimeout( function() {
				return wp.media.attachment( value ).get( 'url' );
			}, 300 );
		} );
	}
};

wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend({
	ready: function() {
		var control = this,
		    value   = _.defaults( control.setting._value, control.params['default'] ),
		    saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

		control._setUpSettingRootLinks();
		control._setUpSettingPropertyLinks();

		wp.customize.Control.prototype.ready.call( control );

		control.deferred.embedded.done( function() {

			// Add the HTML.
			control.container.html( kirki.util.image.getHTML( {
				id: control.id,
				label: control.params.label,
				description: control.params.description,
				'default': control.params['default'],
				l10n: control.params.l10n,
				url: kirki.util.image.getURL( control.params.value ),
				saveAs: saveAs
			} ) );

			// Init the control.
			kirki.util.image.init();
		} );
	}
} );

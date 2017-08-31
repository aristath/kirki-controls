/* global wp, _, kirki */
kirki.util.image = {

	initFunctions: [],

	/**
	 * Gets the HTML for an image-uploader.
	 *
	 * @since 3.1.0
	 * @param {object} [params] Parameters. See _.defaults() call inside the function for a format example.
	 * @returns string
	 */
	getHTML: function( params ) {
		var html = '';

		params = _.defaults( params, {
			id: '',
			'default': '',
			l10n: {
				remove: 'Remove',
				selectFile: 'Select File',
				defaultImage: 'Default Image'
			},
			url: '',
			saveAs: 'url'
		});
		html += '<div class="attachment-media-view image-upload" data-save-as="' + params.saveAs + '" data-image-upload-id="' + params.id + '" data-default="' + params['default'] + '">';

			// The thumbnail.
			html += '<div class="thumbnail thumbnail-image">';
				html += '<img class="' + params.id + '-image" src="" alt="" />';
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

		return html;
	},

	/**
	 * Handles adding an image when the button is clicked,
	 * and then saving the value for that image.
	 *
	 * @since 3.1.0
	 * @returns {void}
	 */
	addImage: function() {
		var image,
			uploadedImage,
		    value;

		// No need to run this every time, once it's init we're good for all controls.
		if ( -1 !== _.indexOf( this.initFunctions, 'addImage' ) ) {
			return;
		}
		this.initFunctions.push( 'addImage' );

		// Handles clicking the button.
		jQuery( '.image-upload-button' ).on( 'click', function( event ) {

			// Get the setting from the wrapper.
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
				kirki.util.image.saveValue( event.currentTarget, value );
			} );
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

kirki.control.image = {
	init: function( control ) {
		var value   = _.defaults( control.setting._value, control.params['default'] );

		kirki.action.run( 'kirki.control.template.before' );
		control.container.html( kirki.control.image.template( control ) );
		kirki.action.run( 'kirki.control.template.after' );
		control.kirkiSetControlValue( value );

		kirki.util.image.addImage();
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
			saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

		html += '<label>' + kirki.control.template.header( control ) + '</label>';
		html += '<div class="wrapper">';
			html += '<div class="image">';
			 	html += kirki.util.image.getHTML({
					id: control.id,
					'default': control.params['default'],
					l10n: control.params.l10n,
					url: kirki.util.image.getURL( control.params.value ),
					saveAs: saveAs
				});
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
				jQuery( kirki.util.controlContainer( control ).find( '.' + control.id + '-image' ) ).prop( 'src', value.url );
			} else if ( 'id' === saveAs && ! isNaN( value ) ) {
				wp.media.attachment( value ).fetch().then( function( mediaData ) {
					setTimeout( function() {
						jQuery( kirki.util.controlContainer( control ).find( '.' + control.id + '-image' ) ).prop( 'src', wp.media.attachment( value ).get( 'url' ) );
					}, 500 );
				} );
			} else {
				jQuery( kirki.util.controlContainer( control ).find( '.' + control.id + '-image' ) ).prop( 'src', value );
			}
		},

		save: function( control, value, property ) {
			/* TODO */
			control.setting.set( value );
		}
	},

	util: {

		removeImage: function( control ) {
			var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

			kirki.util.controlContainer( control ).on( 'click', '.image-upload-remove-button', function( e ) {
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
				if ( kirki.util.controlContainer( control ).find( '.placeholder, .thumbnail' ).length ) {
					kirki.util.controlContainer( control ).find( '.placeholder, .thumbnail' ).removeClass().addClass( 'placeholder' ).html( 'No file selected' );
				}

				// Hide the "Remove" button.
				if ( kirki.util.controlContainer( control ).find( '.image-upload-remove-button' ).length ) {
					kirki.util.controlContainer( control ).find( '.image-upload-remove-button' ).hide();
				}
			} );
		},

		defaultImage: function( control ) {
			var saveAs  = ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.save_as ) ) ? 'url' : control.params.choices.save_as;

			kirki.util.controlContainer( control ).on( 'click', '.image-default-button', function( e ) {
				e.preventDefault();

				// Update the value both in the settings and visually.
				kirki.control.image.value.save( control, control.params['default'], 'url' );
				control.kirkiSetControlValue( control.params['default'] );

				if ( kirki.util.controlContainer( control ).find( '.image-upload-remove-button' ).length ) {
					kirki.util.controlContainer( control ).find( '.image-upload-remove-button' ).show();
					kirki.util.controlContainer( control ).find( '.image-default-button' ).hide();
				}
			} );
		}
	}
};

wp.customize.controlConstructor['kirki-image'] = wp.customize.kirkiDynamicControl.extend({});

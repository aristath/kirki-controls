/* global wp, _, CodeMirror, tinyMCE, fontAwesomeJSON, kirkiAllFonts */
var kirki = {

	controlMethodNames: {
		'kirki-background': 'backgroundControl',
		'kirki-checkbox': 'checkboxControl',
		'kirki-code': 'codeControl',
		'kirki-color-palette': 'colorPaletteControl',
		'kirki-color': 'colorControl',
		'kirki-dashicons': 'dashiconsControl',
		'kirki-date': 'dateControl',
		'kirki-dimension': 'dimensionControl',
		'kirki-dimensions': 'dimensionsControl',
		'kirki-editor': 'editorControl',
		'kirki-fontawesome': 'fontawesomeControl',
		'kirki-generic': 'genericControl',
		'kirki-gradient': 'gradientControl',
		'kirki-image': 'imageControl',
		'kirki-multicheck': 'multicheckControl',
		'kirki-multicolor': 'multicolorControl',
		'kirki-number': 'numberControl',
		'kirki-palette': 'paletteControl',
		'kirki-radio-buttonset': 'radioButtonsetControl',
		'kirki-radio-image': 'radioImageControl',
		'kirki-radio': 'radioControl',
		'kirki-repeater': 'repeaterControl',
		'kirki-select': 'selectControl',
		'kirki-slider': 'sliderControl',
		'kirki-sortable': 'sortableControl',
		'kirki-switch': 'switchControl',
		'kirki-toggle': 'toggleControl',
		'kirki-typography': 'typographyControl',

		'kirki-text': 'genericControl'
	},

	control: {
		backgroundControl: {
			initKirkiControl: function() {

				var control = this,
					value   = _.defaults( control.setting._value, control.params['default'] ),
					picker;

					control.container.html( kirki.template.backgroundControl( control ) );

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
		},

		codeControl: {
			initKirkiControl: function() {

				var control  = this,
					language = ( 'html' === control.params.choices.language ) ? { name: 'htmlmixed' } : control.params.choices.language,
					element,
					editor,
					container,
					height;

				control.container.html( kirki.template.codeControl( control ) );

				element = control.container.find( '.kirki-codemirror-editor' );

				editor = CodeMirror.fromTextArea( element[0], {
					value:        control.setting._value,
					mode:         language,
					lineNumbers:  true,
					lineWrapping: true,
					theme:        control.params.choices.theme
				} );

				if ( ! _.isUndefined( control.params.choices.height ) ) {
					height = Number( control.params.choices.height );
					if ( ! isNaN( height ) ) {
						container = control.container.find( '.codemirror-kirki-wrapper' );
						jQuery( container ).css( 'max-height', function() {
							return control.params.choices.height;
						} );
						editor.setSize( null, control.params.choices.height );
					}
				}

				// On change make sure we infor the Customizer API
				editor.on( 'change', function() {
					control.setting.set( editor.getValue() );
				} );

				// Hack to refresh the editor when we open a section
				element.parents( '.accordion-section' ).on( 'click', function() {
					editor.refresh();
				} );
			}
		},

		colorControl: {
			initKirkiControl: function() {
				var control = this,
					clear,
					picker;

				control.container.html( kirki.template.colorControl( control ) );

				picker = control.container.find( '.kirki-color-control' );

				// If we have defined any extra choices, make sure they are passed-on to Iris.
				if ( ! _.isUndefined( control.params.choices ) ) {
					picker.wpColorPicker( control.params.choices );
				}

				// Tweaks to make the "clear" buttons work.
				setTimeout( function() {
					clear = control.container.find( '.wp-picker-clear' );
					clear.click( function() {
						control.setting.set( '' );
					} );
				}, 200 );

				// Saves our settings to the WP API
				picker.wpColorPicker( {
					change: function() {

						// Small hack: the picker needs a small delay
						setTimeout( function() {
							control.setting.set( picker.val() );
						}, 20 );
					}
				} );
			}
		},

		date: {
			initKirkiControl: function() {

				var control  = this,
					selector = control.selector + ' input.datepicker';

				control.container.html( kirki.template.dateControl( control ) );

				// Init the datepicker
				jQuery( selector ).datepicker();

				// Save the changes
				this.container.on( 'change keyup paste', 'input.datepicker', function() {
					control.setting.set( jQuery( this ).val() );
				} );
			}
		},

		dimensionControl: {
			initKirkiControl: function() {

				var control = this,
					value;

				control.container.html( kirki.template.dimensionControl( control ) );

				// Notifications.
				control.kirkiNotifications();

				// Save the value
				this.container.on( 'change keyup paste', 'input', function() {

					value = jQuery( this ).val();
					control.setting.set( value );
				} );
			},

			/**
			 * Handles notifications.
			 */
			kirkiNotifications: function() {

				var control = this;

				wp.customize( control.id, function( setting ) {
					setting.bind( function( value ) {
						var code = 'long_title';

						if ( false === control.kirkiValidateCSSValue( value ) ) {
							setting.notifications.add( code, new wp.customize.Notification(
								code,
								{
									type: 'warning',
									message: control.params.l10n.invalidValue
								}
							) );
						} else {
							setting.notifications.remove( code );
						}
					} );
				} );
			}
		},

		dimensionsControl: {
			initKirkiControl: function() {

				var control     = this,
					subControls = control.params.choices.controls,
					value       = {},
					subsArray   = [],
					i;

				control.container.html( kirki.template.dimensionsControl( control ) );

				_.each( subControls, function( v, i ) {
					if ( true === v ) {
						subsArray.push( i );
					}
				} );

				control.container.on( 'change keyup paste', 'input', function() {
					var choice = jQuery( this ).data( 'choice' );
					value[ choice ] = jQuery( this ).val();

					// Save the value
					control.saveValue( value );
				} );

				// Notifications.
				control.kirkiNotifications();
			},

			/**
			 * Saves the value.
			 */
			saveValue: function( value ) {

				var control  = this,
					newValue = {};

				_.each( value, function( newSubValue, i ) {
					newValue[ i ] = newSubValue;
				} );

				control.setting.set( newValue );
			},

			/**
			 * Handles notifications.
			 */
			kirkiNotifications: function() {

				var control = this;

				wp.customize( control.id, function( setting ) {
					setting.bind( function( value ) {
						var code = 'long_title',
							subs = {},
							message;

						setting.notifications.remove( code );

						_.each( value, function( subVal, key ) {
							if ( false === control.kirkiValidateCSSValue( subVal ) ) {
								subs[ key ] = control.params.l10n[ key ];
							} else {
								delete subs[ key ];
							}
						} );

						if ( ! _.isEmpty( subs ) ) {
							message = control.params.l10n['invalid-value'] + ' (' + _.values( subs ).toString() + ') ';
							setting.notifications.add( code, new wp.customize.Notification(
								code,
								{
									type: 'warning',
									message: message
								}
							) );
						} else {
							setting.notifications.remove( code );
						}
					} );
				} );
			}
		},

		editorControl: {
			initKirkiControl: function() {

				var control      = this,
					element,
					toggler,
					wpEditorArea,
					editor,
					setChange,
					content;

				control.container.html( kirki.template.editorControl( control ) );

				element      = control.container.find( 'textarea' );
				toggler      = control.container.find( '.toggle-editor' );
				wpEditorArea = jQuery( '#kirki_editor_pane textarea.wp-editor-area' );
				editor       = tinyMCE.get( 'kirki-editor' );

				// Add the button text
				toggler.html( control.params.l10n.openEditor );

				toggler.on( 'click', function() {

					// Toggle the editor.
					control.toggleEditor();

					// Change button.
					control.changeButton();

					// Add the content to the editor.
					control.setEditorContent( editor );

					// Modify the preview-area height.
					control.previewHeight();

				} );

				// Update the option from the editor contents on change.
				if ( editor ) {

					editor.onChange.add( function( ed ) {

						ed.save();
						content = editor.getContent();
						clearTimeout( setChange );
						setChange = setTimeout( function() {
							element.val( content ).trigger( 'change' );
							wp.customize.instance( control.getEditorWrapperSetting() ).set( content );
						}, 500 );
					} );
				}

				// Handle text mode.
				wpEditorArea.on( 'change keyup paste', function() {
					wp.customize.instance( control.getEditorWrapperSetting() ).set( jQuery( this ).val() );
				} );
			},

			/**
			 * Modify the button text and classes.
			 */
			changeButton: function() {

				var control = this;

				// Reset all editor buttons.
				// Necessary if we have multiple editor fields.
				jQuery( '.customize-control-kirki-editor .toggle-editor' ).html( control.params.l10n.switchEditor );

				// Change the button text & color.
				if ( false !== control.getEditorWrapperSetting() ) {
					jQuery( '.customize-control-kirki-editor .toggle-editor' ).html( control.params.l10n.switchEditor );
					jQuery( '#customize-control-' + control.getEditorWrapperSetting() + ' .toggle-editor' ).html( control.params.l10n.closeEditor );
				} else {
					jQuery( '.customize-control-kirki-editor .toggle-editor' ).html( control.params.l10n.openEditor );
				}
			},

			/**
			 * Toggle the editor.
			 */
			toggleEditor: function() {

				var control = this,
					editorWrapper = jQuery( '#kirki_editor_pane' );

				editorWrapper.removeClass();
				if ( ! control.getEditorWrapperSetting() || control.id !== control.getEditorWrapperSetting() ) {
					editorWrapper.addClass( control.id );
				} else {
					editorWrapper.addClass( 'hide' );
				}
			},

			/**
			 * Set the content.
			 */
			setEditorContent: function( editor ) {

				var control = this;

				editor.setContent( control.setting._value );
			},

			/**
			 * Gets the setting from the editor wrapper class.
			 */
			getEditorWrapperSetting: function() {

				if ( jQuery( '#kirki_editor_pane' ).hasClass( 'hide' ) ) {
					return false;
				}

				if ( jQuery( '#kirki_editor_pane' ).attr( 'class' ) ) {
					return jQuery( '#kirki_editor_pane' ).attr( 'class' );
				} else {
					return false;
				}
			},

			/**
			 * Modifies the height of the preview area.
			 */
			previewHeight: function() {
				if ( jQuery( '#kirki_editor_pane' ).hasClass( 'hide' ) ) {
					if ( jQuery( '#customize-preview' ).hasClass( 'is-kirki-editor-open' ) ) {
						jQuery( '#customize-preview' ).removeClass( 'is-kirki-editor-open' );
					}
				} else {
					if ( ! jQuery( '#customize-preview' ).hasClass( 'is-kirki-editor-open' ) ) {
						jQuery( '#customize-preview' ).addClass( 'is-kirki-editor-open' );
					}
				}
			}
		},

		fontawesomeControl: {
			initKirkiControl: function() {

				var control = this,
					icons   = jQuery.parseJSON( fontAwesomeJSON ),
					element,
					selectValue,
					select2Options = {
						data: [],
						escapeMarkup: function( markup ) {
							return markup;
						},
						templateResult: function( val ) {
							return '<i class="fa fa-lg fa-' + val.id + '" aria-hidden="true"></i>' + ' ' + val.text;
						},
						templateSelection: function( val ) {
							return '<i class="fa fa-lg fa-' + val.id + '" aria-hidden="true"></i>' + ' ' + val.text;
						}
					},
					select;

				control.container.html( kirki.template.fontawesomeControl( control ) );

				element = this.container.find( 'select' ),

				_.each( icons.icons, function( icon ) {
					select2Options.data.push( {
						id: icon.id,
						text: icon.name
					} );
				} );

				select = jQuery( element ).select2( select2Options );

				select.on( 'change', function() {
					selectValue = jQuery( this ).val();
					control.setting.set( selectValue );
				} );
				select.val( control.setting._value ).trigger( 'change' );
			}
		},

		genericControl: {
			initKirkiControl: function() {

				var control = this,
					element = control.params.choices.element ? control.params.choices.element : 'input';

				control.container.html( kirki.template.genericControl( control ) );

				// Save the value
				this.container.on( 'change keyup paste click', element, function() {
					control.setting.set( jQuery( this ).val() );
				} );
			}
		},

		gradientControl: {
			initKirkiControl: function() {

				var control      = this,
					value        = control.getValue(),
					pickerStart  = control.container.find( '.kirki-gradient-control-start' ),
					pickerEnd    = control.container.find( '.kirki-gradient-control-end' ),
					angleElement = jQuery( '.angle.gradient-' + control.id ),
					throttledAngleChange,
					throttledPositionStartChange,
					throttledPositionEndChange,
					startPositionElement = jQuery( '.position.gradient-' + control.id + '-start' ),
					endPositionElement   = jQuery( '.position.gradient-' + control.id + '-end' );

				// If we have defined any extra choices, make sure they are passed-on to Iris.
				if ( ! _.isUndefined( control.params.choices.iris ) ) {
					pickerStart.wpColorPicker( control.params.choices.iris );
					pickerEnd.wpColorPicker( control.params.choices.iris );
				}

				control.updatePreview( value );

				_.each( { 'start': pickerStart, 'end': pickerEnd }, function( obj, index ) {

					// Saves our settings to the WP API
					obj.wpColorPicker( {
						change: function() {
							setTimeout( function() {

								// Add the value to the object.
								value[ index ].color = obj.val();

								// Update the preview.
								control.updatePreview( value );

								// Set the value.
								control.setValue( value );

							}, 100 );
						}
					} );
				} );

				jQuery( control.container.find( '.global .angle' ) ).show();
				if ( ! _.isUndefined( value.mode && 'radial' === value.mode ) ) {
					jQuery( control.container.find( '.global .angle' ) ).hide();
				}

				// Mode (linear/radial).
				jQuery( control.container.find( '.mode .switch-input' ) ).on( 'click input', function() {
					value.mode = jQuery( this ).val();
					control.updatePreview( value );
					control.setValue( value );
					jQuery( control.container.find( '.global .angle' ) ).show();
					if ( 'radial' === value.mode ) {
						jQuery( control.container.find( '.global .angle' ) ).hide();
					}
				} );

				// Angle (-90° -to 90°).
				throttledAngleChange = _.throttle( function() {
					value.angle = angleElement.val();

					// Update the preview.
					control.updatePreview( value );

					// Set the value.
					control.setValue( value );
				}, 20 );
				angleElement.on( 'input change oninput', function() {
					throttledAngleChange();
				} );

				// Start Position( 0% - 100%);
				throttledPositionStartChange = _.throttle( function() {
					value.start.position = startPositionElement.val();

					// Update the preview.
					control.updatePreview( value );

					// Set the value.
					control.setValue( value );
				}, 20 );
				startPositionElement.on( 'input change oninput', function() {
					throttledPositionStartChange();
				} );

				// End Position( 0% - 100%);
				throttledPositionEndChange = _.throttle( function() {
					value.end.position = endPositionElement.val();

					// Update the preview.
					control.updatePreview( value );

					// Set the value.
					control.setValue( value );
				}, 20 );
				endPositionElement.on( 'input change oninput', function() {
					throttledPositionEndChange();
				} );
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
				} );
				_.each( control.setting._value, function( subValue, param ) {
					if ( ! _.isUndefined( value[ param ] ) ) {
						value[ param ] = subValue;
					}
				} );
				return value;
			},

			/**
			 * Updates the preview area.
			 */
			updatePreview: function( value ) {
				var control     = this,
					previewArea = control.container.find( '.gradient-preview' );

				if ( ! _.isUndefined( value.mode ) && 'radial' === value.mode ) {
					jQuery( previewArea ).css(
						'background',
						'radial-gradient(ellipse at center, ' + value.start.color + ' ' + value.start.position + '%,' + value.end.color + ' ' + value.end.position + '%)'
					);
				} else {
					jQuery( previewArea ).css(
						'background',
						'linear-gradient(' + value.angle + 'deg, ' + value.start.color + ' ' + value.start.position + '%,' + value.end.color + ' ' + value.end.position + '%)'
					);
				}
			},

			/**
			 * Saves the value.
			 */
			setValue: function( value ) {

				var control = this;

				wp.customize( control.id, function( obj ) {

					// Reset the setting value, so that the change is triggered
					obj.set( '' );

					// Set the right value
					obj.set( value );

				} );
			}
		},

		imageControl: {
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
		},

		multicheckControl: {
			initKirkiControl: function() {

				var control = this;

				control.container.html( kirki.template.multicheckControl( control ) );

				// Save the value
				control.container.on( 'change', 'input', function() {
					var value = [],
						i = 0;

					// Build the value as an object using the sub-values from individual checkboxes.
					jQuery.each( control.params.choices, function( key ) {
						if ( control.container.find( 'input[value="' + key + '"]' ).is( ':checked' ) ) {
							value[ i ] = key;
							i++;
						}
					} );

					// Update the value in the customizer.
					control.setting.set( value );
				} );
			}
		},

		multicolorControl: {
			initKirkiControl: function() {
				var control = this,
					colors  = control.params.choices,
					keys    = Object.keys( colors ),
					value   = this.params.value,
					i       = 0,
					target,
					irisInput,
					irisPicker;

				control.container.html( kirki.template.multicolorControl( control ) );
				target = control.container.find( '.iris-target' );

				// Colors loop.
				while ( i < Object.keys( colors ).length ) {

					control.kirkiMulticolorChangeHandler( this, value, keys[ i ] );

					// Move colorpicker to the 'iris-target' container div
					irisInput  = control.container.find( '.wp-picker-container .wp-picker-input-wrap' ),
					irisPicker = control.container.find( '.wp-picker-container .wp-picker-holder' );
					jQuery( irisInput[0] ).detach().appendTo( target[0] );
					jQuery( irisPicker[0] ).detach().appendTo( target[0] );

					i++;
				}
			},

			// Proxy function that handles changing the individual colors
			kirkiMulticolorChangeHandler: function( control, value, subSetting ) {

				var colors  = control.params.choices,
					target = control.container.find( '.iris-target' ),
					picker = control.container.find( '.multicolor-index-' + subSetting ),
					args   = {
						target: target[0],
						change: function() {
							setTimeout( function() {

								// Set the value.
								control.kirkiSetValue( picker.val(), subSetting );

								// Trigger the change.
								control.container.find( '.multicolor-index-' + subSetting ).trigger( 'change' );
							}, 100 );
						}
					};

				if ( _.isObject( colors.irisArgs ) ) {
					_.each( colors.irisArgs, function( irisValue, irisKey ) {
						args[ irisKey ] = irisValue;
					} );
				}

				// Did we change the value?
				picker.wpColorPicker( args );
			}
		},

		numberControl: {
			initKirkiControl: function() {

				var control = this,
					step    = 1,
					element;

				control.params.choices = _.defaults( control.params.choices, {
					min: -99999,
					max: 99999,
					step: 1
				} );

				control.container.html( kirki.template.numberControl( control ) );

				element = this.container.find( 'input' );

				// Set step value.
				if ( ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.step ) ) {
					step = ( 'any' === control.params.choices.step ) ? '0.001' : control.params.choices.step;
				}

				// Init the spinner
				jQuery( element ).spinner( control.params.choices );

				// On change
				this.container.on( 'change click keyup paste', 'input', function() {
					control.setting.set( jQuery( this ).val() );
				} );

				// Notifications.
				control.kirkiNotifications();
			},

			/**
			 * Handles notifications.
			 */
			kirkiNotifications: function() {

				var control = this;

				wp.customize( control.id, function( setting ) {
					setting.bind( function( value ) {
						var code    = 'long_title',
							min     = ( ! _.isUndefined( control.params.choices.min ) ) ? Number( control.params.choices.min ) : false,
							max     = ( ! _.isUndefined( control.params.choices.max ) ) ? Number( control.params.choices.max ) : false,
							step    = ( ! _.isUndefined( control.params.choices.step ) ) ? Number( control.params.choices.step ) : false,
							invalid = false;

						// Make sure value is a number.
						value = Number( value );

						if ( false !== min && value < min ) {
							invalid = 'minError';
						} else if ( false !== max && value > max ) {
							invalid = 'maxError';
						} else if ( false !== step && false !== min && ! Number.isInteger( ( value - min ) / step ) ) {
							invalid = 'stepError';
						}

						if ( false !== invalid ) {
							setting.notifications.add( code, new wp.customize.Notification( code, {
								type: 'warning',
								message: control.params.l10n[ invalid ]
							} ) );
						} else {
							setting.notifications.remove( code );
						}
					} );
				} );
			}
		},

		presetControl: {
			initKirkiControl: function() {

				var control = this,
					selectValue;

				// Trigger a change
				this.container.on( 'change', 'select', function() {

					// Get the control's value
					selectValue = jQuery( this ).val();

					// Update the value using the customizer API and trigger the "save" button
					control.setting.set( selectValue );

					// We have to get the choices of this control
					// and then start parsing them to see what we have to do for each of the choices.
					jQuery.each( control.params.choices, function( key, value ) {

						// If the current value of the control is the key of the choice,
						// then we can continue processing, Otherwise there's no reason to do anything.
						if ( selectValue === key ) {

							// Each choice has an array of settings defined in it.
							// We'll have to loop through them all and apply the changes needed to them.
							jQuery.each( value.settings, function( presetSetting, presetSettingValue ) {
								wp.customize.settings.controls[ presetSetting ].kirkiSetControlValue( presetSettingValue );
							} );
						}
					} );
					wp.customize.previewer.refresh();
				} );
			}
		},

		repeaterControl: {
			initKirkiControl: function() {
				var control     = this;

				control.container.html( kirki.template.repeaterControl( control ) );

				control.repeaterRowAddButton();
				control.repeaterRowRemoveButton();
				control.repeaterRowSortableAccordion();

			},

			/**
			 * Actions to run when clicking on the "add row" button.
			 */
			repeaterRowAddButton: function() {
				var control = this,
					rowDefaults = {};

				_.each( control.params.fields, function( field, key ) {
					rowDefaults[ key ] = ( ! _.isUndefined( field['default'] ) ) ? field['default'] : '';
				} );

				control.container.find( '.add-row' ).click( function( e ) {
					e.preventDefault();
					jQuery( control.container.find( '.repeater-rows' ) )
						.append( kirki.template.repeaterControlRow( control, rowDefaults ) );
				});

				control.repeaterRowSortableAccordion();
			},

			/**
			 * Actions to run when clicking on the "remove row" button.
			 */
			repeaterRowRemoveButton: function() {
				var control = this;

				control.container.find( '.action.trash' ).click( function( e ) {
					jQuery( this ).parents( '.repeater-row' ).remove();
				});
			},

			/**
			 * Sortable.
			 */
			repeaterRowSortableAccordion: function() {
				var control = this;

				jQuery( control.container.find( '.repeater-rows' ) ).accordion({
					header: '> .repeater-row > .row-header',
					collapsible: true,
					animate: 150
				}).sortable({
					axis: 'y',
					handle: '.action.move',
					stop: function( event, ui ) {
						ui.item.children( '.action.move' ).triggerHandler( 'focusout' );
						jQuery( this ).accordion( 'refresh' );
					}
				});
			}
		},

		selectControl: {
			initKirkiControl: function() {

				var control  = this,
					element,
					multiple,
					selectValue,
					select2Options = {
						escapeMarkup: function( markup ) {
							return markup;
						}
					};

				if ( ! control.params.choices ) {
					return;
				}
				if ( 1 < control.params.multiple && control.params.value && _.isString( control.params.value ) ) {
					control.params.value = [ control.params.value ];
				}

				control.container.html( kirki.template.selectControl( control ) );

				element  = this.container.find( 'select' );
				multiple = parseInt( element.data( 'multiple' ), 10 );

				if ( 1 < multiple ) {
					select2Options.maximumSelectionLength = multiple;
				}
				jQuery( element ).select2( select2Options ).on( 'change', function() {
					selectValue = jQuery( this ).val();
					control.setting.set( selectValue );
				} );
			}
		},

		sliderControl: {
			initKirkiControl: function() {
				var control = this,
					value,
					thisInput,
					inputDefault,
					changeAction;

				control.container.html( kirki.template.sliderControl( control ) );

				// Update the text value
				jQuery( 'input[type=range]' ).on( 'mousedown', function() {
					value = jQuery( this ).attr( 'value' );
					jQuery( this ).mousemove( function() {
						value = jQuery( this ).attr( 'value' );
						jQuery( this ).closest( 'label' ).find( '.kirki_range_value .value' ).text( value );
					} );
				} );

				// Handle the reset button
				jQuery( '.kirki-slider-reset' ).click( function() {
					thisInput    = jQuery( this ).closest( 'label' ).find( 'input' );
					inputDefault = thisInput.data( 'reset_value' );
					thisInput.val( inputDefault );
					thisInput.change();
					jQuery( this ).closest( 'label' ).find( '.kirki_range_value .value' ).text( inputDefault );
				} );

				changeAction = ( 'postMessage' === control.setting.transport ) ? 'mousemove change' : 'change';

				// Save changes.
				control.container.on( changeAction, 'input', function() {
					control.setting.set( jQuery( this ).val() );
				} );
			}
		},

		sortableControl: {
			initKirkiControl: function() {
				var control = this;

				control.container.html( kirki.template.sortableControl( control ) );

				control.container.find( '.kirki-controls-loading-spinner' ).hide();

				// Set the sortable container.
				control.sortableContainer = control.container.find( 'ul.sortable' ).first();

				// Init sortable.
				control.sortableContainer.sortable( {

					// Update value when we stop sorting.
					stop: function() {
						control.kirkiSetValue();
					}
				} ).disableSelection().find( 'li' ).each( function() {

					// Enable/disable options when we click on the eye of Thundera.
					jQuery( this ).find( 'i.visibility' ).click( function() {
						jQuery( this ).toggleClass( 'dashicons-visibility-faint' ).parents( 'li:eq(0)' ).toggleClass( 'invisible' );
					} );
				} ).click( function() {

					// Update value on click.
					control.kirkiSetValue();
				} );
			},

			/**
			 * Updates the sorting list
			 */
			kirkiSetValue: function() {
				var control = this,
					newValue = [];

				this.sortableContainer.find( 'li' ).each( function() {
					if ( ! jQuery( this ).is( '.invisible' ) ) {
						newValue.push( jQuery( this ).data( 'value' ) );
					}
				} );
				control.setting.set( newValue );
			}
		},

		switchControl: {
			initKirkiControl: function() {
				var control       = this,
					checkboxValue = control.setting._value,
					html          = '',
					on,
					off;

				control.container.html( kirki.template.switchControl( control ) );

				on  = jQuery( control.container.find( '.switch-on' ) );
				off = jQuery( control.container.find( '.switch-off' ) );

				// CSS modifications depending on label sizes.
				jQuery( control.container.find( '.switch label ' ) ).css( 'width', ( on.width() + off.width() + 40 ) + 'px' );
				jQuery( '#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) ).append(
					'<style>#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch label:after{width:' + ( on.width() + 13 ) + 'px;}#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .switch input:checked + label:after{left:' + ( on.width() + 22 ) + 'px;width:' + ( off.width() + 13 ) + 'px;}</style>'
				);

				// Save the value
				this.container.on( 'change', 'input', function() {
					checkboxValue = ( jQuery( this ).is( ':checked' ) ) ? true : false;
					control.setting.set( checkboxValue );
				} );
			},

			kirkiSetValue: function( value ) {
				kirki.setValue.checkboxControl( this, value );
			}
		},

		toggleControl: {
			kirkiSetValue: function( value ) {
				kirki.setValue.checkboxControl( this, value );
			}
		},

		typographyControl: {
			initKirkiControl: function() {
				var control = this;

				// If kirkiAllFonts is not defined,
				// then get the fonts using an ajax call.
				if ( _.isUndefined( window.kirkiAllFonts ) && _.isUndefined( window[ 'kirkiFonts' + control.id ] ) ) {
					jQuery.post( control.params.ajaxurl, { 'action': 'kirki_get_googlefonts_ajax' }, function( response ) {
						window.kirkiAllFonts = JSON.parse( response );
						control.initKirkiTypographyControl();
					} );
					return;
				}

				// If we're here then kirkiAllFonts is already defined.
				control.initKirkiTypographyControl();
			},

			initKirkiTypographyControl: function() {
				var control               = this,
					textTransformSelector = control.selector + ' .text-transform select',
					value                 = control.getValue(),
					picker;

				control.container.html( control.getHTML( control ) );

				control.renderFontSelector();
				control.renderBackupFontSelector();
				control.renderVariantSelector();
				control.renderSubsetSelector();

				// Font-size.
				this.container.on( 'change keyup paste', '.font-size input', function() {
					control.saveValue( 'font-size', jQuery( this ).val() );
				} );

				// Line-height.
				this.container.on( 'change keyup paste', '.line-height input', function() {
					control.saveValue( 'line-height', jQuery( this ).val() );
				} );

				// Margin-top.
				this.container.on( 'change keyup paste', '.margin-top input', function() {
					control.saveValue( 'margin-top', jQuery( this ).val() );
				} );

				// Margin-bottom.
				this.container.on( 'change keyup paste', '.margin-bottom input', function() {
					control.saveValue( 'margin-bottom', jQuery( this ).val() );
				} );

				// Letter-spacing.
				value['letter-spacing'] = ( jQuery.isNumeric( value['letter-spacing'] ) ) ? value['letter-spacing'] + 'px' : value['letter-spacing'];
				this.container.on( 'change keyup paste', '.letter-spacing input', function() {
					value['letter-spacing'] = ( jQuery.isNumeric( jQuery( this ).val() ) ) ? jQuery( this ).val() + 'px' : jQuery( this ).val();
					control.saveValue( 'letter-spacing', value['letter-spacing'] );
				} );

				// Word-spacing.
				this.container.on( 'change keyup paste', '.word-spacing input', function() {
					control.saveValue( 'word-spacing', jQuery( this ).val() );
				} );

				this.container.on( 'change', '.text-align input', function() {
					control.saveValue( 'text-align', jQuery( this ).val() );
				} );

				// Text-transform
				jQuery( textTransformSelector ).select2().on( 'change', function() {
					control.saveValue( 'text-transform', jQuery( this ).val() );
				} );

				picker = this.container.find( '.kirki-color-control' );

				// Change color
				picker.wpColorPicker( {
					change: function() {
						setTimeout( function() {
							control.saveValue( 'color', picker.val() );
						}, 100 );
					}
				} );
			},

			/**
			 * Adds the font-families to the font-family dropdown
			 * and instantiates select2.
			 */
			renderFontSelector: function() {

				var control         = this,
					selector        = control.selector + ' .font-family select',
					data            = [],
					standardFonts   = [],
					googleFonts     = [],
					value           = control.getValue(),
					fonts           = control.getFonts(),
					fontSelect;

				// Format standard fonts as an array.
				if ( ! _.isUndefined( fonts.standard ) ) {
					_.each( fonts.standard, function( font ) {
						standardFonts.push( {
							id: font.family.replace( /&quot;/g, '&#39' ),
							text: font.label
						} );
					} );
				}

				// Format google fonts as an array.
				if ( ! _.isUndefined( fonts.standard ) ) {
					_.each( fonts.google, function( font ) {
						googleFonts.push( {
							id: font.family,
							text: font.label
						} );
					} );
				}

				// Combine forces and build the final data.
				data = [
					{ text: 'Standard Fonts', children: standardFonts },
					{ text: 'Google Fonts',   children: googleFonts }
				];

				// Instantiate select2 with the data.
				fontSelect = jQuery( selector ).select2( {
					data: data
				} );

				// Set the initial value.
				if ( value['font-family'] ) {
					fontSelect.val( value['font-family'].replace( /'/g, '"' ) ).trigger( 'change' );
				}

				// When the value changes
				fontSelect.on( 'change', function() {

					// Set the value.
					control.saveValue( 'font-family', jQuery( this ).val() );

					// Re-init the font-backup selector.
					control.renderBackupFontSelector();

					// Re-init variants selector.
					control.renderVariantSelector();

					// Re-init subsets selector.
					control.renderSubsetSelector();
				} );
			},

			/**
			 * Adds the font-families to the font-family dropdown
			 * and instantiates select2.
			 */
			renderBackupFontSelector: function() {

				var control       = this,
					selector      = control.selector + ' .font-backup select',
					standardFonts = [],
					value         = control.getValue(),
					fontFamily    = value['font-family'],
					variants      = control.getVariants( fontFamily ),
					fonts         = control.getFonts(),
					fontSelect;

				if ( _.isUndefined( value['font-backup'] ) || null === value['font-backup'] ) {
					value['font-backup'] = '';
				}

				// Hide if we're not on a google-font.
				if ( false !== variants ) {
					jQuery( control.selector + ' .font-backup' ).show();
				} else {
					jQuery( control.selector + ' .font-backup' ).hide();
				}

				// Format standard fonts as an array.
				if ( ! _.isUndefined( fonts.standard ) ) {
					_.each( fonts.standard, function( font ) {
						standardFonts.push( {
							id: font.family.replace( /&quot;/g, '&#39' ),
							text: font.label
						} );
					} );
				}

				// Instantiate select2 with the data.
				fontSelect = jQuery( selector ).select2( {
					data: standardFonts
				} );

				// Set the initial value.
				fontSelect.val( value['font-backup'].replace( /'/g, '"' ) ).trigger( 'change' );

				// When the value changes
				fontSelect.on( 'change', function() {

					// Set the value.
					control.saveValue( 'font-backup', jQuery( this ).val() );
				} );
			},

			/**
			 * Renders the variants selector using select2
			 * Displays font-variants for the currently selected font-family.
			 */
			renderVariantSelector: function() {

				var control    = this,
					value      = control.getValue(),
					fontFamily = value['font-family'],
					variants   = control.getVariants( fontFamily ),
					selector   = control.selector + ' .variant select',
					data       = [],
					isValid    = false,
					fontWeight,
					variantSelector,
					fontStyle;

				if ( false !== variants ) {
					jQuery( control.selector + ' .variant' ).show();
					_.each( variants, function( variant ) {
						if ( value.variant === variant.id ) {
							isValid = true;
						}
						data.push( {
							id: variant.id,
							text: variant.label
						} );
					} );
					if ( ! isValid ) {
						value.variant = 'regular';
					}

					if ( jQuery( selector ).hasClass( 'select2-hidden-accessible' ) ) {
						jQuery( selector ).select2( 'destroy' );
						jQuery( selector ).empty();
					}

					// Instantiate select2 with the data.
					variantSelector = jQuery( selector ).select2( {
						data: data
					} );
					variantSelector.val( value.variant ).trigger( 'change' );
					variantSelector.on( 'change', function() {
						control.saveValue( 'variant', jQuery( this ).val() );

						fontWeight = ( ! _.isString( value.variant ) ) ? '400' : value.variant.match( /\d/g );
						fontWeight = ( ! _.isObject( fontWeight ) ) ? '400' : fontWeight.join( '' );
						fontStyle  = ( -1 !== value.variant.indexOf( 'italic' ) ) ? 'italic' : 'normal';

						control.saveValue( 'font-weight', fontWeight );
						control.saveValue( 'font-style', fontStyle );
					} );
				} else {
					jQuery( control.selector + ' .variant' ).hide();
				}
			},

			/**
			 * Renders the subsets selector using select2
			 * Displays font-subsets for the currently selected font-family.
			 */
			renderSubsetSelector: function() {

				var control    = this,
					value      = control.getValue(),
					fontFamily = value['font-family'],
					subsets    = control.getSubsets( fontFamily ),
					selector   = control.selector + ' .subsets select',
					data       = [],
					validValue = value.subsets,
					subsetSelector;

				if ( false !== subsets ) {
					jQuery( control.selector + ' .subsets' ).show();
					_.each( subsets, function( subset ) {

						if ( _.isObject( validValue ) ) {
							if ( -1 === validValue.indexOf( subset.id ) ) {
								validValue = _.reject( validValue, function( subValue ) {
									return subValue === subset.id;
								} );
							}
						}

						data.push( {
							id: subset.id,
							text: subset.label
						} );
					} );

				} else {
					jQuery( control.selector + ' .subsets' ).hide();
				}

				if ( jQuery( selector ).hasClass( 'select2-hidden-accessible' ) ) {
					jQuery( selector ).select2( 'destroy' );
					jQuery( selector ).empty();
				}

				// Instantiate select2 with the data.
				subsetSelector = jQuery( selector ).select2( {
					data: data
				} );
				subsetSelector.val( validValue ).trigger( 'change' );
				subsetSelector.on( 'change', function() {
					control.saveValue( 'subsets', jQuery( this ).val() );
				} );
			},

			/**
			 * Get fonts.
			 */
			getFonts: function() {
				var control = this;

				if ( ! _.isUndefined( window[ 'kirkiFonts' + control.id ] ) ) {
					return window[ 'kirkiFonts' + control.id ];
				}
				if ( ! _.isUndefined( kirkiAllFonts ) ) {
					return kirkiAllFonts;
				}
				return {
					google: [],
					standard: []
				};
			},

			/**
			 * Get variants for a font-family.
			 */
			getVariants: function( fontFamily ) {
				var control = this,
					fonts   = control.getFonts();

				var variants = false;
				_.each( fonts.standard, function( font ) {
					if ( fontFamily && font.family === fontFamily.replace( /'/g, '"' ) ) {
						variants = font.variants;
						return font.variants;
					}
				} );

				_.each( fonts.google, function( font ) {
					if ( font.family === fontFamily ) {
						variants = font.variants;
						return font.variants;
					}
				} );
				return variants;
			},

			/**
			 * Get subsets for a font-family.
			 */
			getSubsets: function( fontFamily ) {

				var control = this,
					subsets = false,
					fonts   = control.getFonts();

				_.each( fonts.google, function( font ) {
					if ( font.family === fontFamily ) {
						subsets = font.subsets;
					}
				} );
				return subsets;
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
					sumValue = control.getValue();

				sumValue[ property ] = value;

				wp.customize( control.id, function( obj ) {

					// Reset the setting value, so that the change is triggered
					obj.set( '' );

					// Set the right value
					obj.set( sumValue );
				} );
			}
		}
	},

	/**
	 * An object containing the templates for controls.
	 */
	template: {

		/**
		 * The HTML Template for 'background' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		backgroundControl: function( control ) {

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

		/**
		 * The HTML Template for 'checkbox' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		checkboxControl: function( control ) {
			var html    = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="codemirror-kirki-wrapper">';
					html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-checkbox">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'code' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		codeControl: function( control ) {
			var html    = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="codemirror-kirki-wrapper">';
					html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-code">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'color-palette' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		colorPaletteControl: function( control ) {
			var html    = '',
				inputWrapperClasses;

			if ( ! control.params.choices ) {
				return;
			}
			control.params.choices = _.defaults( control.params.choices, {
				style: 'square',
				'box-shadow': '',
				margin: false
			});

			inputWrapperClasses  = 'colors-wrapper ' + control.params.choices.style + ( ( true === control.params.choices['box-shadow'] ) ? ' box-shadow' : '' ) + ( inputWrapperClasses += ( true === control.params.choices.margin ) ? ' with-margin' : '' );

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div id="input_' + control.id + '" class="' + inputWrapperClasses + '">';
			_.each( control.params.choices.colors, function( val, key ) {
				html += '<input type="radio" ' + control.params.inputAttrs + ' value="' + val + '" name="_customize-color-palette-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === val ? ' checked' : '' ) + '>';
					html += '<label for="' + control.id + key + '" style="width:' + control.params.choices.size + 'px; height:' + control.params.choices.size + 'px;">';
						html += '<span class="color-palette-color" style="background:' + val + ';">' + val + '</span>';
					html += '</label>';
				html += '</input>';
			} );
			html += '</div>';

			return '<div class="kirki-control-wrapper-color-palette">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'color' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		colorControl: function( control ) {
			var html    = '';

			html  = '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<input type="text" ' + control.params.inputAttrs + ' data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value + '" class="kirki-color-control" ' + control.params.link + ' />';
			html += '</label>';

			return '<div class="kirki-control-wrapper-color">' + html + '</div>';

		},

		/**
		 * The HTML Template for 'dashicons' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		dashiconsControl: function( control ) {
			var html    = '',
				data    = control.params,
				cats    = ['admin-menu', 'welcome-screen', 'post-formats', 'media', 'image-editing', 'tinymce', 'posts', 'sorting', 'social', 'wordpress_org', 'products', 'taxonomies', 'widgets', 'notifications', 'misc'];

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + data.description + '</span>';
			html += '<div class="icons-wrapper">';
				if ( ! _.isUndefined( data.choices ) && 1 < _.size( data.choices ) ) {
					_.each( data.choices, function( val, key ) {
						html += '<input ' + data.inputAttrs + ' class="dashicons-select" type="radio" value="' + key + '" name="_customize-dashicons-radio-' + data.id + '" id="' + data.id + key + '" ' + data.link + ( data.value === key ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + data.id + key + '"><span class="dashicons dashicons-' + data.choices[ key ] + '"></span></label>';
						html += '</input>';
					} );
				} else {
					_.each( cats, function( cat ) {
						html += '<h4>' + data.l10n[ cat ] + '</h4>';
						_.each( data.icons[ cat ], function( val, key ) {
							html += '<input ' + data.inputAttrs + ' class="dashicons-select" type="radio" value="' + val + '" name="_customize-dashicons-radio-' + data.id + '" id="' + data.id + val + '" ' + data.link + ( data.value === val ? ' checked="checked"' : '' ) + '>';
								html += '<label for="' + data.id + val + '"><span class="dashicons dashicons-' + val + '"></span></label>';
							html += '</input>';
						} );
					} );
				}
			html += '</div>';

			return '<div class="kirki-control-wrapper-dashicons">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'date' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		dateControl: function( control ) {
			var html = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="customize-control-content">';
					html += '<input ' + control.params.inputAttrs + ' class="datepicker" type="text" id="' + control.params.id + '" value="' + control.params.value + '" ' + control.params.link + '/>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-date">' + html + '</div>';

		},

		/**
		 * The HTML Template for 'dimension' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		dimensionControl: function( control ) {
			var html = '';

			html += '<label class="customizer-text">';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="input-wrapper">';
					html += '<input type="text" ' + control.params.inputAttrs + 'value="' + control.params.value.replace( '%%', '%' ) + '"/>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-dimension">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'dimensions' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		dimensionsControl: function( control ) {
			var html = '';

			control.params = _.defaults( control.params, {
				label: '',
				description: '',
				'default': {},
				choices: {},
				value: {}
			} );
			control.params.value = _.defaults( control.params.value, control.params['default'] );

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="wrapper">';
					html += '<div class="control">';
						_.each( control.params['default'], function( choiceVal, choiceKey ) {
							html += '<div class="' + choiceKey + '">';
								html += '<h5>';
									if ( ! _.isUndefined( control.params.choices.labels ) && ! _.isUndefined( control.params.choices.labels[ choiceKey ] ) ) {
										html += control.params.choices.labels[ choiceKey ];
									} else if ( ! _.isUndefined( control.params.l10n[ choiceKey ] ) ) {
										html += control.params.l10n[ choiceKey ];
									} else {
										html += choiceKey;
									}
								html += '</h5>';
								html += '<div class="' + choiceKey + ' input-wrapper">';
									html += '<input type="text" ' + control.params.inputAttrs + ' data-choice="' + choiceKey + '" value="' + control.params.value[ choiceKey ].replace( '%%', '%' ) + '"/>';
								html += '</div>';
							html += '</div>';
						} );
					html += '</div>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-dimensions">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'editor' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		editorControl: function( control ) {
			var html = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="customize-control-content">';
					html += '<a href="#" class="button button-primary toggle-editor"></a>';
					html += '<textarea ' + control.params.inputAttrs + ' class="hidden" ' + control.params.link + '>' + control.params.value + '</textarea>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-editor">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'fontawesome' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		fontawesomeControl: function( control ) {
			var html = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<select ' + control.params.inputAttrs + ' ' + control.params.link + '</select>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-fontawesome">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'text', 'textarea', 'email' and other generic controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		genericControl: function( control ) {
			var element = control.params.choices.element ? control.params.choices.element : 'input',
				html    = '',
				extras  = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="customize-control-content">';
					if ( 'textarea' === control.params.choices.element ) {
						_.each( control.params.choices, function( value, key ) {
							extras += ' ' + key + '="' + value + '"';
						} );
						html += '<textarea ' + control.params.inputAttrs + ' ' + control.params.link + extras + '>' + control.params.value + '</textarea>';
					} else {
						html += '<' + element + ' value="' + control.params.value + '" ' + control.params.link + control.params.inputAttrs + ' ';
						_.each( control.params.choices, function( value, key ) {
							html += key += '"' + value + '"';
						} );
						if ( control.params.choices.content ) {
							html += '>' + control.params.choices.content + '</' + element + '>';
						} else {
							html += '/>';
						}
					}
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-generic">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'image' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		imageControl: function( control ) {
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
		},

		/**
		 * The HTML Template for 'multicheck' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		multicheckControl: function( control ) {

			var html = '';

			if ( ! control.params.choices ) {
				return;
			}

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';

			html += '<ul>';
				_.each( control.params.choices, function( val, key ) {
					html += '<li><label><input ' + control.params.inputAttrs + ' type="checkbox" value="' + key + '"' + ( _.contains( control.params.value, key ) ? ' checked' : '' ) + '/>' + val + '</label></li>';
				} );
			html += '</ul>';

			return '<div class="kirki-control-wrapper-multicheck">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'multicolor' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		multicolorControl: function( control ) {
			var html = '';

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="multicolor-group-wrapper">';
				_.each( control.params.choices, function( val, key ) {
					if ( 'irisArgs' !== key ) {
						html += '<div class="multicolor-single-color-wrapper">';
							html += ( val ) ? '<label for="' + control.id + '-' + key + '">' + val + '</label>' : '';
							html += '<input ' + control.params.inputAttrs + ' id="' + control.id + '-' + key + '" type="text" data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'][ key ] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value[ key ] + '" class="kirki-color-control color-picker multicolor-index-' + key + '" />';
						html += '</div>';
					}
				} );
			html += '</div>';
			html += '<div class="iris-target"></div>';

			return '<div class="kirki-control-wrapper-multicolor">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'number' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		numberControl: function( control ) {
			var html = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="customize-control-content">';
					html += '<input ' + control.params.inputAttrs + ' type="text" ' + control.params.link + ' value="' + control.params.value + '" />';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-number">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'palette' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		paletteControl: function( control ) {
			var html = '';

			if ( ! control.params.choices ) {
				return;
			}
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div id="input_' + control.params.id + '" class="buttonset">';
			_.each( control.params.choices, function( colors, key ) {
				html += '<input ' + control.params.inputAttrs + ' type="radio" value="' + key + '" name="_customize-palette-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === key ? ' checked' : '' ) + '>';
					html += '<label for="' + control.id + key + '">';
						_.each( colors, function( color ) {
							html += '<span style="background:' + color + '">' + color + '</span>';
						} );
					html += '</label>';
				html += '</input>';
			} );
			html += '</div>';

			return '<div class="kirki-control-wrapper-palette">' + html + '</div>';

		},

		/**
		 * The HTML Template for 'radio-buttonset' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		radioButtonsetControl: function( control ) {
			var html = '';

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div id="input_' + control.id + '" class="buttonset">';
				_.each( control.params.choices, function( value, key ) {
					html += '<input ' + control.params.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( key === control.params.value ? ' checked="checked"' : '' ) + '>';
						html += '<label class="switch-label switch-label-' + ( key === control.params.value ? 'on' : 'off' ) + '" for="' + control.id + key + '">' + value + '</label>';
					html += '</input>';
				} );
			html += '</div>';

			return '<div class="kirki-control-wrapper-radio-buttonset">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'radio-image' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		radioImageControl: function( control ) {
			var html = '';

			html += '<label class="customizer-text">';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '</label>';
			html += '<div id="input_' + control.id + '" class="image">';
				_.each( control.params.choices, function( value, key ) {
					var dataAlt = ( _.isObject( value ) && ! _.isUndefined( value.alt ) ) ? value.alt : '';
					html += '<input ' + control.params.inputAttrs + ' class="image-select" type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === key ? ' checked="checked"' : '' ) + ' data-alt="' + dataAlt + '">';
						html += '<label for="' + control.id + key + '" ' + control.params.labelStyle + ' class="' + control.id + key + '">';
							if ( _.isObject( value ) ) {
								html += '<img src="' + value.src + '" alt="' + value.alt + '">';
								html += '<span class="image-label"><span class="inner">' + value.alt + '</span></span>';
							} else {
								html += '<img src="' + value + '">';
							}
							html += '<span class="image-clickable"></span>';
						html += '</label>';
					html += '</input>';
				} );
			html += '</div>';

			return '<div class="kirki-control-wrapper-radio-image">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'radio' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		radioControl: function( control ) {
			var html = '';

			if ( ! control.params.choices ) {
				return;
			}

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			_.each( control.params.choices, function( value, key ) {
				html += '<label>';
					html += '<input ' + control.params.inputAttrs + ' type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" ' + control.params.link + ( control.params.value === key ? ' checked' : '' ) + '/>';
					if ( _.isArray( value ) ) {
						html += value[0] + '<span class="option-description">' + value[1] + '</span>';
					} else {
						html += value;
					}
				html += '</label>';
			} );

			return '<div class="kirki-control-wrapper-radio">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'repeater' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		repeaterControl: function( control ) {
			var html = '';

			if ( ! control.params.fields ) {
				return;
			}
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';

			html += '<ul class="repeater-rows">';
				_.each( control.params.value, function( rowValue, key ) {
					html += kirki.template.repeaterControlRow( control, rowValue, key );
				} );
			html += '</ul>';

			html += '<button class="add-row button"><span class="dashicons dashicons-plus"></span> Add Row</button>';

			return '<div class="kirki-control-wrapper-repeater">' + html + '</div>';
		},

		/**
		 * The HTML Template for a single row inside a repeater control.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		repeaterControlRow: function( control, value, rowKey ) {
			var rowTemplate = '';

			rowTemplate = '<li class="repeater-row">';
				rowTemplate += '<div class="row-header">';
					rowTemplate += 'Row Title';
					rowTemplate += '<div class="repeater-row-actions">';
						rowTemplate += '<span class="action move"><span class="dashicons dashicons-move"></span></span>';
						rowTemplate += '<span class="action trash"><span class="dashicons dashicons-trash"></span></span>';
					rowTemplate += '</div>';
				rowTemplate += '</div>';

				rowTemplate += '<div class="row-content">';

					// Go through each field.
					_.each( control.params.fields, function( field, key ) {

						// Get the correct method for this control.
						if ( _.isUndefined( field.type ) || _.isUndefined( kirki.controlMethodNames[ 'kirki-' + field.type ] ) ) {
							field.type = 'generic';
						}
						field.settings = field.id;
						field.params   = _.defaults( field, {
							label: '',
							description: '',
							choices: {},
							inputAttrs: '',
							link: '',
							multiple: 1
						} );
						field.params.id = control.id + '[]' + '[' + key + ']';

						// Add the value to the field.
						if ( ! _.isUndefined( value ) && ! _.isUndefined( value[ key ] ) ) {
							field.params.value = value[ key ];
						}

						// Add the template.
						rowTemplate += kirki.template[ kirki.controlMethodNames[ 'kirki-' + field.type ] ]( field );
					} );
				rowTemplate += '</div>';
			rowTemplate += '</li>';

			return rowTemplate;
		},

		/**
		 * The HTML Template for 'select' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		selectControl: function( control ) {
			var html = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<select ' + control.params.inputAttrs + ' ' + control.params.link + ( 1 < control.params.multiple ? ' data-multiple="' + control.params.multiple + '" multiple="multiple"' : '' ) + '>';

					_.each( control.params.choices, function( optionLabel, optionKey ) {
						var selected = ( control.params.value === optionKey );
						if ( 1 < control.params.multiple && control.params.value ) {
							selected = _.contains( control.params.value, optionKey );
						}
						if ( _.isObject( optionLabel ) ) {
							html += '<optgroup label="' + optionLabel[0] + '">';
							_.each( optionLabel[1], function( optgroupOptionLabel, optgroupOptionKey ) {
								selected = ( control.params.value === optgroupOptionKey );
								if ( 1 < control.params.multiple && control.params.value ) {
									selected = _.contains( control.params.value, optgroupOptionKey );
								}
								html += '<option value="' + optgroupOptionKey + '"' + ( selected ? ' selected' : '' ) + '>' + optgroupOptionLabel + '</option>';
							} );
							html += '</optgroup>';
						} else {
							html += '<option value="' + optionKey + '"' + ( selected ? ' selected' : '' ) + '>' + optionLabel + '</option>';
						}
					} );
				html += '</select>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-select">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'slider' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		sliderControl: function( control ) {
			var html = '';

			html += '<label>';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<div class="wrapper">';
					html += '<input ' + control.params.inputAttrs + ' type="range" min="' + control.params.choices.min + '" max="' + control.params.choices.max + '" step="' + control.params.choices.step + '" value="' + control.params.value + '" ' + control.params.link + ' data-reset_value="' + control.params['default'] + '" />';
					html += '<div class="kirki_range_value">';
						html += '<span class="value">' + control.params.value + '</span>';
						html += control.params.choices.suffix ? control.params.choices.suffix : '';
					html += '</div>';
					html += '<div class="kirki-slider-reset"><span class="dashicons dashicons-image-rotate"></span></div>';
				html += '</div>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-slider">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'sortable' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		sortableControl: function( control ) {
			var html = '';

			html += '<label class="kirki-sortable">';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';

				html += '<ul class="sortable">';
					_.each( control.params.value, function( choiceID ) {
						html += '<li ' + control.params.inputAttrs + ' class="kirki-sortable-item" data-value="' + choiceID + '">';
							html += '<i class="dashicons dashicons-menu"></i>';
							html += '<i class="dashicons dashicons-visibility visibility"></i>';
							html += control.params.choices[ choiceID ];
						html += '</li>';
					} );
					_.each( control.params.choices, function( choiceLabel, choiceID ) {
						if ( -1 === control.params.value.indexOf( choiceID ) ) {
							html += '<li ' + control.params.inputAttrs + ' class="kirki-sortable-item invisible" data-value="' + choiceID + '">';
								html += '<i class="dashicons dashicons-menu"></i>';
								html += '<i class="dashicons dashicons-visibility visibility"></i>';
								html += control.params.choices[ choiceID ];
							html += '</li>';
						}
					} );
				html += '</ul>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-sortable">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'switch' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		switchControl: function( control ) {
			var html = '';

			html += '<div class="switch' + ( ( control.params.choices.round ) ? ' round' : '' ) + '">';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="switch_' + control.id + '" id="switch_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + '/>';
				html += '<label class="switch-label" for="switch_' + control.id + '">';
					html += '<span class="switch-on">' + control.params.choices.on + '</span>';
					html += '<span class="switch-off">' + control.params.choices.off + '</span>';
				html += '</label>';
			html += '</div>';

			return '<div class="kirki-control-wrapper-switch">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'toggle' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		toggleControl: function( control ) {

			var html = '';

			html += '<label for="toggle_' + control.id + '">';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="toggle_' + control.id + '" id="toggle_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + ' hidden />';
				html += '<span class="switch"></span>';
			html += '</label>';

			return '<div class="kirki-control-wrapper-toggle">' + html + '</div>';
		},

		/**
		 * The HTML Template for 'typography' controls.
		 *
		 * @param {object} [control] The control.
		 * @returns {string}
		 */
		typographyControl: function( control ) {
			var html = '';

			html += '<label class="customizer-text">';
				html += '<span class="customize-control-title">' + control.params.label + '</span>';
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '</label>';

			html += '<div class="wrapper">';

				if ( control.params['default']['font-family'] ) {
					if ( '' === control.params.value['font-family'] ) {
						control.params.value['font-family'] = control.params['default']['font-family'];
					}
					if ( control.params.choices.fonts ) {
						control.params.fonts = control.params.choices.fonts;
					}
					html += '<div class="font-family">';
						html += '<h5>' + control.params.l10n.fontFamily + '</h5>';
						html += '<select ' + control.params.inputAttrs + ' id="kirki-typography-font-family-' + control.params.id + '" placeholder="' + control.params.l10n.selectFontFamily + '"></select>';
					html += '</div>';
					if ( ! _.isUndefined( control.params.choices['font-backup'] ) && true === control.params.choices['font-backup'] ) {
						html += '<div class="font-backup hide-on-standard-fonts kirki-font-backup-wrapper">';
							html += '<h5>' + control.params.l10n.backupFont + '</h5>';
							html += '<select ' + control.params.inputAttrs + ' id="kirki-typography-font-backup-' + control.params.id + '" placeholder="' + control.params.l10n.selectFontFamily + '"></select>';
						html += '</div>';
					}
					if ( true === control.params.show_variants || false !== control.params['default'].variant ) {
						html += '<div class="variant kirki-variant-wrapper">';
							html += '<h5>' + control.params.l10n.variant + '</h5>';
							html += '<select ' + control.params.inputAttrs + ' class="variant" id="kirki-typography-variant-' + control.params.id + '"></select>';
						html += '</div>';
					}
					if ( true === control.params.show_subsets ) {
						html += '<div class="subsets hide-on-standard-fonts kirki-subsets-wrapper">';
							html += '<h5>' + control.params.l10n.subsets + '</h5>';
							html += '<select ' + control.params.inputAttrs + ' class="subset" id="kirki-typography-subsets-' + control.params.id + '"' + ( ( _.isUndefined( control.params.choices['disable-multiple-variants'] ) || false === control.params.choices['disable-multiple-variants'] ) ? ' multiple' : '' ) + '>';
								_.each( control.params.value.subsets, function( subset ) {
									html += '<option value="' + subset + '" selected="selected">' + control.params.languages[ subset ] + '</option>';
								} );
							html += '</select>';
						html += '</div>';
					}
				}

				if ( control.params['default']['font-size'] ) {
					html += '<div class="font-size">';
						html += '<h5>' + control.params.l10n.fontSize + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" value="' + control.params.value['font-size'] + '"/>';
					html += '</div>';
				}

				if ( control.params['default']['line-height'] ) {
					html += '<div class="line-height">';
						html += '<h5>' + control.params.l10n.lineHeight + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" value="' + control.params.value['line-height'] + '"/>';
					html += '</div>';
				}

				if ( control.params['default']['letter-spacing'] ) {
					html += '<div class="letter-spacing">';
						html += '<h5>' + control.params.l10n.letterSpacing + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" value="' + control.params.value['letter-spacing'] + '"/>';
					html += '</div>';
				}

				if ( control.params['default']['word-spacing'] ) {
					html += '<div class="word-spacing">';
						html += '<h5>' + control.params.l10n.wordSpacing + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" value="' + control.params.value['word-spacing'] + '"/>';
					html += '</div>';
				}

				if ( control.params['default']['text-align'] ) {
					html += '<div class="text-align">';
						html += '<h5>' + control.params.l10n.textAlign + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="radio" value="inherit" name="_customize-typography-text-align-radio-' + control.params.id + '" id="' + control.params.id + '-text-align-inherit" ' + ( 'inherit' === control.params.value['text-align'] ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + control.params.id + '-text-align-inherit">';
								html += '<span class="dashicons dashicons-editor-removeformatting"></span>';
								html += '<span class="screen-reader-text">' + control.params.l10n.inherit + '</span>';
							html += '</label>';
						html += '</input>';

						html += '<input ' + control.params.inputAttrs + ' type="radio" value="left" name="_customize-typography-text-align-radio-' + control.params.id + '" id="' + control.params.id + '-text-align-left" ' + ( 'left' === control.params.value['text-align'] ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + control.params.id + '-text-align-left">';
								html += '<span class="dashicons dashicons-editor-alignleft"></span>';
								html += '<span class="screen-reader-text">' + control.params.l10n.left + '</span>';
							html += '</label>';
						html += '</input>';

						html += '<input ' + control.params.inputAttrs + ' type="radio" value="center" name="_customize-typography-text-align-radio-' + control.params.id + '" id="' + control.params.id + '-text-align-center" ' + ( 'center' === control.params.value['text-align'] ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + control.params.id + '-text-align-center">';
								html += '<span class="dashicons dashicons-editor-aligncenter"></span>';
								html += '<span class="screen-reader-text">' + control.params.l10n.center + '</span>';
							html += '</label>';
						html += '</input>';

						html += '<input ' + control.params.inputAttrs + ' type="radio" value="right" name="_customize-typography-text-align-radio-' + control.params.id + '" id="' + control.params.id + '-text-align-right" ' + ( 'right' === control.params.value['text-align'] ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + control.params.id + '-text-align-right">';
								html += '<span class="dashicons dashicons-editor-alignright"></span>';
								html += '<span class="screen-reader-text">' + control.params.l10n.right + '</span>';
							html += '</label>';
						html += '</input>';

						html += '<input ' + control.params.inputAttrs + ' type="radio" value="justify" name="_customize-typography-text-align-radio-' + control.params.id + '" id="' + control.params.id + '-text-align-justify" ' + ( 'justify' === control.params.value['text-align'] ? ' checked="checked"' : '' ) + '>';
							html += '<label for="' + control.params.id + '-text-align-justify">';
								html += '<span class="dashicons dashicons-editor-justify"></span>';
								html += '<span class="screen-reader-text">' + control.params.l10n.justify + '</span>';
							html += '</label>';
						html += '</input>';
					html += '</div>';
				}

				if ( control.params['default']['text-transform'] ) {
					html += '<div class="text-transform">';
						html += '<h5>' + control.params.l10n.textTransform + '</h5>';
						html += '<select ' + control.params.inputAttrs + ' id="kirki-typography-text-transform-' + control.params.id + '">';
							_.each( ['none', 'capitalize', 'uppercase', 'lowercase', 'initial', 'inherit'], function( textTransform ) {
								html += '<option value="none"' + ( textTransform === control.params.value['text-transform'] ? ' selected' : '' ) + '>' + control.params.l10n[ textTransform ] + '</option>';
							} );
						html += '</select>';
					html += '</div>';
				}

				if ( false !== control.params['default'].color && control.params['default'].color ) {
					html += '<div class="color">';
						html += '<h5>' + control.params.l10n.color + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'].color + '" value="' + control.params.value.color + '" class="kirki-color-control" ' + control.params.link + ' />';
					html += '</div>';
				}

				if ( control.params['default']['margin-top'] ) {
					html += '<div class="margin-top">';
						html += '<h5>' + control.params.l10n.marginTop + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" value="' + control.params.value['margin-top'] + '"/>';
					html += '</div>';
				}

				if ( control.params['default']['margin-bottom'] ) {
					html += '<div class="margin-bottom">';
						html += '<h5>' + control.params.l10n.marginBottom + '</h5>';
						html += '<input ' + control.params.inputAttrs + ' type="text" value="' + control.params.value['margin-bottom'] + '"/>';
					html += '</div>';
				}
			html += '</div>';

			return '<div class="kirki-control-wrapper-typography">' + html + '</div>';
		}
	},

	/**
	 * An object containing methods for setting the value of controls.
	 */
	setValue: {

		defaultControl: function( control, value, key ) {
			var valObj;

			// Calculate the value if we've got a key defined.
			if ( ! _.isUndefined( key ) ) {
				if ( ! _.isUndefined( control.setting ) && ! _.isUndefined( control.setting._value ) ) {
					valObj = control.setting._value;
				} else if ( ! _.isUndefined( control.params ) && ! _.isUndefined( control.params.value ) ) {
					valObj = control.params.value;
				} else if ( ! _.isUndefined( control.value ) ) {
					valObj = control.value;
				}
				valObj[ key ] = value;
				value = valObj;
			}

			// Reset the value.
			if ( _.isUndefined( key ) ) {
				control.setting.set( '' );
			} else {
				control.setting.set( {} );
			}

			// Set the value.
			control.setting.set( value );
		},

		checkboxControl: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			wp.customize.instance( control.id ).set( value );
		}
	},

	/**
	 * An object containing functions for setting the value visually on controls.
	 */
	setControlValue: {

		/**
		 * Changes the value visually for 'background' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		backgroundControl: function( control, value ) {
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
		},

		/**
		 * Changes the value visually for 'checkbox' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		checkboxControl: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			jQuery( control.container.find( 'input' ) ).prop( 'checked', value );
		},

		/**
		 * Changes the value visually for 'code' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		codeControl: function( control, value ) {
			jQuery( control.container.find( '.CodeMirror' ) )[0].CodeMirror.setValue( value );
		},

		/**
		 * Changes the value visually for 'color-palette' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		colorPaletteControl: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		},

		/**
		 * Changes the value visually for 'color' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		colorControl: function( control, value ) {
			control.setColorPicker( control.container.find( '.kirki-color-control' ), value );
		},

		/**
		 * Changes the value visually for 'dashicons' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		dashiconsControl: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		},

		/**
		 * Changes the value visually for 'date' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		dateControl: function( control, value ) {
			/* TODO */
		},

		/**
		 * Changes the value visually for 'dimension' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		dimensionControl: function( control, value ) {
			jQuery( control.container.find( 'input' ) ).attr( 'value', value );
		},

		/**
		 * Changes the value visually for 'dimensions' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		dimensionsControl: function( control, value ) {
			_.each( value, function( subValue, id ) {
				jQuery( control.container.find( '.' + id + ' input' ) ).prop( 'value', subValue );
			} );
		},

		/**
		 * Changes the value visually for 'editor' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		editorControl: function( control, value ) {
			/* TODO */
		},

		/**
		 * Changes the value visually for 'fontawesome' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		fontawesomeControl: function( control, value ) {
			control.setSelect2( control.container.find( 'select' ), value );
		},

		/**
		 * Changes the value visually for 'generic' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		genericControl: function( control, value ) {
			if ( _.isUndefined( control.params.choices ) ) {
				control.params.choices = {};
			}
			control.params.choices = _.defaults( control.params.choices, {
				element: 'input'
			} );

			if ( _.isUndefined( control.params.choices ) || _.isUndefined( control.params.choices.element ) ) {
				control.params.choices.element = 'input';
			}

			if ( 'textarea' === control.params.choices.element ) {
				control.container.find( 'textarea' ).html( value );
			}
			jQuery( control.container.find( control.params.choices.element ) ).prop( 'value', value );
			jQuery( control.container.find( control.params.choices.element ) ).val( value );
		},

		/**
		 * Changes the value visually for 'image' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {mixed}  [value]   The value.
		 * @returns {void}
		 */
		imageControl: function( control, value ) {
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
		},

		/**
		 * Changes the value visually for 'multicheck' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		multicheckControl: function( control, value ) {
			control.container.find( 'input' ).each( function() {
				jQuery( this ).prop( 'checked', false );
			} );
			_.each( value, function( subValue, i ) {
				jQuery( control.container.find( 'input[value="' + value[ i ] + '"]' ) ).prop( 'checked', true );
			} );
		},

		/**
		 * Changes the value visually for 'multicolor' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		multicolorControl: function( value ) {
			var control = this;
			_.each( value, function( subVal, index ) {
				control.setColorPicker( control.container.find( '.multicolor-index-' + index ), subVal );
			} );
		},

		/**
		 * Changes the value visually for 'number' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		numberControl: function( control, value ) {
			jQuery( control.container.find( 'input' ) ).attr( 'value', value );
		},

		/**
		 * Changes the value visually for 'palette' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		paletteControl: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		},

		/**
		 * Changes the value visually for 'radio-buttonset' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		radioButtonsetControl: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		},

		/**
		 * Changes the value visually for 'radio-image' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		radioImageControl: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		},

		/**
		 * Changes the value visually for 'radio' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		radioControl: function( control, value ) {
			jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
		},

		/**
		 * Changes the value visually for 'select' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		selectControl: function( control, value ) {
			control.setSelect2( control.container.find( 'select' ), value );
		},

		/**
		 * Changes the value visually for 'slider' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {float}  [value]   The value.
		 * @returns {void}
		 */
		sliderControl: function( control, value ) {
			jQuery( control.container.find( 'input' ) ).prop( 'value', value );
			jQuery( control.container.find( '.kirki_range_value .value' ) ).html( value );
		},

		/**
		 * Changes the value visually for 'switch' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		switchControl: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			jQuery( control.container.find( 'input' ) ).prop( 'checked', value );
		},

		/**
		 * Changes the value visually for 'toggle' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {bool}   [value]   The value.
		 * @returns {void}
		 */
		toggleControl: function( control, value ) {
			value = ( 1 === value || '1' === value || true === value ) ? true : false;
			jQuery( control.container.find( 'input' ) ).prop( 'checked', value );
		},

		/**
		 * Changes the value visually for 'typography' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		typographyControl: function( control, value ) {
			_.each( ['font-family', 'variant', 'subsets'], function( subVal ) {
				if ( ! _.isUndefined( value[ subVal ] ) ) {
					control.setSelect2( control.container.find( '.' + subVal + ' select' ), value[ subVal ] );
				}
			} );
			_.each( ['font-size', 'line-height', 'letter-spacing', 'word-spacing'], function( subVal ) {
				if ( ! _.isUndefined( value[ subVal ] ) ) {
					jQuery( control.container.find( '.' + subVal + ' input' ) ).prop( 'value', value[ subVal ] );
				}
			} );

			if ( ! _.isUndefined( value.color ) ) {
				control.setColorPicker( control.container.find( '.kirki-color-control' ), value.color );
			}
		}

	}
};

( function() {
	'use strict';

	/**
	 * The base for our dynamic controls.
	 *
	 * The majority of the code below is derived from the wp-customize-posts plugin
	 * and the work of @westonruter to whom I am very grateful.
	 *
	 * @see https://github.com/xwp/wp-customize-posts
	 *
	 * @class
	 * @augments wp.customize.Control
	 * @augments wp.customize.Class
	 */
	wp.customize.kirkiDynamicControl = wp.customize.Control.extend( {

		initialize: function( id, options ) {
			var control = this,
			    args    = options || {};

			args.params = args.params || {};
			if ( ! args.params.type ) {
				args.params.type = 'kirki-generic';
			}
			if ( ! args.params.content ) {
				args.params.content = jQuery( '<li></li>' );
				args.params.content.attr( 'id', 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
				args.params.content.attr( 'class', 'customize-control customize-control-' + args.params.type );
			}

			control.propertyElements = [];
			wp.customize.Control.prototype.initialize.call( control, id, args );
		},

		/**
		 * Add bidirectional data binding links between inputs and the setting(s).
		 *
		 * This is copied from wp.customize.Control.prototype.initialize(). It
		 * should be changed in Core to be applied once the control is embedded.
		 *
		 * @private
		 * @returns {void}
		 */
		_setUpSettingRootLinks: function() {
			var control = this,
			    nodes   = control.container.find( '[data-customize-setting-link]' );

			nodes.each( function() {
				var node = jQuery( this );

				wp.customize( node.data( 'customizeSettingLink' ), function( setting ) {
					var element = new wp.customize.Element( node );
					control.elements.push( element );
					element.sync( setting );
					element.set( setting() );
				} );
			} );
		},

		/**
		 * Add bidirectional data binding links between inputs and the setting properties.
		 *
		 * @private
		 * @returns {void}
		 */
		_setUpSettingPropertyLinks: function() {
			var control = this,
			    nodes;

			if ( ! control.setting ) {
				return;
			}

			nodes = control.container.find( '[data-customize-setting-property-link]' );

			nodes.each( function() {
				var node = jQuery( this ),
				    element,
				    propertyName = node.data( 'customizeSettingPropertyLink' );

				element = new wp.customize.Element( node );
				control.propertyElements.push( element );
				element.set( control.setting()[ propertyName ] );

				element.bind( function( newPropertyValue ) {
					var newSetting = control.setting();
					if ( newPropertyValue === newSetting[ propertyName ] ) {
						return;
					}
					newSetting = _.clone( newSetting );
					newSetting[ propertyName ] = newPropertyValue;
					control.setting.set( newSetting );
				} );
				control.setting.bind( function( newValue ) {
					if ( newValue[ propertyName ] !== element.get() ) {
						element.set( newValue[ propertyName ] );
					}
				} );
			} );
		},

		/**
		 * @inheritdoc
		 */
		ready: function() {
			var control = this;

			control._setUpSettingRootLinks();
			control._setUpSettingPropertyLinks();

			wp.customize.Control.prototype.ready.call( control );

			control.deferred.embedded.done( function() {
				control.initKirkiControl();
			} );
		},

		/**
		 * Embed the control in the document.
		 *
		 * Override the embed() method to do nothing,
		 * so that the control isn't embedded on load,
		 * unless the containing section is already expanded.
		 *
		 * @returns {void}
		 */
		embed: function() {
			var control   = this,
			    sectionId = control.section();

			if ( ! sectionId ) {
				return;
			}

			wp.customize.section( sectionId, function( section ) {
				if ( section.expanded() || wp.customize.settings.autofocus.control === control.id ) {
					control.actuallyEmbed();
				} else {
					section.expanded.bind( function( expanded ) {
						if ( expanded ) {
							control.actuallyEmbed();
						}
					} );
				}
			} );
		},

		/**
		 * Deferred embedding of control when actually
		 *
		 * This function is called in Section.onChangeExpanded() so the control
		 * will only get embedded when the Section is first expanded.
		 *
		 * @returns {void}
		 */
		actuallyEmbed: function() {
			var control = this;
			if ( 'resolved' === control.deferred.embedded.state() ) {
				return;
			}
			control.renderContent();
			control.deferred.embedded.resolve(); // This triggers control.ready().
		},

		/**
		 * This is not working with autofocus.
		 *
		 * @param {object} [args] Args.
		 * @returns {void}
		 */
		focus: function( args ) {
			var control = this;
			control.actuallyEmbed();
			wp.customize.Control.prototype.focus.call( control, args );
		},

		/**
		 * Initialize the kirki control.
		 *
		 * This is where the main control scripts live.
		 *
		 * @returns {void}
		 */
		initKirkiControl: function() {

			var control = this;

			// Save the value
			this.container.on( 'change keyup paste click', 'input', function() {
				control.setting.set( jQuery( this ).val() );
			} );

			if ( _.isFunction( control.getHTML ) && '' !== control.getHTML( control ) ) {
				control.container.html( control.getHTML( control ) );
			}
		},

		/**
		 * Actually renders the HTML in the control.
		 *
		 * @returns {void}
		 */
		getHTML: function( control ) {
			return kirki.template[ kirki.controlMethodNames[ control.params.type ] ]( control );
		},

		/**
		 * Validates dimension css values.
		 *
		 * @param {string} [value] The value we want to validate.
		 * @returns {bool}
		 */
		kirkiValidateCSSValue: function( value ) {

			var validUnits = ['rem', 'em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'vh', 'vw', 'vmin', 'vmax'],
				numericValue,
				unit;

			// 0 is always a valid value, and we can't check calc() values effectively.
			if ( '0' === value || ( 0 <= value.indexOf( 'calc(' ) && 0 <= value.indexOf( ')' ) ) ) {
				return true;
			}

			// Get the numeric value.
			numericValue = parseFloat( value );

			// Get the unit
			unit = value.replace( numericValue, '' );

			// Check the validity of the numeric value and units.
			if ( isNaN( numericValue ) || 0 > _.indexOf( validUnits, unit ) ) {
				return false;
			}
			return true;
		},

		/**
		 * Set the value of a control.
		 *
		 * @param {mixed}  [value] The value we want to set.
		 * @param {string} [key]   If we want to save an object, then setting the key
		 *                         will only change the value of the item with this key.
		 * @returns {void}
		 */
		kirkiSetValue: function( value, key ) {
			if ( _.isUndefined( kirki.setValue[ kirki.controlMethodNames[ this.type ] ] ) ) {
				kirki.setValue[ kirki.controlMethodNames[ this.type ] ]( this, value, key );
			} else {
				kirki.setValue.defaultControl( this, value, key );
			}
		},

		/**
		 * Changes the value of the control visually.
		 *
		 * @param {mixed}  [value] The value we want to set.
		 * @param {string} [key]   If we want to save an object, then setting the key
		 *                         will only change the value of the item with this key.
		 * @returns {void}
		 */
		kirkiSetControlValue: function( value, key ) {
			var control = this;
			kirki.setControlValue[ kirki.controlMethodNames[ control.params.type ] ]( this, value );
		},

		/**
		 * Set the value for colorpickers.
		 *
		 * CAUTION: This only sets the value visually, it does not change it in the wp object.
		 *
		 * @since 3.0.10
		 * @param {object} [selector] jQuery object for this element.
		 * @param {string} [value]    The value we want to set.
		 * @returns {void}
		 */
		setColorPicker: function( selector, value ) {
			selector.attr( 'data-default-color', value ).data( 'default-color', value ).wpColorPicker( 'color', value );
		},

		/**
		 * Sets the value in a select2 element.
		 *
		 * CAUTION: This only sets the value visually, it does not change it in th wp object.
		 *
		 * @since 3.0.10
		 * @param {string} [selector] The CSS identifier for this select2.
		 * @param {string} [value]    The value we want to set.
		 * @returns {void}
		 */
		setSelect2: function( selector, value ) {
			jQuery( selector ).select2().val( value ).trigger( 'change' );
		}
	} );

	_.each( kirki.controlMethodNames, function( controlMethodName, controlType ) {
		var controlObj = ( ! _.isUndefined( kirki.control[ controlMethodName ] ) ) ? kirki.control[ controlMethodName ] : {};
		wp.customize.controlConstructor[ controlType ] = wp.customize.kirkiDynamicControl.extend({});
	} );
} )();

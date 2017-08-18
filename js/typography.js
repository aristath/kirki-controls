/* global kirkiAllFonts */
wp.customize.controlConstructor['kirki-typography'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {
		var control = this;

		// If kirkiAllFonts is not defined,
		// then get the fonts using an ajax call.
		if ( _.isUndefined( window.kirkiAllFonts ) && _.isUndefined( window[ 'kirkiFonts' + control.id ] ) ) {
			jQuery.post( control.params.ajaxurl, { 'action': 'kirki_get_googlefonts_ajax' }, function( response ) {
				window.kirkiAllFonts = JSON.parse( response );
				control.initKirkiTypographyControl();
			});
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

		control.addHTML();

		control.renderFontSelector();
		control.renderBackupFontSelector();
		control.renderVariantSelector();
		control.renderSubsetSelector();

		// Font-size.
		this.container.on( 'change keyup paste', '.font-size input', function() {
			control.saveValue( 'font-size', jQuery( this ).val() );
		});

		// Line-height.
		this.container.on( 'change keyup paste', '.line-height input', function() {
			control.saveValue( 'line-height', jQuery( this ).val() );
		});

		// Margin-top.
		this.container.on( 'change keyup paste', '.margin-top input', function() {
			control.saveValue( 'margin-top', jQuery( this ).val() );
		});

		// Margin-bottom.
		this.container.on( 'change keyup paste', '.margin-bottom input', function() {
			control.saveValue( 'margin-bottom', jQuery( this ).val() );
		});

		// Letter-spacing.
		value['letter-spacing'] = ( jQuery.isNumeric( value['letter-spacing'] ) ) ? value['letter-spacing'] + 'px' : value['letter-spacing'];
		this.container.on( 'change keyup paste', '.letter-spacing input', function() {
			value['letter-spacing'] = ( jQuery.isNumeric( jQuery( this ).val() ) ) ? jQuery( this ).val() + 'px' : jQuery( this ).val();
			control.saveValue( 'letter-spacing', value['letter-spacing'] );
		});

		// Word-spacing.
		this.container.on( 'change keyup paste', '.word-spacing input', function() {
			control.saveValue( 'word-spacing', jQuery( this ).val() );
		});

		this.container.on( 'change', '.text-align input', function() {
			control.saveValue( 'text-align', jQuery( this ).val() );
		});

		// Text-transform
		jQuery( textTransformSelector ).select2().on( 'change', function() {
			control.saveValue( 'text-transform', jQuery( this ).val() );
		});

		picker = this.container.find( '.kirki-color-control' );

		// Change color
		picker.wpColorPicker({
			change: function() {
				setTimeout( function() {
					control.saveValue( 'color', picker.val() );
				}, 100 );
			}
		});
	},

	addHTML: function() {
		var control = this,
		    data    = control.params,
		    html    = '',
		    valueJSON;

		html += '<label class="customizer-text">';
			html += '<span class="customize-control-title">' + data.label + '</span>';
			html += '<span class="description customize-control-description">' + data.description + '</span>';
		html += '</label>';

		html += '<div class="wrapper">';

			if ( data['default']['font-family'] ) {
				if ( '' === data.value['font-family'] ) {
					data.value['font-family'] = data['default']['font-family'];
				}
				if ( data.choices.fonts ) {
					data.fonts = data.choices.fonts;
				}
				html += '<div class="font-family">';
					html += '<h5>' + data.l10n.fontFamily + '</h5>';
					html += '<select ' + data.inputAttrs + ' id="kirki-typography-font-family-' + data.id + '" placeholder="' + data.l10n.selectFontFamily + '"></select>';
				html += '</div>';
				if ( ! _.isUndefined( data.choices['font-backup'] ) && true === data.choices['font-backup'] ) {
					html += '<div class="font-backup hide-on-standard-fonts kirki-font-backup-wrapper">';
						html += '<h5>' + data.l10n.backupFont + '</h5>';
						html += '<select ' + data.inputAttrs + ' id="kirki-typography-font-backup-' + data.id + '" placeholder="' + data.l10n.selectFontFamily + '"></select>';
					html += '</div>';
				}
				if ( true === data.show_variants || false !== data['default'].variant ) {
					html += '<div class="variant kirki-variant-wrapper">';
						html += '<h5>' + data.l10n.variant + '</h5>';
						html += '<select ' + data.inputAttrs + ' class="variant" id="kirki-typography-variant-' + data.id + '"></select>';
					html += '</div>';
				}
				if ( true === data.show_subsets ) {
					html += '<div class="subsets hide-on-standard-fonts kirki-subsets-wrapper">';
						html += '<h5>' + data.l10n.subsets + '</h5>';
						html += '<select ' + data.inputAttrs + ' class="subset" id="kirki-typography-subsets-' + data.id + '"' + ( ( _.isUndefined( data.choices['disable-multiple-variants'] ) || false === data.choices['disable-multiple-variants'] ) ? ' multiple' : '' ) + '>';
							_.each( data.value.subsets, function( subset ) {
								html += '<option value="' + subset + '" selected="selected">' + data.languages[ subset ] + '</option>';
							});
						html += '</select>';
					html += '</div>';
				}
			}

			if ( data['default']['font-size'] ) {
				html += '<div class="font-size">';
					html += '<h5>' + data.l10n.fontSize + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" value="' + data.value['font-size'] + '"/>';
				html += '</div>';
			}

			if ( data['default']['line-height'] ) {
				html += '<div class="line-height">';
					html += '<h5>' + data.l10n.lineHeight + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" value="' + data.value['line-height'] + '"/>';
				html += '</div>';
			}

			if ( data['default']['letter-spacing'] ) {
				html += '<div class="letter-spacing">';
					html += '<h5>' + data.l10n.letterSpacing + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" value="' + data.value['letter-spacing'] + '"/>';
				html += '</div>';
			}

			if ( data['default']['word-spacing'] ) {
				html += '<div class="word-spacing">';
					html += '<h5>' + data.l10n.wordSpacing + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" value="' + data.value['word-spacing'] + '"/>';
				html += '</div>';
			}

			if ( data['default']['text-align'] ) {
				html += '<div class="text-align">';
					html += '<h5>' + data.l10n.textAlign + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="radio" value="inherit" name="_customize-typography-text-align-radio-' + data.id + '" id="' + data.id + '-text-align-inherit" ' + ( 'inherit' === data.value['text-align'] ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + data.id + '-text-align-inherit">';
							html += '<span class="dashicons dashicons-editor-removeformatting"></span>';
							html += '<span class="screen-reader-text">' + data.l10n.inherit + '</span>';
						html += '</label>';
					html += '</input>';

					html += '<input ' + data.inputAttrs + ' type="radio" value="left" name="_customize-typography-text-align-radio-' + data.id + '" id="' + data.id + '-text-align-left" ' + ( 'left' === data.value['text-align'] ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + data.id + '-text-align-left">';
							html += '<span class="dashicons dashicons-editor-alignleft"></span>';
							html += '<span class="screen-reader-text">' + data.l10n.left + '</span>';
						html += '</label>';
					html += '</input>';

					html += '<input ' + data.inputAttrs + ' type="radio" value="center" name="_customize-typography-text-align-radio-' + data.id + '" id="' + data.id + '-text-align-center" ' + ( 'center' === data.value['text-align'] ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + data.id + '-text-align-center">';
							html += '<span class="dashicons dashicons-editor-aligncenter"></span>';
							html += '<span class="screen-reader-text">' + data.l10n.center + '</span>';
						html += '</label>';
					html += '</input>';

					html += '<input ' + data.inputAttrs + ' type="radio" value="right" name="_customize-typography-text-align-radio-' + data.id + '" id="' + data.id + '-text-align-right" ' + ( 'right' === data.value['text-align'] ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + data.id + '-text-align-right">';
							html += '<span class="dashicons dashicons-editor-alignright"></span>';
							html += '<span class="screen-reader-text">' + data.l10n.right + '</span>';
						html += '</label>';
					html += '</input>';

					html += '<input ' + data.inputAttrs + ' type="radio" value="justify" name="_customize-typography-text-align-radio-' + data.id + '" id="' + data.id + '-text-align-justify" ' + ( 'justify' === data.value['text-align'] ? ' checked="checked"' : '' ) + '>';
						html += '<label for="' + data.id + '-text-align-justify">';
							html += '<span class="dashicons dashicons-editor-justify"></span>';
							html += '<span class="screen-reader-text">' + data.l10n.justify + '</span>';
						html += '</label>';
					html += '</input>';
				html += '</div>';
			}

			if ( data['default']['text-transform'] ) {
				html += '<div class="text-transform">';
					html += '<h5>' + data.l10n.textTransform + '</h5>';
					html += '<select ' + data.inputAttrs + ' id="kirki-typography-text-transform-' + data.id + '">';
						_.each( ['none', 'capitalize', 'uppercase', 'lowercase', 'initial', 'inherit'], function( textTransform ) {
							html += '<option value="none"' + ( textTransform === data.value['text-transform'] ? ' selected' : '' ) + '>' + data.l10n[ textTransform ] + '</option>';
						});
					html += '</select>';
				html += '</div>';
			}

			if ( false !== data['default'].color && data['default'].color ) {
				html += '<div class="color">';
					html += '<h5>' + data.l10n.color + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" data-palette="' + data.palette + '" data-default-color="' + data['default'].color + '" value="' + data.value.color + '" class="kirki-color-control" ' + data.link + ' />';
				html += '</div>';
			}

			if ( data['default']['margin-top'] ) {
				html += '<div class="margin-top">';
					html += '<h5>' + data.l10n.marginTop + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" value="' + data.value['margin-top'] + '"/>';
				html += '</div>';
			}

			if ( data['default']['margin-bottom'] ) {
				html += '<div class="margin-bottom">';
					html += '<h5>' + data.l10n.marginBottom + '</h5>';
					html += '<input ' + data.inputAttrs + ' type="text" value="' + data.value['margin-bottom'] + '"/>';
				html += '</div>';
			}
		html += '</div>';

		if ( ! _.isUndefined( data.value['font-family'] ) ) {
			data.value['font-family'] = data.value['font-family'].replace( /&quot;/g, '&#39' );
		}
		valueJSON = JSON.stringify( data.value ).replace( /'/g, '&#39' );

		html += '<input class="typography-hidden-value" type="hidden" value=\'' + valueJSON + '\' ' + data.link + '>';

		control.container.html( html );
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
				standardFonts.push({
					id: font.family.replace( /&quot;/g, '&#39' ),
					text: font.label
				});
			});
		}

		// Format google fonts as an array.
		if ( ! _.isUndefined( fonts.standard ) ) {
			_.each( fonts.google, function( font ) {
				googleFonts.push({
					id: font.family,
					text: font.label
				});
			});
		}

		// Combine forces and build the final data.
		data = [
			{ text: 'Standard Fonts', children: standardFonts },
			{ text: 'Google Fonts',   children: googleFonts }
		];

		// Instantiate select2 with the data.
		fontSelect = jQuery( selector ).select2({
			data: data
		});

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
		});
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
				standardFonts.push({
					id: font.family.replace( /&quot;/g, '&#39' ),
					text: font.label
				});
			});
		}

		// Instantiate select2 with the data.
		fontSelect = jQuery( selector ).select2({
			data: standardFonts
		});

		// Set the initial value.
		fontSelect.val( value['font-backup'].replace( /'/g, '"' ) ).trigger( 'change' );

		// When the value changes
		fontSelect.on( 'change', function() {

			// Set the value.
			control.saveValue( 'font-backup', jQuery( this ).val() );
		});
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
				data.push({
					id: variant.id,
					text: variant.label
				});
			});
			if ( ! isValid ) {
				value.variant = 'regular';
			}

			if ( jQuery( selector ).hasClass( 'select2-hidden-accessible' ) ) {
				jQuery( selector ).select2( 'destroy' );
				jQuery( selector ).empty();
			}

			// Instantiate select2 with the data.
			variantSelector = jQuery( selector ).select2({
				data: data
			});
			variantSelector.val( value.variant ).trigger( 'change' );
			variantSelector.on( 'change', function() {
				control.saveValue( 'variant', jQuery( this ).val() );

				fontWeight = ( ! _.isString( value.variant ) ) ? '400' : value.variant.match( /\d/g );
				fontWeight = ( ! _.isObject( fontWeight ) ) ? '400' : fontWeight.join( '' );
				fontStyle  = ( -1 !== value.variant.indexOf( 'italic' ) ) ? 'italic' : 'normal';

				control.saveValue( 'font-weight', fontWeight );
				control.saveValue( 'font-style', fontStyle );
			});
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
						});
					}
				}

				data.push({
					id: subset.id,
					text: subset.label
				});
			});

		} else {
			jQuery( control.selector + ' .subsets' ).hide();
		}

		if ( jQuery( selector ).hasClass( 'select2-hidden-accessible' ) ) {
			jQuery( selector ).select2( 'destroy' );
			jQuery( selector ).empty();
		}

		// Instantiate select2 with the data.
		subsetSelector = jQuery( selector ).select2({
			data: data
		});
		subsetSelector.val( validValue ).trigger( 'change' );
		subsetSelector.on( 'change', function() {
			control.saveValue( 'subsets', jQuery( this ).val() );
		});
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
		});

		_.each( fonts.google, function( font ) {
			if ( font.family === fontFamily ) {
				variants = font.variants;
				return font.variants;
			}
		});
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
		});
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
		});
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		_.each( ['font-family', 'variant', 'subsets'], function( subVal ) {
			if ( ! _.isUndefined( value[ subVal ] ) ) {
				control.setSelect2( control.container.find( '.' + subVal + ' select' ), value[ subVal ] );
			}
		});
		_.each( ['font-size', 'line-height', 'letter-spacing', 'word-spacing'], function( subVal ) {
			if ( ! _.isUndefined( value[ subVal ] ) ) {
				jQuery( control.container.find( '.' + subVal + ' input' ) ).prop( 'value', value[ subVal ] );
			}
		});

		if ( ! _.isUndefined( value.color ) ) {
			control.setColorPicker( control.container.find( '.kirki-color-control' ), value.color );
		}
	}
});

/* global wp, _, kirkiAllFonts, kirki */
kirki.control.typography = {
	init: function( control ) {
	},

	/**
	 * The HTML Template for 'typography' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label class="customizer-text">' + kirki.control.template.header( control ) + '</label>';
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

		return '<div class="kirki-control-wrapper-typography kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'typography' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {object} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			_.each( ['font-family', 'variant', 'subsets'], function( subVal ) {
				if ( ! _.isUndefined( value[ subVal ] ) ) {
					control.setSelect2( kirki.util.controlContainer( control ).find( '.' + subVal + ' select' ), value[ subVal ] );
				}
			} );
			_.each( ['font-size', 'line-height', 'letter-spacing', 'word-spacing'], function( subVal ) {
				if ( ! _.isUndefined( value[ subVal ] ) ) {
					jQuery( kirki.util.controlContainer( control ).find( '.' + subVal + ' input' ) ).prop( 'value', value[ subVal ] );
				}
			} );

			if ( ! _.isUndefined( value.color ) ) {
				control.setColorPicker( kirki.util.controlContainer( control ).find( '.kirki-color-control' ), value.color );
			}
		}
	}
};

wp.customize.controlConstructor['kirki-typography'] = wp.customize.kirkiDynamicControl.extend( {

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
		kirki.util.controlContainer( control ).on( 'change keyup paste', '.font-size input', function() {
			control.saveValue( 'font-size', jQuery( this ).val() );
		} );

		// Line-height.
		kirki.util.controlContainer( control ).on( 'change keyup paste', '.line-height input', function() {
			control.saveValue( 'line-height', jQuery( this ).val() );
		} );

		// Margin-top.
		kirki.util.controlContainer( control ).on( 'change keyup paste', '.margin-top input', function() {
			control.saveValue( 'margin-top', jQuery( this ).val() );
		} );

		// Margin-bottom.
		kirki.util.controlContainer( control ).on( 'change keyup paste', '.margin-bottom input', function() {
			control.saveValue( 'margin-bottom', jQuery( this ).val() );
		} );

		// Letter-spacing.
		value['letter-spacing'] = ( jQuery.isNumeric( value['letter-spacing'] ) ) ? value['letter-spacing'] + 'px' : value['letter-spacing'];
		kirki.util.controlContainer( control ).on( 'change keyup paste', '.letter-spacing input', function() {
			value['letter-spacing'] = ( jQuery.isNumeric( jQuery( this ).val() ) ) ? jQuery( this ).val() + 'px' : jQuery( this ).val();
			control.saveValue( 'letter-spacing', value['letter-spacing'] );
		} );

		// Word-spacing.
		kirki.util.controlContainer( control ).on( 'change keyup paste', '.word-spacing input', function() {
			control.saveValue( 'word-spacing', jQuery( this ).val() );
		} );

		kirki.util.controlContainer( control ).on( 'change', '.text-align input', function() {
			control.saveValue( 'text-align', jQuery( this ).val() );
		} );

		// Text-transform
		jQuery( textTransformSelector ).select2().on( 'change', function() {
			control.saveValue( 'text-transform', jQuery( this ).val() );
		} );

		picker = kirki.util.controlContainer( control ).find( '.kirki-color-control' );

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
} );

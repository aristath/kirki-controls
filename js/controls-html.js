var kirkiControlsHTML = {

	/**
	 * The HTML Template for 'background' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	backgroundTemplate: function( control ) {

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

		return html;
	},

	/**
	 * The HTML Template for 'checkbox' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	checkboxTemplate: function( control ) {
		var html    = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="codemirror-kirki-wrapper">';
				html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
			html += '</div>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'code' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	codeTemplate: function( control ) {
		var html    = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="codemirror-kirki-wrapper">';
				html += '<textarea ' + control.params.inputAttrs + ' class="kirki-codemirror-editor">' + control.params.value + '</textarea>';
			html += '</div>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'color-palette' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	colorPaletteTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'color' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	colorTemplate: function( control ) {
		var html    = '';

		html  = '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input type="text" ' + control.params.inputAttrs + ' data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value + '" class="kirki-color-control" ' + control.params.link + ' />';
		html += '</label>';

		return html;

	},

	/**
	 * The HTML Template for 'dashicons' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	dashiconsTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'date' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	dateTemplate: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<input ' + control.params.inputAttrs + ' class="datepicker" type="text" id="' + control.params.id + '" value="' + control.params.value + '" ' + control.params.link + '/>';
			html += '</div>';
		html += '</label>';

		return html;

	},

	/**
	 * The HTML Template for 'dimension' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	dimensionTemplate: function( control ) {
		var html = '';

		html += '<label class="customizer-text">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="input-wrapper">';
				html += '<input type="text" ' + control.params.inputAttrs + 'value="' + control.params.value.replace( '%%', '%' ) + '"/>';
			html += '</div>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'dimensions' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	dimensionsTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'editor' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	editorTemplate: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<a href="#" class="button button-primary toggle-editor"></a>';
				html += '<textarea ' + control.params.inputAttrs + ' class="hidden" ' + control.params.link + '>' + control.params.value + '</textarea>';
			html += '</div>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'fontawesome' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	fontawesomeTemplate: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<select ' + control.params.inputAttrs + ' ' + control.params.link + '</select>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'text', 'textarea', 'email' and other generic controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	genericTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'image' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	imageTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'multicheck' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	multicheckTemplate: function( control ) {

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

		return html;
	},

	/**
	 * The HTML Template for 'multicolor' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	multicolorTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'number' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	numberTemplate: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<input ' + control.params.inputAttrs + ' type="text" ' + control.params.link + ' value="' + control.params.value + '" />';
			html += '</div>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'palette' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	paletteTemplate: function( control ) {
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

		return html;

	},

	/**
	 * The HTML Template for 'radio-buttonset' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	radioButtonsetTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'radio-image' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	radioImageTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'radio' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	radioTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'select' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	selectTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'slider' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	sliderTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'sortable' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	sortableTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'switch' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	switchTemplate: function( control ) {
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

		return html;
	},

	/**
	 * The HTML Template for 'toggle' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	toggleTemplate: function( control ) {

		var html = '';

		html += '<label for="toggle_' + control.id + '">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input ' + control.params.inputAttrs + ' class="screen-reader-text" name="toggle_' + control.id + '" id="toggle_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + ' hidden />';
			html += '<span class="switch"></span>';
		html += '</label>';

		return html;
	},

	/**
	 * The HTML Template for 'typography' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	typographyTemplate: function( control ) {
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

		return html;
	}
};

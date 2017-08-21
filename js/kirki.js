/* global wp, _ */
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
		'kirki-typography': 'typographyControl'
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;

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

			return html;
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

			return html;

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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;

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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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

			return html;
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
			var control = this,
			    valObj;

			// Calculate the value if we've got a key defined.
			if ( ! _.isUndefined( key ) ) {
				valObj = control.setting._value;
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

	_.each( [
		'kirki-color-palette',
		'kirki-dashicons',
		'kirki-palette',
		'kirki-radio-buttonset',
		'kirki-radio-image',
		'kirki-radio'
	], function( controlType ) {
		wp.customize.controlConstructor[ controlType ] = wp.customize.kirkiDynamicControl.extend({});
	} );
} )();

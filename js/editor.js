/* global wp, _, tinyMCE, kirki */

kirki.control.editor = {

	init: function( control ) {
		var element,
		    toggler,
		    wpEditorArea,
		    editor,
		    setChange,
		    content;

		control.container.html( kirki.control.editor.template( control ) );

		element      = kirki.control.container( control ).find( 'textarea' );
		toggler      = kirki.control.container( control ).find( '.toggle-editor' );
		wpEditorArea = jQuery( '#kirki_editor_pane textarea.wp-editor-area' );
		editor       = tinyMCE.get( 'kirki-editor' );

		// Add the button text
		toggler.html( control.params.l10n.openEditor );

		toggler.on( 'click', function() {

			// Toggle the editor.
			kirki.control.editor.util.toggleEditor( control );

			// Change button.
			kirki.control.editor.util.changeButton( control );

			// Add the content to the editor.
			kirki.control.editor.util.setEditorContent( control, editor );

			// Modify the preview-area height.
			kirki.control.editor.util.previewHeight( control );

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
	 * The HTML Template for 'editor' controls.
	 *
	 * @param {object} [control] The control.
	 * @returns {string}
	 */
	template: function( control ) {
		var html = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<a href="#" class="button button-primary toggle-editor"></a>';
				html += '<textarea ' + control.params.inputAttrs + ' class="hidden" ' + control.params.link + '>' + control.params.value + '</textarea>';
			html += '</div>';
		html += '</label>';

		return '<div class="kirki-control-wrapper-editor kirki-control-wrapper" id="kirki-control-wrapper-' + control.id + '" data-setting="' + control.id + '">' + html + '</div>';
	},

	value: {
		/**
		 * Changes the value visually for 'editor' controls.
		 *
		 * @param {object} [control] The control.
		 * @param {string} [value]   The value.
		 * @returns {void}
		 */
		set: function( control, value ) {
			/* TODO */
		}
	},

	util: {
		/**
		 * Modify the button text and classes.
		 */
		changeButton: function( control ) {

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
		toggleEditor: function( control ) {
			var editorWrapper = jQuery( '#kirki_editor_pane' );

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
		setEditorContent: function( control, editor ) {
			editor.setContent( control.setting._value );
		},

		/**
		 * Gets the setting from the editor wrapper class.
		 */
		getEditorWrapperSetting: function( control ) {

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
		previewHeight: function( control ) {
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
	}
};

wp.customize.controlConstructor['kirki-editor'] = wp.customize.kirkiDynamicControl.extend({});

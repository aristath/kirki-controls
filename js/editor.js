/* global wp, _, tinyMCE, kirki */

kirki.control.type.editor = kirki.controo.type['kirki-editor'] = 'editorControl';

/**
 * The HTML Template for 'editor' controls.
 *
 * @param {object} [control] The control.
 * @returns {string}
 */
kirki.control.template.editorControl = function( control ) {
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
};

/**
 * Changes the value visually for 'editor' controls.
 *
 * @param {object} [control] The control.
 * @param {string} [value]   The value.
 * @returns {void}
 */
kirki.control.value.set.editorControl = function( control, value ) {
	/* TODO */
};

wp.customize.controlConstructor['kirki-editor'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control      = this,
		    element,
		    toggler,
		    wpEditorArea,
		    editor,
		    setChange,
		    content;

		control.container.html( kirki.control.template.editorControl( control ) );

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
} );

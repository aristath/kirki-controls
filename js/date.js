/* global wp, _ */
wp.customize.controlConstructor['kirki-date'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {

		var control  = this,
		    selector = control.selector + ' input.datepicker';

		control.container.html( control.getHTML( control ) );

		// Init the datepicker
		jQuery( selector ).datepicker();

		// Save the changes
		this.container.on( 'change keyup paste', 'input.datepicker', function() {
			control.setting.set( jQuery( this ).val() );
		} );
	},

	getHTML: function( control ) {
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
	 * TODO
	 */
	kirkiSetControlValue: function( value ) {
		wp.customize.kirkiDynamicControl.prototype.kirkiSetControlValue.call( this, value );
	}
} );

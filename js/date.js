/* global wp, _ */
wp.customize.controlConstructor['kirki-date'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control  = this,
		    selector = control.selector + ' input.datepicker';

		control.addHTML();

		// Init the datepicker
		jQuery( selector ).datepicker();

		// Save the changes
		this.container.on( 'change keyup paste', 'input.datepicker', function() {
			control.setting.set( jQuery( this ).val() );
		});
	},

	addHTML: function() {
		var control = this,
		    html    = '',
		    data    = control.params;

		html += '<label>';
			html += '<span class="customize-control-title">' + data.label + '</span>';
			html += '<span class="description customize-control-description">' + data.description + '</span>';
			html += '<div class="customize-control-content">';
				html += '<input ' + data.inputAttrs + ' class="datepicker" type="text" id="' + data.id + '" value="' + data.value + '" ' + data.link + '/>';
			html += '</div>';
		html += '</label>';

		control.container.html( html );

	},

	/**
	 * TODO
	 */
	kirkiSetControlValue: function( value ) {
		wp.customize.kirkiDynamicControl.prototype.kirkiSetControlValue.call( this, value );
	}
});

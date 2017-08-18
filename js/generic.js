wp.customize.controlConstructor['kirki-generic'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control = this,
			element = control.params.choices.element ? control.params.choices.element : 'input';

		control.addHTML();

		// Save the value
		this.container.on( 'change keyup paste click', element, function() {
			control.setting.set( jQuery( this ).val() );
		});
	},

	addHTML: function() {
		var control = this,
		    element = control.params.choices.element ? control.params.choices.element : 'input',
		    html    = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<div class="customize-control-content">';
				if ( 'textarea' === control.params.choices.element ) {
					html += '<textarea ' + control.params.inputAttrs + ' ' + control.params.link;
					_.each( control.params.choices, function( value, key ) {
						html += key += '"' + value + '"';
					});
					html += control.params.value;
					html += '</textarea>';
				} else {
					html += '<' + element + ' value="' + control.params.value + '" ' + control.params.link + control.params.inputAttrs + ' ';
					_.each( control.params.choices, function( value, key ) {
						html += key += '"' + value + '"';
					});
					if ( control.params.choices.content ) {
						html += '>' + control.params.choices.content + '</' + element + '>';
					} else {
						html += '/>';
					}
				}
			html += '</div>';
		html += '</label>';

		control.container.html( html );
	}
});

wp.customize.controlConstructor['kirki-radio-buttonset'] = wp.customize.kirkiDynamicControl.extend({

	addHTML: function() {
		var control = this,
		    html    = '';

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div id="input_' + control.id + '" class="buttonset">';
			_.each( control.params.choices, function( value, key ) {
				html += '<input ' + control.params.inputAttrs + ' class="switch-input screen-reader-text" type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( key === control.params.value ? ' checked="checked"' : '' ) + '>';
					html += '<label class="switch-label switch-label-' + ( key === control.params.value ? 'on' : 'off' ) + '" for="' + control.id + key + '">' + value + '</label>';
				html += '</input>';
			});
		html += '</div>';

		control.container.html( html );
	}
});

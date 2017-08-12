wp.customize.controlConstructor['kirki-radio'] = wp.customize.kirkiDynamicControl.extend({

	addHTML: function() {
		var control = this,
		    html    = '';

		if ( ! control.params.choices ) {
			return;
		}

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		_.each( control.params.choices, function( value, key ) {
			html += '<label>';
				html += '<input type="radio" value="' + key + '" name="_customize-radio-' + control.id + '" ' + control.params.link + ( control.params.value === key ? ' checked' : '' ) + '/>';
				if ( _.isArray( value ) ) {
					html += value[0] + '<span class="option-description">' + value[1] + '</span>';
				} else {
					html += value;
				}
			html += '</label>';
		});

		control.container.html( html );
	}
});

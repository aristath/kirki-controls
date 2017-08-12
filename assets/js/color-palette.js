wp.customize.controlConstructor['kirki-color-palette'] = wp.customize.kirkiDynamicControl.extend({

	addHTML: function() {
		var control = this,
		    html    = '',
			inputWrapperClasses;

		if ( ! control.params.choices ) {
			return;
		}

		inputWrapperClasses  = 'colors-wrapper';
		inputWrapperClasses += ( ! _.isUndefined( control.params.choices.style ) && 'round' === control.params.choices.style ) ? ' round' : ' square';
		inputWrapperClasses += ( ! _.isUndefined( control.params.choices['box-shadow'] ) && true === control.params.choices['box-shadow'] ) ? ' box-shadow' : '';
		inputWrapperClasses += ( ! _.isUndefined( control.params.choices.margin ) && true === control.params.choices.margin ) ? ' with-margin' : '';

		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div id="input_' + control.id + '" class="' + inputWrapperClasses + '">';
		_.each( control.params.choices.colors, function( val, key ) {
			html += '<input type="radio" ' + control.params.inputAttrs + ' value="' + val + '" name="_customize-color-palette-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === val ? ' checked' : '' ) + '>';
				html += '<label for="' + control.id + key + '" style="width:' + control.params.choices.size + 'px; height:' + control.params.choices.size + 'px;">';
					html += '<span class="color-palette-color" style="background:' + val + ';">' + val + '</span>';
				html += '</label>';
			html += '</input>';
		});
		html += '</div>';

		control.container.html( html );
	}
});

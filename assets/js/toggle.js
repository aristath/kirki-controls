wp.customize.controlConstructor['kirki-toggle'] = wp.customize.kirkiDynamicControl.extend({

	addHTML: function() {

		var control = this,
		    html = '';

		html += '<label for="toggle_' + control.id + '">';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input class="screen-reader-text" name="toggle_' + control.id + '" id="toggle_' + control.id + '" type="checkbox" value="' + control.params.value + '" ' + control.params.link + ( '1' === control.params.value ? ' checked' : '' ) + ' hidden />';
			html += '<span class="switch"></span>';
		html += '</label>';

		control.container.html( html );
	}
});

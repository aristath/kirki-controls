/* global wp, _ */
wp.customize.controlConstructor['kirki-repeater'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		var html = '';

		html += '<ul class="kirki-repeater-' + control.id + '">';
			_.each( control.params.fields, function( field, fieldID ) {
				html += '<li>' + field.type + '</li>';
			} );
		html += '</ul>';

		return html;
	}

} );

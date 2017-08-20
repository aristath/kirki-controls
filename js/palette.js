/* global wp, _ */
wp.customize.controlConstructor['kirki-palette'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		var html = '';

		if ( ! control.params.choices ) {
			return;
		}
		html += '<span class="customize-control-title">' + control.params.label + '</span>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';
		html += '<div id="input_' + control.params.id + '" class="buttonset">';
		_.each( control.params.choices, function( colors, key ) {
			html += '<input ' + control.params.inputAttrs + ' type="radio" value="' + key + '" name="_customize-palette-' + control.id + '" id="' + control.id + key + '" ' + control.params.link + ( control.params.value === key ? ' checked' : '' ) + '>';
				html += '<label for="' + control.id + key + '">';
					_.each( colors, function( color ) {
						html += '<span style="background:' + color + '">' + color + '</span>';
					} );
				html += '</label>';
			html += '</input>';
		} );
		html += '</div>';

		return html;

	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		jQuery( control.container.find( 'input[value="' + value + '"]' ) ).prop( 'checked', true );
	}
} );

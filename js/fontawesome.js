/* global fontAwesomeJSON */
wp.customize.controlConstructor['kirki-fontawesome'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control = this,
		    icons   = jQuery.parseJSON( fontAwesomeJSON ),
			element,
		    selectValue,
		    select2Options = {
				data: [],
				escapeMarkup: function( markup ) {
					return markup;
				},
				templateResult: function( val ) {
					return '<i class="fa fa-lg fa-' + val.id + '" aria-hidden="true"></i>' + ' ' + val.text;
				},
				templateSelection: function( val ) {
					return '<i class="fa fa-lg fa-' + val.id + '" aria-hidden="true"></i>' + ' ' + val.text;
				}
		    },
		    select;

		control.addHTML();

		element = this.container.find( 'select' ),

		_.each( icons.icons, function( icon ) {
			select2Options.data.push({
				id: icon.id,
				text: icon.name
			});
		});

		select = jQuery( element ).select2( select2Options );

		select.on( 'change', function() {
			selectValue = jQuery( this ).val();
			control.setting.set( selectValue );
		});
		select.val( control.setting._value ).trigger( 'change' );
	},

	addHTML: function() {
		var control = this,
		    html    = '';

		html += '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<select ' + control.params.inputAttrs + ' ' + control.params.link + '</select>';
		html += '</label>';

		control.container.html( html );
	}
});

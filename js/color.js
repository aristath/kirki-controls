wp.customize.controlConstructor['kirki-color'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {
		var control = this,
		    html,
		    clear,
		    picker;

		control.addHTML();

		picker = control.container.find( '.kirki-color-control' );

		// If we have defined any extra choices, make sure they are passed-on to Iris.
		if ( ! _.isUndefined( control.params.choices ) ) {
			picker.wpColorPicker( control.params.choices );
		}

		// Tweaks to make the "clear" buttons work.
		setTimeout( function() {
			clear = control.container.find( '.wp-picker-clear' );
			clear.click( function() {
				control.setting.set( '' );
			});
		}, 200 );

		// Saves our settings to the WP API
		picker.wpColorPicker({
			change: function() {

				// Small hack: the picker needs a small delay
				setTimeout( function() {
					control.setting.set( picker.val() );
				}, 20 );
			}
		});
	},

	addHTML: function() {
		var control = this,
		    html    = '';

		html  = '<label>';
			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			html += '<input type="text" ' + control.params.inputAttrs + ' data-palette="' + control.params.palette + '" data-default-color="' + control.params['default'] + '" data-alpha="' + control.params.alpha + '" value="' + control.params.value + '" class="kirki-color-control" ' + control.params.link + ' />';
		html += '</label>';

		control.container.html( html );

	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		control.setColorPicker( control.container.find( '.kirki-color-control' ), value );
	}
});

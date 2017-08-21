/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-color'] = wp.customize.kirkiDynamicControl.extend( {

	initKirkiControl: function() {
		var control = this,
		    clear,
		    picker;

		control.container.html( kirki.template.colorControl( control ) );

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
			} );
		}, 200 );

		// Saves our settings to the WP API
		picker.wpColorPicker( {
			change: function() {

				// Small hack: the picker needs a small delay
				setTimeout( function() {
					control.setting.set( picker.val() );
				}, 20 );
			}
		} );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		control.setColorPicker( control.container.find( '.kirki-color-control' ), value );
	}
} );

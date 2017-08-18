wp.customize.controlConstructor['kirki-multicheck'] = wp.customize.kirkiDynamicControl.extend({

	initKirkiControl: function() {

		var control = this;

		control.addHTML();

		// Save the value
		control.container.on( 'change', 'input', function() {
			var value = [],
			    i = 0;

			// Build the value as an object using the sub-values from individual checkboxes.
			jQuery.each( control.params.choices, function( key ) {
				if ( control.container.find( 'input[value="' + key + '"]' ).is( ':checked' ) ) {
					value[ i ] = key;
					i++;
				}
			});

			// Update the value in the customizer.
			control.setting.set( value );
		});
	},

	addHTML: function() {

		var control = this,
		    html    = '';

		if ( ! control.params.choices ) {
			return;
		}

		html += '<span class="customize-control-title">' + control.params.label + '</span><# } #>';
		html += '<span class="description customize-control-description">' + control.params.description + '</span>';

		html += '<ul>';
			_.each( control.params.choices, function( val, key ) {
				html += '<li><label><input ' + control.params.inputAttrs + ' type="checkbox" value="' + key + '"' + ( _.contains( control.params.value, key ) ? ' checked' : '' ) + '/>' + val + '</label></li>';
			});
		html += '</ul>';

		control.container.html( html );
	},

	kirkiSetControlValue: function( value ) {
		var control = this;
		control.container.find( 'input' ).each( function() {
			jQuery( this ).prop( 'checked', false );
		});
		_.each( value, function( subValue, i ) {
			jQuery( control.container.find( 'input[value="' + value[ i ] + '"]' ) ).prop( 'checked', true );
		});
	}
});

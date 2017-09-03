/* global wp, _ */
var kirki = kirki || {};

kirki.control = kirki.control || {};
kirki.setting = kirki.setting || {};

kirki.control.setValue = function() {};

/**
 * Gets the value of a setting.
 *
 * This is a helper function that allows us to get the value of
 * control[key1][key2] for example, when the setting used in the
 * customizer API is "control".
 *
 * @since 3.1.0
 * @param {string} [setting] The setting for which we're getting the value.
 * @returns {(string|array|object|bool)} Depends on the value.
 */
kirki.setting.get = function( setting ) {
	var parts = setting.split( '[' ),
		foundSetting = '',
		foundInStep  = 0,
		currentVal   = '';

	_.each( parts, function( part, i ) {
		part = part.replace( ']', '' );

		if ( 0 === i ) {
			foundSetting = part;
		} else {
			foundSetting += '[' + part + ']';
		}

		if ( ! _.isUndefined( wp.customize.instance( foundSetting ) ) ) {
			currentVal  = wp.customize.instance( foundSetting ).get();
			foundInStep = i;
		}

		if ( foundInStep < i ) {
			if ( _.isObject( currentVal ) && ! _.isUndefined( currentVal[ part ] ) ) {
				currentVal = currentVal[ part ];
			}
		}
	});

	return currentVal;
};

/**
 * Sets the value of a setting.
 *
 * This function is a bit complicated because there any many scenarios to consider.
 * Example: We want to save the value for my_setting[something][3][something-else].
 * The control's setting is my_setting[something].
 * So we need to find that first, then figure out the remaining parts,
 * merge the values recursively to avoid destroying my_setting[something][2]
 * and also take into account any defined "key" arguments which take this even deeper.
 *
 * @since 3.1.0
 * @param {object}                     [element] The DOM element whose value has changed.
 *                                               Format: {element:value, context:id|element}.
 *                                               We'll use this to find the setting.
 * @param {(string|array|bool|object)} [value]   Depends on the control-type.
 * @param {string}                     [key]     If we only want to save an item in an object
 *                                               we can define the key here.
 * @returns {void}
 */
kirki.setting.set = function( element, value, key ) {
	var setting,
	    parts,
	    currentNode   = '',
	    foundNode     = '',
	    subSettingObj = {},
	    currentVal,
	    subSetting,
	    subSettingParts;

	// Get the setting from the element.
	if ( jQuery( element ).attr( 'data-setting' ) ) {
		setting = jQuery( element ).attr( 'data-setting' );
	} else {
		setting = jQuery( element ).parents( '.kirki-control-wrapper' ).attr( 'data-setting' );
	}
	parts = setting.split( '[' ),

	// Find the setting we're using in the control using the customizer API.
	_.each( parts, function( part, i ) {
		part = part.replace( ']', '' );

		// The current part of the setting.
		currentNode = ( 0 === i ) ? part : '[' + part + ']';

		// When we find the node, get the value from it.
		// In case of an object we'll need to merge with current values.
		if ( ! _.isUndefined( wp.customize.instance( currentNode ) ) ) {
			foundNode  = currentNode;
			currentVal = wp.customize.instance( foundNode ).get();
		}
	} );

	// Get the remaining part of the setting that was unused.
	subSetting = setting.replace( foundNode, '' );

	// If subSetting is not empty, then we're dealing with an object
	// and we need to dig deeper and recursively merge the values.
	if ( '' !== subSetting ) {
		if ( ! _.isObject( currentVal ) ) {
			currentVal = {};
		}
		if ( '[' === subSetting.charAt( 0 ) ) {
			subSetting = subSetting.replace( '[', '' );
		}
		subSettingParts = subSetting.split( '[' );
		_.each( subSettingParts, function( subSettingPart, i ) {
			subSettingParts[ i ] = subSettingPart.replace( ']', '' );
		} );

		// If using a key, we need to go 1 level deeper.
		if ( key ) {
			subSettingParts.push( key );
		}

		// Converting to a JSON string and then parsing that to an object
		// may seem a bit hacky and crude but it's efficient and works.
		subSettingObj = '{"' + subSettingParts.join( '":{"' ) + '":"' + value + '"' + '}'.repeat( subSettingParts.length );
		subSettingObj = JSON.parse( subSettingObj );

		// Recursively merge with current value.
		jQuery.extend( true, currentVal, subSettingObj );
		value = currentVal;

	} else {
		if ( key ) {
			currentVal = ( ! _.isObject( currentVal ) ) ? {} : currentVal;
			currentVal[ key ] = value;
			value = currentVal;
		}
	}

	wp.customize.control( foundNode ).setting.set( value );
};

kirki.control = {

	/**
	 * An object containing template-specific functions.
	 *
	 * @since 3.1.0
	 */
	template: {

		/**
		 * Gets the HTML for control headers.
		 *
		 * @since 3.1.0
		 * @param {object} [control] The control object.
		 * @return {string}
		 */
		header: function( control ) {
			var html = '';

			html += '<span class="customize-control-title">' + control.params.label + '</span>';
			if ( control.params.description && '' !== control.params.description ) {
				html += '<span class="description customize-control-description">' + control.params.description + '</span>';
			}
			return html;
		}
	}
};

Kirki.value = {
	set: {

		/**
		 * Sets the value in wp-customize settings.
		 *
		 * @param {object} [control] The control.
		 * @param {mixed}  [value]   The value.
		 * @param {string} [key]     A key if we only want to change part of an object value.
		 * @returns {void}
		 */
		defaultControl: function( control, value, key ) {
			var valObj;

			// Calculate the value if we've got a key defined.
			if ( ! _.isUndefined( key ) ) {
				if ( ! _.isUndefined( control.setting ) && ! _.isUndefined( control.setting._value ) ) {
					valObj = control.setting._value;
				} else if ( ! _.isUndefined( control.params ) && ! _.isUndefined( control.params.value ) ) {
					valObj = control.params.value;
				} else if ( ! _.isUndefined( control.value ) ) {
					valObj = control.value;
				}
				valObj[ key ] = value;
				value = valObj;
			}

			// Reset the value.
			if ( _.isUndefined( key ) ) {
				control.setting.set( '' );
			} else {
				control.setting.set( {} );
			}

			// Set the value.
			control.setting.set( value );
		}
	}
};

/**
 * A collection of utility functions.
 *
 * @since 3.1.0
 */
kirki.util = {

	/**
	 * Returns the wrapper element of the control.
	 *
	 * @since 3.1.0
	 * @param {object} [control] The control arguments.
	 * @returns {array}
	 */
	controlContainer: function( control ) {
		return jQuery( '#kirki-control-wrapper-' + control.id );
	},

	/**
	 * Gets the control-type, with or without the 'kirki-' prefix.
	 *
	 * @since 3.1.0
	 * @param {string}      [controlType] The control-type.
	 * @param {bool|string} [prefix]      If false, return without prefix.
	 *                                    If true, return with 'kirki-' as prefix.
	 *                                    If string, add custom prefix.
	 * @returns {string}
	 */
	getControlType: function( controlType, prefix ) {

		controlType = controlType.replace( 'kirki-', '' );
		if ( _.isUndefined( prefix ) || false === prefix ) {
			return controlType;
		}
		if ( true === prefix ) {
			return 'kirki-' + controlType;
		}
		return prefix + controlType;
	},

	/**
	 * Validates dimension css values.
	 *
	 * @param {string} [value] The value we want to validate.
	 * @returns {bool}
	 */
	kirkiValidateCSSValue: function( value ) {

		var validUnits = ['rem', 'em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'vh', 'vw', 'vmin', 'vmax'],
			numericValue,
			unit;

		// 0 is always a valid value, and we can't check calc() values effectively.
		if ( '0' === value || ( 0 <= value.indexOf( 'calc(' ) && 0 <= value.indexOf( ')' ) ) ) {
			return true;
		}

		// Get the numeric value.
		numericValue = parseFloat( value );

		// Get the unit
		unit = value.replace( numericValue, '' );

		// Check the validity of the numeric value and units.
		if ( isNaN( numericValue ) || 0 > _.indexOf( validUnits, unit ) ) {
			return false;
		}
		return true;
	}
};

/**
 * Hooks system.
 * Similar to WordPress's add_action() & do_action() PHP functions.
 * We can add new actions using the kirki.action.add() function (add_action())
 * and to execute these actions, we need to run kirki.action.run() (do_action()).
 *
 * @since 3.1.0
 */
kirki.action = {
	actions: {},

	/**
	 * Adds an action.
	 *
	 * @param {string} [name]     The action we want to hook into.
	 * @param {string} [callback] The callback we'll be executing.
	 * @param {mixed}  [args]     Arguments that will be passed-on to the callback.
	 * @returns {void}
	 */
	add: function( name, callback, args ) {
		if ( _.isUndefined( kirki.action.actions[ name ] ) ) {
			kirki.action.actions[ name ] = [];
		}
		kirki.action.actions[ name ].push( [ callback, args ] );
	},

	/**
	 * Adds an action, making sure it's only added once.
	 *
	 * @param {string} [name]     The action we want to hook into.
	 * @param {string} [callback] The callback we'll be executing.
	 * @param {mixed}  [args]     Arguments that will be passed-on to the callback.
	 * @returns {void}
	 */
	addOnce: function( name, callback, args ) {
		if ( false === kirki.action.exists( name, callback ) ) {
			kirki.action.add( name, callback, args );
		}
	},

	/**
	 * Executes callbacks registered in an action.
	 *
	 * @param {string} [name] The action we want to run.
	 * @returns {void}
	 */
	run: function( name ) {
		if ( ! _.isUndefined( kirki.action.actions[ name ] ) ) {
			_.each( kirki.action.actions[ name ], function( params ) {
				if ( _.isUndefined( params[0] ) ) {
					return;
				}
				params[1] = ( _.isUndefined( params[1] ) ) ? '' : params[1];
				if ( _.isFunction( window[ params[0] ] ) ) {
					window[ params[0] ]( params[1] );
				} else if ( _.isFunction( params[0] ) ) {
					params[0]( params );
				}
			} );
		}
	},

	/**
	 * Checks if an action exists.
	 *
	 * @param {string} [name]     The action we want to check.
	 * @param {string} [callback] The callback we want to check.
	 * @returns {void}
	 */
	exists: function( name, callback ) {
		var exists = false;
		if ( _.isUndefined( kirki.action.actions[ name ] ) ) {
			return false;
		}
		_.each( kirki.action.actions[ name ], function( params ) {
			if ( ! _.isUndefined( params[0] ) && callback === params[0] ) {
				exists = true;
			}
		} );
		return exists;
	}
};

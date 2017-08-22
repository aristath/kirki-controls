/* global wp, _ */
var kirki = {
	control: {
		getTypeWithPrefix: function( controlType ) {
			return 'kirki-' + controlType.replace( 'kirki-', '' );
		},
		getTypeWithoutPrefix: function( controlType ) {
			return controlType.replace( 'kirki-', '' );
		}
	},

	value: {
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
	}
};

( function() {
	'use strict';

	/**
	 * The base for our dynamic controls.
	 *
	 * The majority of the code below is derived from the wp-customize-posts plugin
	 * and the work of @westonruter to whom I am very grateful.
	 *
	 * @see https://github.com/xwp/wp-customize-posts
	 *
	 * @class
	 * @augments wp.customize.Control
	 * @augments wp.customize.Class
	 */
	wp.customize.kirkiDynamicControl = wp.customize.Control.extend( {

		initialize: function( id, options ) {
			var control = this,
			    args    = options || {};

			args.params = args.params || {};
			if ( ! args.params.type ) {
				args.params.type = 'kirki-generic';
			}
			if ( ! args.params.content ) {
				args.params.content = jQuery( '<li></li>' );
				args.params.content.attr( 'id', 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
				args.params.content.attr( 'class', 'customize-control customize-control-' + args.params.type );
			}

			control.propertyElements = [];
			wp.customize.Control.prototype.initialize.call( control, id, args );
		},

		/**
		 * Add bidirectional data binding links between inputs and the setting(s).
		 *
		 * This is copied from wp.customize.Control.prototype.initialize(). It
		 * should be changed in Core to be applied once the control is embedded.
		 *
		 * @private
		 * @returns {void}
		 */
		_setUpSettingRootLinks: function() {
			var control = this,
			    nodes   = control.container.find( '[data-customize-setting-link]' );

			nodes.each( function() {
				var node = jQuery( this );

				wp.customize( node.data( 'customizeSettingLink' ), function( setting ) {
					var element = new wp.customize.Element( node );
					control.elements.push( element );
					element.sync( setting );
					element.set( setting() );
				} );
			} );
		},

		/**
		 * Add bidirectional data binding links between inputs and the setting properties.
		 *
		 * @private
		 * @returns {void}
		 */
		_setUpSettingPropertyLinks: function() {
			var control = this,
			    nodes;

			if ( ! control.setting ) {
				return;
			}

			nodes = control.container.find( '[data-customize-setting-property-link]' );

			nodes.each( function() {
				var node = jQuery( this ),
				    element,
				    propertyName = node.data( 'customizeSettingPropertyLink' );

				element = new wp.customize.Element( node );
				control.propertyElements.push( element );
				element.set( control.setting()[ propertyName ] );

				element.bind( function( newPropertyValue ) {
					var newSetting = control.setting();
					if ( newPropertyValue === newSetting[ propertyName ] ) {
						return;
					}
					newSetting = _.clone( newSetting );
					newSetting[ propertyName ] = newPropertyValue;
					control.setting.set( newSetting );
				} );
				control.setting.bind( function( newValue ) {
					if ( newValue[ propertyName ] !== element.get() ) {
						element.set( newValue[ propertyName ] );
					}
				} );
			} );
		},

		/**
		 * @inheritdoc
		 */
		ready: function() {
			var control = this;

			control._setUpSettingRootLinks();
			control._setUpSettingPropertyLinks();

			wp.customize.Control.prototype.ready.call( control );

			control.deferred.embedded.done( function() {
				if ( ! _.isUndefined( kirki.control[ kirki.control.getTypeWithoutPrefix( control.params.type ) ].init ) ) {
					kirki.control[ kirki.control.getTypeWithoutPrefix( control.params.type ) ].init( control );
				} else {
					control.initKirkiControl();
				}
			} );
		},

		/**
		 * Embed the control in the document.
		 *
		 * Override the embed() method to do nothing,
		 * so that the control isn't embedded on load,
		 * unless the containing section is already expanded.
		 *
		 * @returns {void}
		 */
		embed: function() {
			var control   = this,
			    sectionId = control.section();

			if ( ! sectionId ) {
				return;
			}

			wp.customize.section( sectionId, function( section ) {
				if ( section.expanded() || wp.customize.settings.autofocus.control === control.id ) {
					control.actuallyEmbed();
				} else {
					section.expanded.bind( function( expanded ) {
						if ( expanded ) {
							control.actuallyEmbed();
						}
					} );
				}
			} );
		},

		/**
		 * Deferred embedding of control when actually
		 *
		 * This function is called in Section.onChangeExpanded() so the control
		 * will only get embedded when the Section is first expanded.
		 *
		 * @returns {void}
		 */
		actuallyEmbed: function() {
			var control = this;
			if ( 'resolved' === control.deferred.embedded.state() ) {
				return;
			}
			control.renderContent();
			control.deferred.embedded.resolve(); // This triggers control.ready().
		},

		/**
		 * This is not working with autofocus.
		 *
		 * @param {object} [args] Args.
		 * @returns {void}
		 */
		focus: function( args ) {
			var control = this;
			control.actuallyEmbed();
			wp.customize.Control.prototype.focus.call( control, args );
		},

		/**
		 * Initialize the kirki control.
		 *
		 * This is where the main control scripts live.
		 *
		 * @returns {void}
		 */
		initKirkiControl: function() {

			var control = this;

			// Save the value
			this.container.on( 'change keyup paste click', 'input', function() {
				control.setting.set( jQuery( this ).val() );
			} );

			if ( _.isFunction( control.getHTML ) && '' !== control.getHTML( control ) ) {
				control.container.html( control.getHTML( control ) );
			}
		},

		/**
		 * Actually renders the HTML in the control.
		 *
		 * @returns {void}
		 */
		getHTML: function( control ) {
			if ( _.isUndefined( kirki.control[ kirki.control.getTypeWithoutPrefix( control.params.type ) ] ) ) {
				console.log( control );
			}
			return kirki.control[ kirki.control.getTypeWithoutPrefix( control.params.type ) ].template( control );
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
		},

		/**
		 * Set the value of a control.
		 *
		 * @param {mixed}  [value] The value we want to set.
		 * @param {string} [key]   If we want to save an object, then setting the key
		 *                         will only change the value of the item with this key.
		 * @returns {void}
		 */
		kirkiSetValue: function( value, key ) {
			kirki.value.set.defaultControl( this, value, key );
		},

		/**
		 * Changes the value of the control visually.
		 *
		 * @param {mixed}  [value] The value we want to set.
		 * @param {string} [key]   If we want to save an object, then setting the key
		 *                         will only change the value of the item with this key.
		 * @returns {void}
		 */
		kirkiSetControlValue: function( value, key ) {
			var control = this;
			kirki.control[ kirki.control.getTypeWithoutPrefix( control.params.type ) ].value.set( this, value );
		},

		/**
		 * Set the value for colorpickers.
		 *
		 * CAUTION: This only sets the value visually, it does not change it in the wp object.
		 *
		 * @since 3.0.10
		 * @param {object} [selector] jQuery object for this element.
		 * @param {string} [value]    The value we want to set.
		 * @returns {void}
		 */
		setColorPicker: function( selector, value ) {
			selector.attr( 'data-default-color', value ).data( 'default-color', value ).wpColorPicker( 'color', value );
		},

		/**
		 * Sets the value in a select2 element.
		 *
		 * CAUTION: This only sets the value visually, it does not change it in th wp object.
		 *
		 * @since 3.0.10
		 * @param {string} [selector] The CSS identifier for this select2.
		 * @param {string} [value]    The value we want to set.
		 * @returns {void}
		 */
		setSelect2: function( selector, value ) {
			jQuery( selector ).select2().val( value ).trigger( 'change' );
		}
	} );
} )();

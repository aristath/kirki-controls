# Structure

A layout of the main object that will be used in this refactor version.
```js
kirki = {
	control: {
		/**
		 * This is added from each individual control.
		 */
		{controlType}: {
			/**
			 * Init the control.
			 * This involves adding the HTML
			 * and triggering any additional scripts/actions required.
			 * Note that one of the params here will have to be
			 * the wrapper element for the control.
			 */
			init: function( params ) {},

			/**
			 * Get the HTML.
			 * It should accept the same params as the init function
			 * to make things easier.
			 */
			html : function( params ) {},

			/**
			 * Set a value.
			 * This is ONLY for the visual part of setting the value.
			 * For example image controls must get the URL of the image,
			 * select2 elements may need re-triggering etc.
			 * The params argument should contain the setting-id & the value.
			 */
			setValue: function( params ) {}
		},

		/**
		 * Set a value.
		 * This is ONLY for the visual part of setting the value.
		 * Necessary as a fallback for the kirki.control.{controlType}.setValue method
		 * since some simple controls won't need anything complicated
		 * and can share this method.
		 */
		setValue: function( params ) {}
	},

	/**
	 * This will be global in the kirki object.
	 * Will contain functions for getting & setting values.
	 */
	setting: {
		/**
		 * Get the value of a setting.
		 * The reason we'll need this abstraction is for repeaters
		 * and other complex controls where we need to get setting[subsetting]
		 * or even setting[0][subsetting], and the customizer setting is 'setting'.
		 * This is just a proxy to figure out things.
		 */
		get: function( id ) {},

		/**
		 * Sets the value of a setting.
		 * The reasons for creating this method are similar to the ones for the get method.
		 */
		set: function( id, value ) {}
	}
}
```

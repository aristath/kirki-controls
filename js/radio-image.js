/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-radio-image'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirki.template.radioImageControl( control );
	}
} );

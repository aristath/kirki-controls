/* global wp, _, kirki */
wp.customize.controlConstructor['kirki-radio'] = wp.customize.kirkiDynamicControl.extend( {

	getHTML: function( control ) {
		return kirki.template.radioControl( control );
	}
} );

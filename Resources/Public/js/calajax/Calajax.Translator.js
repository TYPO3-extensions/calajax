/***************************************************************
*  Copyright notice
*
*  (c) 2009 Philip Almeida (philip.almeida@freedomson.com)
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/
/**
 * @package Calajax
 * @author	Philip Almeida <philip.almeida@freedomson.com>
 */


/* Translator Singleton */

Calajax.Translator = {

	/*
	 * Tags repository
	 * Augmented with translation key:
	 * example: mainTranslationObject.key.tag
	 */
	mainTranslationObject : {},

	/*
	 * Check if a key is loaded
	 */
	isLoaded : function ( key ) {

		try{
		    if ( Calajax.Translator.mainTranslationObject[key] )
		        return true;
		} catch( error ){}
		
        return false;

	},

	/*
	 * Get the default translation tags
	 * Example:
	 * Calajax.Translator.getDefaultTranslation( key )
	 */
	getTranslation : function( key, tag ) {

		// Return final translation object
		try {
			return Calajax.Translator.mainTranslationObject[key][tag];
		} catch ( e ){
			// delegate catch to common error handler.
			Calajax.Util.errorHandler( e );
		}

		// At this point we face some kind of error
		// Possible key or tag variables not set correctly
		return;

	},

	/*
	 * Request translation to server via Ajax
	 */
	requestTranslation : function ( key ){
		
		/*
		 * If this key was already requested we return the cached result
		 */
		if ( Calajax.Translator.mainTranslationObject[key] ) {
			return Calajax.Translator.mainTranslationObject[key];
		}

		/**
		 * Request translation tags.
		 */

		// Get request pi_var name for translation request
		var requestActionVar = Calajax.Registry.translator.requestActionVar;

		// Create request object for data parameter of jQuery get method
		var translatorRequestPost = {};
		eval(	'var translatorRequestPost = {' +
				'"' + requestActionVar + '" : key'				+
				'};');

		Calajax.Util.ajax({
			data : translatorRequestPost,
			success : function( data ) {
				Calajax.Translator.mainTranslationObject[key] = data;
				Calajax.Translator.fire( key );
			}

		});

	}
};

// +----------------------------------------------------------------------------
// | Observer Class Extend
// +----------------------------------------------------------------------------

/**
 * Extend translator to become Observable
 */
jQuery.extend( true, Calajax.Translator, new Calajax.Observer() );
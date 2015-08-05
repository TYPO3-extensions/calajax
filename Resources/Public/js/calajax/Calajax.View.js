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
 * @package Calajax Javascript API
 * @author	Philip Almeida <philip.almeida@freedomson.com>
 */



/**
 * Week View Builder Class
 */

Calajax.View = function() {
	/*
	 * Child classes must implement
	 */
	this.placeHolderId = false;
};

/**
 * Current possible status for weekview are:
 * 0 INACTIVE
 * 1 BUILDING
 * 2 ACTIVE
 * 3 HIDDING
 * 4 WAITING
 */
Calajax.View.status = new Array( 4 );
Calajax.View.status[0] = 'INACTIVE';
Calajax.View.status[1] = 'BUILDING';
Calajax.View.status[2] = 'ACTIVE';
Calajax.View.status[3] = 'HIDDING';
Calajax.View.status[4] = 'WAITING';

Calajax.View.prototype = {

	currentStatus : 0, // Default status INACTIVE

	/**
	 * Hide weekview
	 */
	show : function (object) {
		// jQuery( '#' + this.placeHolderId ).fadeIn( Calajax.Registry.jQuery.fadeInSpeed );
		jQuery( '#' + this.placeHolderId ).show();
		this.currentStatus = 2; // Set status to ACTIVE(2)
		Calajax.Util.hideLoadingMask();
	},

	/**
	 * Hide weekview
	 */
	hide : function ( callback ) {
		// jQuery( '#' + this.placeHolderId ).fadeOut( Calajax.Registry.jQuery.fadeOutSpeed );
		jQuery( '#' + this.placeHolderId ).hide();
		this.currentStatus = 3;  // Set status to HIDDING(3)
		Calajax.Util.hideLoadingMask();
	},

	/**
	 * Check if all request data is available for processing
	 * If not we request and set a observer on it
	 */
	request_waitingCalendarData	:	false,
	request_waitingCategoryData :	false,
	request_waitingTSConfData	:	false, // Typoscript conf object ( see registry )
	request_waitingTranslation	:	false, // Translations
	request_waitingRights		:	false, // Access rights to views
	request_isDataMissing : function() {

		var result = false;

		var that = this; // Used for scope when observer fires

		// This is the callback as required requests arrive
		var buildIt = function() {

			// Check if there are more requests pending
			if ( that.request_isDataMissing() ) {
				// Wait for pending requests to callback...
				return;
			} else {
				// All data is here let's go ...
				that.request_waitingCalendarData= false;
				that.request_waitingCategoryData= false;
				that.request_waitingTSConfData	= false;
				that.request_waitingTranslation = false;
				that.request_waitingRights		= false;
				that.init();
			}
		};
		
		var getCalendarData = function() {
			Calajax.Rights.unsubscribe( getCalendarData );
			Calajax.CalendarView.calendar.loadData();
			Calajax.CalendarView.calendar.subscribe(showCalendarList);
			Calajax.CalendarView.calendar.subscribe(buildIt);
		};
		
		var getCategoryData = function() {
			Calajax.Rights.unsubscribe( getCategoryData );
			Calajax.CategoryView.category.loadData();
			Calajax.CategoryView.category.subscribe(showCategoryList);
			Calajax.CategoryView.category.subscribe(buildIt);
		};
		
		var showCalendarList = function() {
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.CalendarViewString ).init();
		};
		
		var showCategoryList = function() {
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.CategoryViewString ).init();
		};

		// +--------------------------------------------------------------------
		// | Check translation request status
		// +--------------------------------------------------------------------
		//

		if ( Calajax.Translator.isLoaded( this.getTranslationKey() ) == false ) {

			if ( this.request_waitingTranslation == false ) {

				// Fire the request for the default translations for current view
				Calajax.Translator.requestTranslation( this.getTranslationKey() );

				// Subscribe to the Translator and wait for the translation to arrive.
				Calajax.Translator.subscribe( buildIt );
				

				this.request_waitingTranslation = true;

			}

			result = true;
		}

		// +--------------------------------------------------------------------
		// | Check rights request status
		// +--------------------------------------------------------------------

		if ( Calajax.Rights.isLoaded == false ) {

			if ( this.request_waitingRights == false ) {

				// Fire the request for the default permissions
				Calajax.Rights.load();

				// Subscribe to the Rights and wait for the arrival.
				Calajax.Rights.subscribe( buildIt );
				Calajax.Rights.subscribe( getCalendarData );
				Calajax.Rights.subscribe( getCategoryData );

				this.request_waitingRights = true;

			}

			result = true;
		}
		
		// +--------------------------------------------------------------------
		// | Check TSConf request status
		// +--------------------------------------------------------------------

		if ( Calajax.Registry.TSConf == false ) {

			if ( this.request_waitingTSConfData == false ) {

				// Fire the request
				Calajax.Registry.TSConfLoad();

				// Subscribe and wait for the arrival.
				Calajax.Registry.subscribe( buildIt );

				this.request_waitingTSConfData = true;

			}

			result = true;
		}
		
		// +--------------------------------------------------------------------
		// | Check CalendarView request status
		// +--------------------------------------------------------------------

		
		if ( Calajax.CalendarView.calendar.isDataLoaded == false) {

			if ( this.request_waitingCalendarData == false ) {
				
				that.request_waitingCalendarData = true;
				
				result = true;
			
			}
		
		}
		
		if ( Calajax.CategoryView.category.isDataLoaded == false) {

			if ( this.request_waitingCategoryData == false ) {
				
				that.request_waitingCategoryData = true;
				
				result = true;
			
			}
		
		}

		return result;

	},

	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	 translate : function ( tag ) {
		 return Calajax.Translator.getTranslation( this.getTranslationKey(), tag );
	 },

	/**
	 * Initialize week view
	 */
	init : function (object) {

		/*
		 * Hide loading mask
		 */
		Calajax.Util.showLoadingMask();

		// Set status to BUILDING(1)
		this.currentStatus = 1;


		if ( this.request_isDataMissing() ) {
			this.currentStatus = 4; // WAITING
			return;
		}

		this.build(object);
		this.currentStatus = 2; // ACTIVE

		/*
		 * Hide loading mask
		 */
		Calajax.Util.hideLoadingMask();

		return;


	}
};
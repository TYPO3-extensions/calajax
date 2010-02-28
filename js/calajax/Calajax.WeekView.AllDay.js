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


/**
 * Define a top namespace, Calajax.
 */
Calajax.WeekView.AllDay = {

	state : 0, // 0 Default 1 Loaded 2 Loading

	builded: new Array(), // Day and Week Instances

	load : function( currentViewObj ){
		// jQuery( currentViewObj.fullCalendarDef.placeholder ).fullCalendar( 'removeEvents');
		jQuery( currentViewObj.fullCalendarDef.placeholder ).fullCalendar( 'addEventSource',  Calajax.Registry.events.AllDayEvents );
		jQuery( currentViewObj.fullCalendarDef.placeholder ).fullCalendar( 'gotoDate', currentViewObj.viewStart.format('yyyy'), currentViewObj.viewStart.format('mm') - 1 , currentViewObj.viewStart.format('d') );
	},

	build : function( currentView ) {

		/* If allday is builded go back */
		if ( Calajax.WeekView.AllDay.builded[ currentView ] ) {
			return;
		}

		var currentViewObj = Calajax.Registry.currentView.Object;
		var viewPlaceHolder = Calajax.Registry.currentView.placeHolder;


		/*
		 * Start processing
		 * Add element to document
		 *
		 */

		// Set local object placeholder

		var placeHolder = currentViewObj.fullCalendarDef.placeholder;

		jQuery( '#' + viewPlaceHolder + ' .wc-header' ).after('<table class="table_allday" cellpadding="0" callspacing="0"><td class="table_allday_time"></td><td class="table_allday_content"><div id="' + placeHolder + '" class="' + placeHolder + '"></div></td></tr></table>');

		jQuery( '#' + viewPlaceHolder +  ' #' + placeHolder ).fullCalendar( currentViewObj.fullCalendarDef );
		
		Calajax.WeekView.AllDay.builded[ currentView ] = true;

		currentViewObj.fullCalendarDef.placeholder = '#'  + viewPlaceHolder +  ' #' + placeHolder;

		jQuery( currentViewObj.fullCalendarDef.placeholder ).fullCalendar( 'gotoDate', currentViewObj.viewStart.format('yyyy'), currentViewObj.viewStart.format('mm') - 1 , currentViewObj.viewStart.format('d') );

	}

};

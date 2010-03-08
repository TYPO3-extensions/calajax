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
 * MainObjectFactory Singleton
 */

Calajax.MainObjectFactory = {
	
	/*
	 * This will retain the objects
	 */
	DayViewString : 'dayview',
	WeekViewString : 'weekview',
	MonthViewString: 'monthview',
	EventViewString: 'eventview',
	LocationViewString: 'locationview',
	OrganizerViewString: 'organizerview',
	CalendarViewString: 'calendarview',
	CategoryViewString: 'categoryview',

	DayView : false,
	WeekView : false,
	MonthView : false,
	EventView : false,
	LocationView : false,
	OrganizerView : false,
	CalendarView : false,
	CategoryView : false,

	/**
	 * Application containers
	 */
	getObject:	function( objectString ){
		switch ( objectString ) {

		// DayView Object Creation
		case Calajax.MainObjectFactory.DayViewString:
			if ( this.DayView == false ) {
				this.DayView = new Calajax.DayView();
			}
			return this.DayView;

		// WeekView Object Creation
		case Calajax.MainObjectFactory.WeekViewString:
			if ( this.WeekView == false ) {
				this.WeekView = new Calajax.WeekView();
			}
			return this.WeekView;

		// MonthView Object Creation
		case Calajax.MainObjectFactory.MonthViewString:
			if ( this.MonthView == false ) {
				this.MonthView = new Calajax.MonthView();
			}
			return this.MonthView;
		
		// EventView Object Creation
		case Calajax.MainObjectFactory.EventViewString:
			if ( this.EventView == false ) {
				this.EventView = new Calajax.EventView();
			}
			return this.EventView;
		

		// LocationView Object Creation
		case Calajax.MainObjectFactory.LocationViewString:
			if ( this.LocationView == false ) {
				this.LocationView = new Calajax.LocationView();
			}
			return this.LocationView;
			
		// OrganizerView Object Creation
		case Calajax.MainObjectFactory.OrganizerViewString:
			if ( this.OrganizerView == false ) {
				this.OrganizerView = new Calajax.OrganizerView();
			}
			return this.OrganizerView;
		
		
		// CalendarView Object Creation
		case Calajax.MainObjectFactory.CalendarViewString:
			if ( this.CalendarView == false ) {
				this.CalendarView = new Calajax.CalendarView();
			}
			return this.CalendarView;
			
			// CalendarView Object Creation
		case Calajax.MainObjectFactory.CategoryViewString:
			if ( this.CategoryView == false ) {
				this.CategoryView = new Calajax.CategoryView();
			}
			return this.CategoryView;
		}
	}

};


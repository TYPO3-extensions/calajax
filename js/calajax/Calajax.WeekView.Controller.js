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
Calajax.WeekView.Controller = {

	// Events

	//  noEvents: [function()] – Function to call after calendar has loaded and it has no events
	noEvents : function(){},

	//  draggable: [function(calEvent, eventElement)] – Called on each event to determine whether it should be draggable or not.  Default function returns true on all events.
	draggable : function( calEvent, eventElement ){
		return calEvent.isallowedtoedit == 1;
	},

	//  resizable : [function(calEvent, eventElement)] – Called on each event to determine whether it should be resizable or not.  Default function returns true on all events.
	resizable : function( calEvent, eventElement ){
		return calEvent.isallowedtoedit == 1;
	},

	/*
	 * PROCESSED BEFORE EVENT RENDER
	 */
	//  eventRender : [function(calEvent, element)] – Called prior to rendering an event. Allows modification of the eventElement or the ability to return a different element.
	eventRender : function( calEvent, element ) {

		if ( calEvent.calendar_id > 0 ) {
			// Loaded Event
		} else {
			// New event
			var calendars = Calajax.CalendarView.calendar.getCalendarsWithCreatePermission();
			for(var calendarId in calendars){
				calEvent.calendar_uid = calendarId;
				calEvent = new Calajax.Event( calEvent );
				break;
			}
		}
		
		/* alter css based on event properties*/
		element.addClass(calEvent.headerstyle);
			
		Calajax.CalendarView.calendar.subscribeToCalendar(element, calEvent);
		
		/* Populate events*/
		Calajax.Registry.events.currentEvents.push({
			'calEventData'		: calEvent,
			'calEventElement'	: element,
			'type'				: 'regular'
		});

	},

	//  eventAfterRender : [function(calEvent, element)] – Called after rendering an event.
	eventAfterRender : function( calEvent, element ){
		
		/* Add Icon to Event */
		if ( Calajax.Registry.TSConf['setup.']['events.']['showIcons'] == 1 ) {

			element.find('.wc-time').prepend('<div class="event_image_icon"><img src="' + Calajax.Registry.TSConf['setup.']['icons.'][ Calajax.Event.decodeType( calEvent.type ) ] + '" /></div>');

		}		
		
		/*** Hide events depending on selected calendar ***/
		if (calEvent.calendar_id && Calajax.CalendarView.calendar.getCalendar( calEvent.calendar_id ).displayValue == 'hidden' ) {
			jQuery( element ).hide();
		}


		if ( calEvent.editBar == undefined )
			calEvent = new Calajax.Event( calEvent );
		element.find('.wc-time').append( calEvent.editBar() );

	},

	//  eventClick : [function(calEvent, element)] – Called on click of a calendar event.
	eventClick : function( calEvent, element ){
		calEvent.displayEvent();
		return;

	},

	//  eventMouseover : [function(calEvent, element)] – Called on mouseover of a calendar event.
	eventMouseover : function( calEvent, element ){
		// nothing
		return;

	},

	//  eventMouseout : [function(calEvent, element)] – Called on mouseout of a calendar event.
	eventMouseout : function( calEvent, element ){
		// nothing
		return;

	},

	//  eventDrag : [function(calEvent, element)] Called on drag of a calendar event.
	eventDrag : function( calEvent, element ){
		// nothing
		return true;

	},

	//  eventDrop : [function(calEvent, element)] Called on drop of a dragged calendar event.
	eventDrop : function( calEvent, element ){
		this.eventResize(calEvent, element);
		return;

	},

	//  eventResize :[ function(calEvent, element)] – Called on resize of a calendar event.
	eventResize : function( calEvent, element ){
		calEvent.start_time = calEvent.start.getHours() * 3600 + calEvent.start.getMinutes() * 60;
		calEvent.end_time = calEvent.end.getHours() * 3600 + calEvent.end.getMinutes() * 60;
		calEvent.startObject = calEvent.start;
		calEvent.endObject = calEvent.end;
		Calajax.Event.startEventSave(calEvent);
		return;

	},

	//  eventNew : [function(calEvent, element)] – Called on creation of a new calendar event.
	eventNew : function( calEvent, element ){

		if ( Calajax.Rights.create.event == true ) {
			var calendars = Calajax.CalendarView.calendar.getCalendarsWithCreatePermission();
			for(var calendarId in calendars){
				calEvent.calendar_uid = calendarId;
			
				// Set default properties
				calEvent.start_time		= calEvent.start.getHours() * 3600 + calEvent.start.getMinutes() * 60;
				calEvent.end_time		= calEvent.end.getHours() * 3600 + calEvent.end.getMinutes() * 60;
				calEvent.startObject	= calEvent.start;
				calEvent.endObject		= calEvent.end;
				calEvent.allday			= 0;
				calEvent.title			= Calajax.Translator.getTranslation( Calajax.Registry.translator.weekViewRequestKey, 'newEventText' );

				// Save new event
				Calajax.Event.startEventSave( new Calajax.Event( calEvent ) );
				element.remove();
				break;
			}
			
		}
		return;

	},

	//  calendarBeforeLoad : [function(calendar)] – Called after the calendar grid has been rendered but before events are loaded
	calendarBeforeLoad : function( calendar ) {},

	//  calendarAfterLoad : [function(calendar)] – Called after events are loaded
	calendarAfterLoad : function( calendar ) {

		/**
		 * Specific WEEKVIEW processing
		 * on calendarAfterLoad
		 */
		if ( Calajax.Registry.divcontainer.currentView == 'weekview' ) {
			// +--------------------------------------------------------------------
			// | Activate links on day column header
			// +--------------------------------------------------------------------
			if ( Calajax.Registry.options.activateHeaderLinksOnWeekView == true ) {

				Calajax.Util.addDayViewLinks();
				
			}
		}

		Calajax.WeekView.Controller.wcIsLoaded = 1;
		if ( Calajax.WeekView.AllDay.state == 1 )
			Calajax.Util.hideLoadingMask();

	},

	wcIsLoaded : 0, // 0 - default, 1 - loaded, 2 - loading


	/* *********************************************************
	 * AllDay
	 * - available callback methods
	 * ********************************************************/

	 /*
	  * Triggered with a true argument when the calendar begins fetching events via AJAX.
	  * Triggered with false when done.
	  */
	AllDayLoading: function(isLoading, view) {
	},

	/*
	 * Triggered once when the calendar loads and every time the calendar’s view is changed.
	 * This includes when the prev or next button is pressed.
	 */
	AllDayViewDisplay : function( calendar ) {

		/* Populate current week events*/

		var events		= calendar.eventsByID;
		var elements	= calendar.eventElementsByID;

		jQuery.each( events, function( i, event ) {

			Calajax.Registry.events.currentEvents.push({
				'calEventData'		: event[0],
				'calEventElement'	: elements[i],
				'type'				: 'allday'
			});

			/*** Hide events depending on selected calendar ***/
			if ( elements[i] != undefined &&  typeof elements[i][0] != undefined ) {
				jQuery( elements[i][0] ).show();
				if ( Calajax.CalendarView.calendar.getCalendar( event[0].calendar_id ).displayValue == 'hidden' ) {
					jQuery( elements[i][0] ).hide();
				}
			}

		});

		Calajax.WeekView.AllDay.state = 1;
		if ( Calajax.WeekView.Controller.wcIsLoaded == 1 )
			Calajax.Util.hideLoadingMask();

	},

	/*
	 * Triggered before an element is rendered for the given CalEvent. element is the jQuery element that will be used by default.
	 * You may modify this element or return a brand new element that will be used instead.
	 * Returning false will prevent the event from being rendered at all.
	 *This function is great for attaching other jQuery plugins to each event element, such as a qTip tooltip effect.
	 */
	AllDayEventRender: function( calEvent, element, view ) {

		//Calajax.CalendarView.calendar.subscribeToCalendar(element, calEvent);

		return Calajax.Event.renderEventForAllDay(calEvent);

	},


	/**
	 * Triggered when the user clicks on a day. dayDate is a Date object with it’s time set to 00:00:00.
	 * this is set to the TD element of the clicked day.
	 */
	AllDayDayClick: function( dayDate, view ) {
		if(Calajax.Rights.create.event==true) {
			Calajax.Registry.divcontainer.lastView = Calajax.Registry.divcontainer.currentView; 
			Calajax.Main.eventViewCommand.execute(
					new Calajax.Event({
						startObject : dayDate,
						endObject : new Date(dayDate),
						allday : 1,
						event_type : 0,
						freq : "none"
					}));
		}
        return;
	},


	/*
	 *   Triggered on click/mouseover/mouseout actions for an event.
	 *   calEvent holds that event’s information (date, title, etc).
	 *   jsEvent holds the native javascript event (with information about click position, etc).
	 *   this is set to the event’s element For eventClick, return false to prevent the browser from going to the event’s URL.
	 */
	AllDayEventClick: function( calEvent, jsEvent, view ) {
		calEvent.displayEvent();
		return false;
	},
	AllDayEventMouseover: function( calEvent, jsEvent, view ) {
		return;
	},
	AllDayEventMouseout: function( calEvent, jsEvent, view ) {
		return;
	},

	/*
	 * Triggered before/after an event is dragged (but not necessarily moved to a new day).
	 * calEvent holds that event’s information (date, title, etc).
	 * jsEvent holds the native javascript event (with information about click position, etc).
	 * ui holds the jQuery UI object.
	 * this is set to the event’s element
	 */
	AllDayEventDragStart: function( calEvent, jsEvent, ui, view ) {
		return;
	},
	AllDayEventDragStop: function( calEvent, jsEvent, ui, view ) {
		return;
	},

	/*
	 * Triggered when dragging stops and the event has moved to a different day.
	 * dayDelta holds the number of days the event was moved forward (a positive number) or backwards (a negative number).
	 * minuteDelta will always be 0 and is reserved for a future release of FullCalendar where there will be an agenda view.
	 * dayDelta and minuteDelta are elegant for dealing with multi-day and repeating events. If updating a remote database, just add these values to the start and end times of all events with the given calEvent.id
	 * revertFunc is a function that, if called, reverts the event’s start/end date to the values before the drag. This is useful if an ajax call should fail.
	 */
	AllDayEventDrop: function( calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {
		if(calEvent.freq!='none' && calEvent.parent_startdate != undefined){
			calEvent.start_date = calEvent.parent_startdate;
			calEvent.end_date = calEvent.parent_enddate;
			calEvent.start_time = calEvent.parent_starttime;
			calEvent.end_time = calEvent.parent_endtime;
			delete calEvent.startObject;
			delete calEvent.endObject;
			calEvent = new Calajax.Event(calEvent);
			calEvent.startObject = new Date(calEvent.startObject.getTime()+(dayDelta*60*60*24*1000));
			calEvent.endObject = new Date(calEvent.endObject.getTime()+(dayDelta*60*60*24*1000)-20);
			calEvent.start = calEvent.startObject;
			calEvent.end = calEvent.endObject;
		}
		Calajax.Event.startEventSave(calEvent);
		return;
	},

	/*
	 * Triggered before/after an event is resized (but not necessarily changed). calEvent holds that event’s information (date, title, etc).
	 * jsEvent holds the native javascript event (with information about click position, etc).
	 * ui holds the jQuery UI object.
	 * this is set to the event’s element
	 */
	AllDayEventResizeStart: function( calEvent, jsEvent, ui, view ) {
		return;
	},
	AllDayEventResizeStop: function( calEvent, jsEvent, ui, view ) {
		return;
	},

	/*
	 * Triggered when an event is resized and changed in duration.
	 * dayDelta holds the number of days the event’s end time was moved forward (a positive number) or backwards (a negative number).
	 * minuteDelta will always be 0 and is reserved for a future release of FullCalendar where there will be an agenda view.
	 * revertFunc is a function that, if called, reverts the event’s start/end date to the values before the drag. This is useful if an ajax call should fail.
	 */
	AllDayEventResize: function( calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {
		return;
	}

};




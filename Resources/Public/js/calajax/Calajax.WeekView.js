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
Calajax.WeekView = function() {

	// Containg div
	this.placeHolderId = Calajax.Registry.divcontainer.weekView;

}

Calajax.WeekView.prototype = {

	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	 getTranslationKey : function () {
		 return Calajax.Registry.translator.weekViewRequestKey;
	 },



	 /**
	  * Fullcalendar object default definitions
	  * After build method is run this mutates to a singleton object.
	  */

	fullCalendarDefinitions : function () {

		return {
			firstDay: Calajax.WeekView.calendarDef.firstDayOfWeek,
			editable: true,
			header: false,
			/*
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
			*/
			defaultView: 'basicWeek',
			aspectRatio: 16.0,
			events: false,

			/*
			 * Triggered once when the calendar loads and every time the calendar’s view is changed.
			 * This includes when the prev or next button is pressed.
			 */
			viewDisplay: function( view ){

				return Calajax.WeekView.Controller.AllDayViewDisplay( view );

			},

			eventRender: function( calEvent, element, view ) {

				return Calajax.WeekView.Controller.AllDayEventRender( calEvent, element, view );

			},

			/**
			 * Triggered when the user clicks on a day. dayDate is a Date object with it’s time set to 00:00:00.
			 * this is set to the TD element of the clicked day.
			 */
			dayClick: function( dayDate, view ) {

				return Calajax.WeekView.Controller.AllDayDayClick( dayDate, view );

			},

			/*
			 *   Triggered on click/mouseover/mouseout actions for an event.
			 *   calEvent holds that event’s information (date, title, etc).
			 *   jsEvent holds the native javascript event (with information about click position, etc).
			 *   this is set to the event’s element For eventClick, return false to prevent the browser from going to the event’s URL.
			 */
			eventClick: function( calEvent, jsEvent, view ) {

				return Calajax.WeekView.Controller.AllDayEventClick( calEvent, jsEvent, view );

			},
			eventMouseover: function( calEvent, jsEvent, view ) {

				return Calajax.WeekView.Controller.AllDayEventMouseover( calEvent, jsEvent, view );

			},
			eventMouseout: function( calEvent, jsEvent, view ) {

				return Calajax.WeekView.Controller.AllDayEventMouseout( calEvent, jsEvent, view );

			},

			/*
			 * Triggered before/after an event is dragged (but not necessarily moved to a new day).
			 * calEvent holds that event’s information (date, title, etc).
			 * jsEvent holds the native javascript event (with information about click position, etc).
			 * ui holds the jQuery UI object.
			 * this is set to the event’s element
			 */
			eventDragStart: function( calEvent, jsEvent, ui, view ) {

				return Calajax.WeekView.Controller.AllDayEventDragStart( calEvent, jsEvent, ui, view );

			},
			eventDragStop: function( calEvent, jsEvent, ui, view ) {

				return Calajax.WeekView.Controller.AllDayEventDragStop( calEvent, jsEvent, ui, view );

			},

			/*
			 * Triggered when dragging stops and the event has moved to a different day.
			 * dayDelta holds the number of days the event was moved forward (a positive number) or backwards (a negative number).
			 * minuteDelta will always be 0 and is reserved for a future release of FullCalendar where there will be an agenda view.
			 * dayDelta and minuteDelta are elegant for dealing with multi-day and repeating events. If updating a remote database, just add these values to the start and end times of all events with the given calEvent.id
			 * revertFunc is a function that, if called, reverts the event’s start/end date to the values before the drag. This is useful if an ajax call should fail.
			 */
			eventDrop: function( calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {

				return Calajax.WeekView.Controller.AllDayEventDrop( calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view );

			},

			/*
			 * Triggered before/after an event is resized (but not necessarily changed). calEvent holds that event’s information (date, title, etc).
			 * jsEvent holds the native javascript event (with information about click position, etc).
			 * ui holds the jQuery UI object.
			 * this is set to the event’s element
			 */
			eventResizeStart: function( calEvent, jsEvent, ui, view ) {

				return Calajax.WeekView.Controller.AllDayEventResizeStart( calEvent, jsEvent, ui, view );

			},
			eventResizeStop: function( calEvent, jsEvent, ui, view ) {

				return Calajax.WeekView.Controller.AllDayEventResizeStop( calEvent, jsEvent, ui, view );

			},

			/*
			 * Triggered when an event is resized and changed in duration.
			 * dayDelta holds the number of days the event’s end time was moved forward (a positive number) or backwards (a negative number).
			 * minuteDelta will always be 0 and is reserved for a future release of FullCalendar where there will be an agenda view.
			 * revertFunc is a function that, if called, reverts the event’s start/end date to the values before the drag. This is useful if an ajax call should fail.
			 */
			eventResize: function( calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {

				return Calajax.WeekView.Controller.AllDayEventResize( calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view );

			}

		}

	},

	 /**
	  * Calendar object default definitions
	  * After build method is run this mutates to a singleton object.
	  */

	calendarDefinitions : function () {

		return {

			date : new Date(Calajax.Registry.getdate.getTime()),
			allowCalEventOverlap : true,
			overlapEventsSeparate: Calajax.Registry.options.overlapEventsSeparate,
			firstDayOfWeek : Calajax.Registry.options.weekstart, // 1 = Monday
			businessHours :{ start: 8, end: 18, limitDisplay: false },
			daysToShow : 7,
			scrollToHourMillis : 0,
			use24Hour : true,
			readonly: Calajax.CalendarView.calendar.getCalendarsWithCreatePermission().length < 0 || !Calajax.Rights.create.event,
			timeslotsPerHour : 2,
			timeFormat : Calajax.Registry.format.weekEventTime,
			dateFormat : Calajax.Registry.format.weekHeaderFormat,
			useShortDayNames : Calajax.Registry.format.weekUseShortDayNames,
			/* Translated options */

			timeSeparator : this.translate( 'timeSeparator' ),
			newEventText : this.translate( 'newEventText' ),
			longMonths : this.translate( 'longMonths' ),
			shortMonths : this.translate( 'shortMonths' ),
			shortDays : this.translate( 'shortDays' ),
			longDays : this.translate( 'longDays' ),
			buttonText: this.translate( 'buttonText' ),

			data: Calajax.WeekView.loadEvents(),

			/**
			 * All events are handled at
			 * Calajax.WeekView.Controller object
			 */

			//  noEvents: [function()] – Function to call after calendar has loaded and it has no events
			noEvents : function(){

				Calajax.WeekView.Controller.noEvents();

			},

			//  draggable: [function(calEvent, eventElement)] – Called on each event to determine whether it should be draggable or not.  Default function returns true on all events.
			draggable :  function( calEvent, eventElement ){

				return Calajax.WeekView.Controller.draggable( calEvent, eventElement );

			},

			//  resizable : [function(calEvent, eventElement)] – Called on each event to determine whether it should be resizable or not.  Default function returns true on all events.
			resizable : function( calEvent, eventElement ){

				return Calajax.WeekView.Controller.resizable( calEvent, eventElement );

			},

			//  eventRender : [function(calEvent, element)] – Called prior to rendering an event. Allows modification of the eventElement or the ability to return a different element.
			eventRender : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventRender( calEvent, eventElement );

			},

			//  eventAfterRender : [function(calEvent, element)] – Called after rendering an event.
			eventAfterRender : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventAfterRender( calEvent, eventElement );

			},

			//  eventClick : [function(calEvent, element)] – Called on click of a calendar event.
			eventClick : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventClick( calEvent, eventElement );

			},

			//  eventMouseover : [function(calEvent, element)] – Called on mouseover of a calendar event.
			eventMouseover : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventMouseover( calEvent, eventElement );

			},

			//  eventMouseout : [function(calEvent, element)] – Called on mouseout of a calendar event.
			eventMouseout : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventMouseout( calEvent, eventElement );

			},

			//  eventDrag : [function(calEvent, element)] Called on drag of a calendar event.
			eventDrag : function( calEvent, eventElement ){

				//Calajax.WeekView.Controller.eventDrag( calEvent, eventElement );

			},

			//  eventDrop : [function(calEvent, element)] Called on drop of a dragged calendar event.
			eventDrop : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventDrop( calEvent, eventElement );

			},

			//  eventResize :[ function(calEvent, element)] – Called on resize of a calendar event.
			eventResize : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventResize( calEvent, eventElement );

			},

			//  eventNew : [function(calEvent, element)] – Called on creation of a new calendar event.
			eventNew : function( calEvent, eventElement ){

				Calajax.WeekView.Controller.eventNew( calEvent, eventElement );

			},

			//  calendarBeforeLoad : [function(calendar)] – Called after the calendar grid has been rendered but before events are loaded
			calendarBeforeLoad : function( calendar ){

				Calajax.WeekView.Controller.calendarBeforeLoad( calendar );

			},

			//  calendarAfterLoad : [function(calendar)] – Called after events are loaded
			calendarAfterLoad : function( calendar ){

				Calajax.WeekView.Controller.calendarAfterLoad( calendar );

			}
		}
	},

	/*
	 * Build Calendar
	 */
	build : function() {

		// Get default configurations for full and week api.
		Calajax.WeekView.calendarDef = this.calendarDefinitions();
		Calajax.WeekView.fullCalendarDef = this.fullCalendarDefinitions();

		/*** Allday ***/
		Calajax.WeekView.fullCalendarDef.placeholder = this.placeHolderId + '_head';	 // See Calajax.WeekView.AllDay object

		// Append placeholders to DOM

		/*** Week View **/
		this.wCalBody = this.placeHolderId + '_body';
		this.wCalBodyID = '#' + this.placeHolderId + '_body';
		jQuery( '#' + this.placeHolderId ).append('<div id="' + this.wCalBody + '" class="' + this.wCalBody + '"></div>');

		// Trigger build actions
		// Build default view, allday event view see load function
		jQuery( this.wCalBodyID ).weekCalendar( Calajax.WeekView.calendarDef );
		Calajax.WeekView.AllDay.build( Calajax.Registry.divcontainer.currentView );
	},

	beforeNavigation : function () {
		jQuery( ' #' + Calajax.WeekView.fullCalendarDef.placeholder ).fullCalendar( 'removeEvents');
	},

	next : function() {
		// jQuery( Calajax.WeekView.AllDay.placeHolder ).fullCalendar( 'next' );
		this.beforeNavigation();
		jQuery( this.wCalBodyID ).weekCalendar( 'nextWeek' );

	},
	previous : function() {
		// jQuery( Calajax.WeekView.AllDay.placeHolder ).fullCalendar( 'prev' );
		this.beforeNavigation();
		jQuery( this.wCalBodyID ).weekCalendar( 'prevWeek' );
	},
	today : function() {
		//jQuery( Calajax.WeekView.AllDay.placeHolder ).fullCalendar( 'today' );
		this.beforeNavigation();
		jQuery( this.wCalBodyID ).weekCalendar( 'today' );
	},
	gotoDate : function() {
		this.beforeNavigation();
		jQuery( this.wCalBodyID ).weekCalendar('gotoWeek', new Date( Calajax.Registry.getdate.format('yyyy'), Calajax.Registry.getdate.format('mm'), 1 ) );
	},

	/**
	 * This method is called at COMMAND each time the view is selected.
	 * Is used to update between views date ranges
	 */
	activatedViaCommand : function () {

		Calajax.CalendarView.calendar.emptyCalendarEvents();
		jQuery( this.wCalBodyID ).weekCalendar('gotoWeek', Calajax.Registry.getdate );

	},
	
	removeAndAddEvents : function (eventId, events) {
		var allDayEvents = [];
		var regularEvents = [];
			
		for(var i = 0; i < events.length; i++){
			if ( events[i].allday == 1 || ( events[i].start.format('yyyymmdd') != events[i].end.format('yyyymmdd')  ) ) {

				allDayEvents.push( events[i] );

			/*
			 * Regular events
			 */
			} else {

				regularEvents.push( events[i] );
				
			}
		}
		jQuery( this.wCalBodyID ).weekCalendar( 'removeAndAddEvents', eventId, regularEvents );
		jQuery( ' #' + Calajax.WeekView.fullCalendarDef.placeholder ).fullCalendar( 'removeAndAddEvents', eventId, allDayEvents );
	}
}

/* Calendar definitions object */
Calajax.WeekView.calendarDef = {}
Calajax.WeekView.fullCalendarDef = {}

// TODO: Optimize duplicate code
Calajax.WeekView.showEvents = function( catId ) {
	var events = Calajax.Registry.events.currentEvents;
	jQuery( events ).each (
		function( id ){
			if ( events[id].calEventData.calendar_id
				 &&  events[id].calEventData.calendar_id == catId ) {
				try { jQuery( events[id].calEventElement[0] ).show(); } catch(e) {}
			}
		}
	)
}

// TODO: Optimize duplicate code
Calajax.WeekView.hideEvents = function( catId ) {
	var events = Calajax.Registry.events.currentEvents;
	jQuery( events ).each (
		function( id ){
			if ( events[id].calEventData.calendar_id
				 &&  events[id].calEventData.calendar_id == catId ) {
				try { jQuery( events[id].calEventElement[0] ).hide(); } catch(e) {}
			}
		}
	)
}

Calajax.WeekView.loadEvents = function() {

	return function(start, end, callback) {

		Calajax.Util.showLoadingMask();

		jQuery( ' #' + Calajax.WeekView.fullCalendarDef.placeholder ).fullCalendar( 'removeEvents');

		/* Set loading state on allday and wc */
		Calajax.WeekView.Controller.wcIsLoaded = Calajax.WeekView.AllDay.state = 2;

		/* Clean Events */
		Calajax.Registry.events.currentEvents = [];
		Calajax.Registry.events.AllDayEvents = [];

		end.setDate(end.getDate()+1);
		Calajax.WeekView.viewStart = start;
		Calajax.WeekView.viewEnd = end;
		Calajax.Util.refreshInfoText();

		Calajax.Event.getEvents(start, end, function(data){
			var events = [];
			
			if (data){
				jQuery.each(data, function(i, entry) {

					var currentevent = new Calajax.Event(entry);

					/*
					 * Split event by properties regarding date
					 */
					if ( currentevent.allday == 1 || ( currentevent.start.format('yyyymmdd') != currentevent.end.format('yyyymmdd')  ) ) {

						Calajax.Registry.events.AllDayEvents.push( currentevent );

					/*
					 * Regular events
					 */
					} else {

						events.push( currentevent );
						
					}

				});
			}

			Calajax.WeekView.AllDay.load( Calajax.WeekView );
			callback(events);
			
		});
	};
}

// +----------------------------------------------------------------------------
// | Extend View
// +----------------------------------------------------------------------------

/**
 * Extend
 */
jQuery.extend( true, Calajax.WeekView.prototype, new Calajax.View() );

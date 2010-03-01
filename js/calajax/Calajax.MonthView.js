/***************************************************************
 * Copyright notice
 *
 * (c) 2009 Mario Matzulla
 * (c) 2009 Christian Technology Ministries International Inc.
 * All rights reserved
 *
 * This file is part of the Web-Empowered Church (WEC)
 * (http://WebEmpoweredChurch.org) ministry of Christian Technology Ministries 
 * International (http://CTMIinc.org). The WEC is developing TYPO3-based
 * (http://typo3.org) free software for churches around the world. Our desire
 * is to use the Internet to help offer new life through Jesus Christ. Please
 * see http://WebEmpoweredChurch.org/Jesus.
 *
 * You can redistribute this file and/or modify it under the terms of the 
 * GNU General Public License as published by the Free Software Foundation;
 * either version 2 of the License, or (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This file is distributed in the hope that it will be useful for ministry,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the file!
 ***************************************************************/

Calajax.MonthView = function(){

	// Identifier for calendar placeholder.
	this.placeHolderId = Calajax.Registry.divcontainer.monthView;
}

Calajax.MonthView.prototype	= {

	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	getTranslationKey : function () {
		return Calajax.Registry.translator.monthViewRequestKey;
	},
	 
	fullcalendarObject : false,
	
	currentDate : null,

	/*
	 * Build Calendar
	 */
	build : function(){
		 
		if(this.currentDate == null){
			this.currentDate = Calajax.Registry.getdate;
		}
		
		jQuery('#' + this.placeHolderId).html('');
		this.fullcalendarObject = jQuery('#' + this.placeHolderId).fullCalendar({
			
			monthNames : this.translate( 'longMonths' ),
			monthNamesShort : this.translate( 'shortMonths' ),
			dayNames : this.translate( 'longDays' ),
			dayNamesShort : this.translate( 'shortDays' ),
			year : this.currentDate.getFullYear(),
			month : this.currentDate.getMonth(),
			timeFormat : Calajax.Registry.format.monthEventTime,
			firstDay :	Calajax.Registry.options.weekstart,
			weekMode : 'liquid',
			aspectRatio: 1.7,
			editable: true,
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			buttonText: this.translate( 'buttonText' ),
			columnFormat: {month:'ddd'},
			events: Calajax.MonthView.loadEvents(),
			eventClick: function(calEvent) {
				calEvent.displayEvent();
		        return false;
			},
			loading: function(bool) {
				if (bool) jQuery('#'+Calajax.Registry.divcontainer.loading).show();
				else jQuery('#'+Calajax.Registry.divcontainer.loading).hide();
			},
			eventDrop: function(ev, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
				if(ev.freq!='none' && ev.parent_startdate != undefined){
					ev.start_date = ev.parent_startdate;
					ev.end_date = ev.parent_enddate;
					ev.start_time = ev.parent_starttime;
					ev.end_time = ev.parent_endtime;
					delete ev.startObject;
					delete ev.endObject;
					ev = new Calajax.Event(ev);
					ev.startObject = new Date(ev.startObject.getTime()+(dayDelta*60*60*24*1000));
					ev.endObject = new Date(ev.endObject.getTime()+(dayDelta*60*60*24*1000)-20);
					ev.start = ev.startObject;
					ev.end = ev.endObject;
				}
				Calajax.Event.startEventSave(ev);
			},
			eventRender: function(event, element){
				var view = Calajax.MainObjectFactory.getObject( 'monthview' ).fullcalendarObject.fullCalendar('getView').name
				switch(view){
					case 'month':
						return Calajax.Event.renderEventForMonth(event);
					case 'day':
						return Calajax.Event.renderEventForDay(event);
					case 'week':
						return Calajax.Event.renderEventForWeek(event);
				}
			},
			
			eventAfterRender: function(event, eventElement){
				eventElement.myClass = event.className;
				Calajax.CalendarView.calendar.subscribeToCalendar(eventElement, event);
			},
			
			dayClick: function(date){
				if(Calajax.Rights.create.event==true) {
					Calajax.Registry.divcontainer.lastView = Calajax.Registry.divcontainer.currentView; 
					Calajax.Main.eventViewCommand.execute(
							new Calajax.Event({
								startObject : date,
								endObject : new Date(date),
								allday : 1,
								event_type : 0,
								freq : "none"
							}));
				}
	            return false;
			},
			viewDisplay: function( calendar ){

				// +------------------------------------------------------------
				// | Activate links on day column header
				// +------------------------------------------------------------
				//if ( Calajax.Registry.options.activateHeaderLinksOnMonthView == true ) {

					Calajax.Util.addDayViewLinks();

				//}

			}
		});
	},
	
	next : function () {
		this.fullcalendarObject.fullCalendar('next');
	},
	
	previous : function () {
		this.fullcalendarObject.fullCalendar('prev');
	},
	
	today : function () {
		this.fullcalendarObject.fullCalendar('today');
	},


	/**
	 * This method is called at COMMAND each time the view is selected.
	 * Is used to update between views date ranges
	 */
	activatedViaCommand : function () {
		if(parseInt(this.currentDate.format('yyyymm01')) > parseInt(Calajax.Registry.getdate.format('yyyymmdd'))
				|| parseInt(this.currentDate.format('yyyymm')+this.currentDate.getMonthDays()) < parseInt(Calajax.Registry.getdate.format('yyyymmdd'))){
			this.currentDate = Calajax.Registry.getdate;
		}
		Calajax.CalendarView.calendar.emptyCalendarEvents();
		this.fullcalendarObject.fullCalendar('gotoDate', Calajax.Registry.getdate.getFullYear(), Calajax.Registry.getdate.getMonth(), Calajax.Registry.getdate.getDate());
	},
	
	removeAndAddEvents : function (eventId, events) {
		this.fullcalendarObject.fullCalendar( 'removeAndAddEvents', eventId, events );
	}

};



	 
var MILLIS_IN_DAY = 86400000;
var MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;

Calajax.MonthView.loadEvents = function() {
			
	return function(start, end, callback) {
		Calajax.MonthView.viewStart = start;
		Calajax.MonthView.viewEnd = end;
		
		Calajax.Util.refreshInfoText();

		Calajax.Event.getEvents(start, end, function(data){
			var events = [];
			if (data){
				jQuery.each(data, function(i, entry) {
					events.push(new Calajax.Event(entry));
				});
			}
			callback(events);
		});
	};
};

// +----------------------------------------------------------------------------
// | Extend View
// +----------------------------------------------------------------------------

/**
 * Extend
 */
jQuery.extend( true, Calajax.MonthView.prototype, new Calajax.View() );

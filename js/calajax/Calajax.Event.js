/*******************************************************************************
 * Copyright notice
 * 
 * (c) 2009 Mario Matzulla (c) 2009 Christian Technology Ministries
 * International Inc. All rights reserved
 * 
 * This file is part of the Web-Empowered Church (WEC)
 * (http://WebEmpoweredChurch.org) ministry of Christian Technology Ministries
 * International (http://CTMIinc.org). The WEC is developing TYPO3-based
 * (http://typo3.org) free software for churches around the world. Our desire is
 * to use the Internet to help offer new life through Jesus Christ. Please see
 * http://WebEmpoweredChurch.org/Jesus.
 * 
 * You can redistribute this file and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 * 
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 * 
 * This file is distributed in the hope that it will be useful for ministry, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * This copyright notice MUST APPEAR in all copies of the file!
 ******************************************************************************/

Calajax.Event = function (data) {
	
	this.startObject = new Date();
	this.endObject = new Date();
	this.showTime = false;
	this.className = [];
	this.draggable = false;
	this.url = '';
	this.event_type = 0;
	
	var self = this;
	for(var _key in data){
		if(typeof data[_key] != "function"){
			this[_key] = data[_key];
		}
	};
	
	this.id = this.uid;
	this.calendar_id = this.calendar_uid?this.calendar_uid:this.calendaruid;
	if(parseInt(this.eventtype) == 4) {
		this.model_type = 'tx_cal_todo';
		this.objecttype = 'todo';
	} else {
		this.model_type = "tx_cal_phpicalendar";
		this.objecttype = 'event';
	}
	this.event_type = this.eventtype;
	this.interval = this.intrval;
	
	if(data['startObject'] == undefined ){
		if(this.start_date){
			this.startObject = Calajax.Util.getDateFromYYYYMMDD(this.start_date);
		}
		if(this.start_time){
			var minutes = this.start_time%3600;
			var hours = this.start_time/3600;
			this.startObject.setMinutes(minutes);
			this.startObject.setHours(hours);
			this.startObject.setSeconds(0);
			this.startObject.setMilliseconds(0);
		}
	}
	
	if(data['endObject'] == undefined ) {

		if(this.end_date){
			this.endObject = Calajax.Util.getDateFromYYYYMMDD(this.end_date);
		}
		if(this.end_time){
			var minutes = this.end_time%3600;
			var hours = this.end_time/3600;
			this.endObject.setMinutes(minutes);
			this.endObject.setHours(hours);
			this.endObject.setSeconds(0);
			this.endObject.setMilliseconds(0);
		}
	}
	
	this.start = this.startObject;
	this.end = this.endObject;
	
	if(this.isallowedtoedit==1) {
		this.editable = true;
	} else {
		this.editable = false;
	}
	this.url = "irgendwas";
	
	if(parseInt(this.until) < 20000000){
		this.until = 0;
	}
	
	if(this.completed == ''){
		this.completed = 0;
	}
	if(this.status == '' || this.status == 0){
		this.status = "NEEDS-ACTION";
	}
	if(this.priority == ''){
		this.priority = 0;
	}
	if(this.completed == ''){
		this.completed = 0;
	}
		
	this.status_text = Calajax.Event.statusTransformator(this.status);

	this.setNewHeaderStyle = function(style){
		if(style != undefined){
			
			this.headerstyle = style.replace("_allday","");
			
			// either allday or more than one day
			if(this.allday==1 || this.startObject.format('yyyymmdd') != this.endObject.format('yyyymmdd')){
				this.headerstyle = this.headerstyle+"_allday";
				this.showTime = false;
				this.allDay = true;
			} else {
				this.showTime = true;
				this.allDay = false;
			}
			this.className = [this.headerstyle];
		}
	};
	
	this.getCategoryIds = function(){
		var categoryIds = [];
		for(var i in this.categories){
			categoryIds.push(this.categories[i].uid);
		}
		return categoryIds;
	};
	
	this.setCategoryIds = function(categoryIds){
		if(typeof(categoryIds)=='object'){
			this.categories = categoryIds;
		} else if(typeof(categoryIds)=='string'){
			this.categories = {};
			var catIds = categoryIds.split(',');
			for(var i=0; i < catIds.length; i++){
				this.categories[catIds[i]] = {};
				this.categories[catIds[i]]['uid'] = catIds[i];
			}
		}
	};
	
	this.setNewHeaderStyle(this.headerstyle);

	if(this.startObject.format('yyyymmdd') != this.endObject.format('yyyymmdd') && this.allday==0){
		this.showTime = true;
	}
	
	this.className = [this.headerstyle];

	this.draggable = this.isallowedtoedit == 1;

	/**
	 * Edit Bar for Event depending on event Rights
	 *
	 */
	this.editBar = function() {

		var that = this;

		var editBar = jQuery( '<div class="eventEditBar EventEditBar' + that.id + '"></div>' );

		if ( that.isallowedtoedit == 1 ) {
			editBar.append(
				jQuery( '<span class="editable">&nbsp;</span>' ).click( function( e ) {
					
					Calajax.Registry.divcontainer.lastView = Calajax.Registry.divcontainer.currentView;
					Calajax.Main.eventViewCommand.execute( that );

					e.stopPropagation();

				})
			);

		}
		if( that.isallowedtodelete == 1 ) {
			editBar.append(
				jQuery( '<span class="deletable">&nbsp;</span>' ).click( function( e ) {

					var modalWindow = 'jQuery("#eventDeleteConfirmBox").dialog({ ' +
						'autoOpen: false, ' +
						'width: 400, ' +
						'modal: true, ' +
						'resizable: false, ' +
						'buttons: { ' +
							Calajax.Translator.getTranslation('month','buttonText').deleteText + '  : function() { ' +
								'Calajax.Event.deleteEvent( that, function( data ){} ); ' +
								'Calajax.Main.removeAndAddEvents( that.id, [] ); ' +
								'jQuery(this).dialog("close"); ' +
								'jQuery(this).dialog("destroy");' +
							'}, ' +
							Calajax.Translator.getTranslation('month','buttonText').cancel + ' : function() { ' +
								'jQuery(this).dialog("close"); ' +
								'jQuery(this).dialog("destroy");' +
							'} ' +
						'} ' +
					'}) ';

					// This is needed in order to parse button translations
					eval( modalWindow );
			
					jQuery('#eventDeleteConfirmBox').dialog('open');

					e.stopPropagation();

				})
			);
		}
		/*
		var eventStr = '';
		if(this.isallowedtoedit == 1){
			eventStr += '<span class="editable">&nbsp;</span>';
		}
		if(this.isallowedtodelete == 1){
			eventStr += '<span class="deletable">&nbsp;</span>';
		}
		*/
		return editBar;
	};

	this.displayEvent = function(){
		//check the type of event
		// 0 = normal event
		// 1 = internal link
		// 2 = external link
		// 3 = meeting
		// 4 = todo
		switch(parseInt(this.type)){
			case 0:
				Calajax.EventView.displayEvent(this);
				break;
			case 1:
			case 2:
				window.open(this.event_link);
				break;
			case 3:
				//TODO: displayMeeting
				Calajax.EventView.displayEvent(this);
				break;
			case 4:
				Calajax.EventView.displayEvent(this);
				break;
		}
	};
	
	this.getRecurringRule = function (){
		if(this.freq!='none' && this.freq!=''){
			return {'FREQ':this.freq,'INTERVAL':this.intrval};
		}
		return {};
	};
	
	this.getRdateValues = function (){
		return this.rdate.split(','); 
	};
};

Calajax.Event.statusTransformator = function(statusId){

	switch(statusId){
		case "0":
			return "No action";
			break;
		case "NEEDS-ACTION":
			return "Needs action";
			break;
		case "COMPLETED":
			return "Completed";
			break;
		case "IN-PROGRESS":
			return "In progress";
			break;
		case "CANCELLED":
			return "Cancelled";
			break;
	}
};

Calajax.Event.renderEventForAllDay = function(event){
	return Calajax.Event.renderEventForMonth(event); 
};

Calajax.Event.renderEventForMonth = function(event){
	var pre = '';
	var post = '';
	var eventStr = event.title;
	if(event.showTime){
		if (event.start.getHours() || event.start.getMinutes() || event.end.getHours() || event.end.getMinutes()) {
			eventStr = jQuery.fullCalendar.formatDate(event.start, Calajax.Registry.format.monthEventTime) + ' ' + eventStr;
		}
	}
	
	eventStr = '<span class="event_text">' + eventStr + '</span>';
	
	if(event.type == 4){
		eventStr = '<span class="event_status_'+event.status.toLowerCase()+'" title="'+event.status.toLowerCase()+'">&nbsp;</span>' + eventStr;
	}
	/*
	if(event.isallowedtoedit == 1){
		eventStr += '<span class="editable">&nbsp;</span>';
	}
	if(event.isallowedtodelete == 1){
		eventStr += '<span class="deletable">&nbsp;</span>';
	}
	*/
	var _class = '';
	if(typeof event.className == 'object'){
		_class = event.className.join(' ');
	}
	if(event.type==4 && event.status =='COMPLETED'){
		_class += ' completed';
	}

	//var result =  jQuery(  "<div class='event " + _class + "'>" + eventStr + "</div>" ).append( event.editBar() )[0];
	var result = "<div class='event " + _class + "'>" + eventStr + "</div>";
	return result;
};


Calajax.Event.decodeType = function ( typeID ) {
	switch ( typeID ) {
	case '0':
		return 'event';
	case '1':
		return 'intlnk';
	case '2':
		return 'exturl';
	case '3':
		return 'meeting';
	case '4':
		return 'todo';
	}
};


Calajax.Event.getEvents = function(start, end, callback){

	var requestNumber = ++Calajax.Event.getEvents.requestNumber;

	Calajax.Util.ajax({
		beforeSend : function() {
			/* If the user already requested another set we stop */
			if ( requestNumber != Calajax.Event.getEvents.requestNumber )
				return false;
			return true;
		},
		data : {
			'eID': 'cal_ajax',
			'tx_cal_controller[pid]': Calajax.Registry.request.pid,
			'tx_cal_controller[view]': 'load_events',
			'tx_cal_controller[start]': start.format('yyyymmdd'),
			'tx_cal_controller[end]': end.format('yyyymmdd')
		},
		async: true, // Set asynchronous AJAX requests
		success : function( data ) {
			/* If the user already requested another set we stop */
			if ( requestNumber == Calajax.Event.getEvents.requestNumber )
				callback(data);
			else return false;
		}

	});
};
/* Current request number, used to validate request send */
Calajax.Event.getEvents.requestNumber = 0;

Calajax.Event.startEventSave = function(event){

	// Start updating event
	Calajax.Util.showLoadingMask();

	if(event.uid > 0){
		var newRecurringEvents = Calajax.Recurrence.recurringEvent(event);
		// Updating events on clientside first
		Calajax.Main.removeAndAddEvents(event.id,newRecurringEvents);
	}
	
	Calajax.Event.updateEvent(event, function(data){
		var newItemArray = [];
		for(var dataItem in data){
			// calendar_uid is not set
			data[dataItem]['calendar_uid'] = data[dataItem].calendar_id;
			// we use the style of the calendar to color the events
			if(data[dataItem]['headerstyle'] == undefined){
				data[dataItem]['headerstyle'] = Calajax.CalendarView.calendar.getCalendar(data[dataItem].calendar_id).headerstyle;
			}
			var event = new Calajax.Event(data[dataItem]);
			newItemArray.push(event);
			if(event.eventtype == 4){
				Calajax.CalendarView.task.addTask(event);
			}
		}
		Calajax.Main.removeAndAddEvents(event.id,newItemArray);
		Calajax.CalendarView.task.renderView();
	});
};

Calajax.Event.saveEvent = function(event, callback){
	var allowedParams = Calajax.Registry.options.event.allowedRequestParams;
	var params = {
		"eID":"cal_ajax",
		"tx_cal_controller[view]":"save_event",
		"tx_cal_controller[pid]":Calajax.Registry.request.pid,
		"tx_cal_controller[type]":event.model_type,
		"tx_cal_controller[start_date]":event.startObject.format('yyyymmdd'),
		"tx_cal_controller[end_date]":event.endObject.format('yyyymmdd'),
		"tx_cal_controller[start_time]":event.start_time,
		"tx_cal_controller[end_time]":event.end_time,
		"tx_cal_controller[formCheck]" : 1,
		"tx_cal_controller[maxDate]" :Calajax.MonthView.viewEnd.format('yyyymmdd')
	};
	for(var i=0; i < allowedParams.length; i++){
		if(event[allowedParams[i]] != undefined){
			if(event[allowedParams[i]]['format']!=undefined){
				params["tx_cal_controller["+allowedParams[i]+"]"] = event[allowedParams[i]].format('yyyymmdd');
			} else {
				params["tx_cal_controller["+allowedParams[i]+"]"] = event[allowedParams[i]];
			}
		}
	}

	/*
	 * Process Request
	 * Centralize request point
	 */
	Calajax.Util.ajax({
		data : params,
		success : function( data ) {

			callback(data);

			// Stop updating event
			Calajax.Util.hideLoadingMask();

		}
	});

};

Calajax.Event.updateEvent = function(event, callback){
	Calajax.Event.saveEvent(event, callback);
};

Calajax.Event.deleteEvent = function(event, callback){
	
	// Start updating event
	Calajax.Util.showLoadingMask();

	/*
	 * Process Request
	 * Centralize request point
	 */
	Calajax.Util.ajax({
		data : {
			"eID":"cal_ajax",
			"tx_cal_controller[view]":"remove_event",
			"tx_cal_controller[pid]":Calajax.Registry.request.pid,
			"tx_cal_controller[uid]":event.uid,
			"tx_cal_controller[type]":event.model_type
		},
		success : function( data ) {

			callback(data);

			// Stop updating event
			Calajax.Util.hideLoadingMask();

		}
	});

	if(parseInt(event.eventtype) == 4){
		Calajax.CalendarView.task.removeTask(event.uid);
		Calajax.CalendarView.task.renderView();
	}
};
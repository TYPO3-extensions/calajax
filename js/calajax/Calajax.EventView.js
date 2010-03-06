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

Calajax.EventView = function(){

	// Identifier for calendar placeholder.
	this.placeHolderId = Calajax.Registry.divcontainer.eventView;
}

Calajax.EventView.prototype	= {

	/*
	* Translator Simplified
	* Acts as a bridge for the real translator object
	*/
	getTranslationKey : function () {
		return Calajax.Registry.translator.monthViewRequestKey;
	},
	
	refresh : function(){
	},
	
	eventViewObject : false,
	eventObject : false,
	
	//Fields:
	titleField : false,
	statusField : false,
	priorityField : false,
	completedField : false,
	eventTypeField : false,
	startdateField : false,
	starttimeField : false,
	enddateField : false,
	endtimeField : false,
	alldayField : false,
	byDayRows : false,
	byDayField : false,
	byMonthDayRows : false,
	byMonthDayField : false,
	suField : false,
	moField : false,
	tuField : false,
	weField : false,
	thField : false,
	frField : false,
	saField : false,
	freqField : false,
	countField : false,
	intervalField : false,
	addByDayRecurrenceField : false,
	addByMonthDayRecurrenceField : false,
	untilField : false,
	untilFieldSelector : false,
	neverFieldSelector : false,
	existingLocationSelector : false,
	newLocationSelector : false,
	calendarIdField : false,
	descriptionField : false,
	locationTextField : false,
	locationIdField : false,
	newLocationName : false,
	newLocationStreet : false,
	newLocationZip : false,
	newLocationCity : false,
	
	// Labels:
	statusLabel : false,
	priorityLabel : false,
	completedLabel : false,
	
	oldTime : 0,

	/*
	* Build EventView
	*/
	build : function(eventRef){
		var that = this;
		this.eventObject = eventRef;
		this.eventViewObject = jQuery("#" +this.placeHolderId);
		this.titleField = this.eventViewObject.find("input[name='tx_cal_controller\[title\]']");
		this.statusField = this.eventViewObject.find("select[name='tx_cal_controller\[status\]']");
		this.priorityField = this.eventViewObject.find("select[name='tx_cal_controller\[priority\]']");
		this.completedField = this.eventViewObject.find("input[name='tx_cal_controller\[completed\]']");
		this.eventTypeField = this.eventViewObject.find("select[name='tx_cal_controller\[event_type\]']");
		this.eventTypeField.click(function() {
			that.eventTypeChanged();
		});
		this.statusLabel = this.eventViewObject.find("label[for='edit_event_view_status']");
		this.priorityLabel = this.eventViewObject.find("label[for='edit_event_view_priority']");
		this.completedLabel = this.eventViewObject.find("label[for='edit_event_view_completed']");
		this.startdateField = this.eventViewObject.find("input[name='tx_cal_controller\[startdate\]']");
		this.startdateField.click(function() {
			that.validate();
		});
		this.starttimeField = this.eventViewObject.find("input[name='tx_cal_controller\[starttime\]']");
		this.starttimeField.click(function() {
			if (that.endtimeField.val()) { // Only update when second input has a value.
				// Calculate duration.
				var duration = (jQuery.timePicker(that.endtimeField).getTime() - this.oldTime);
				var time = jQuery.timePicker(that.starttimeField).getTime();
				// Calculate and update the time in the second input.
				jQuery.timePicker(that.endtimeField).setTime(new Date(new Date(time.getTime() + duration)));
				oldTime = time;
			}
			that.validate();
		});
		this.enddateField = this.eventViewObject.find("input[name='tx_cal_controller\[enddate\]']");
		this.enddateField.click(function() {
			that.validate();
		});
		this.endtimeField = this.eventViewObject.find("input[name='tx_cal_controller\[endtime\]']");
		this.endtimeField.click(function() {
			that.validate();
		});
		this.alldayField = this.eventViewObject.find("input[name='tx_cal_controller\[allday\]']");
		this.alldayField.click(function(){
			if(that.alldayField.attr('checked')==true){
				that.starttimeField.hide();
				that.endtimeField.hide();
			} else {
				that.starttimeField.show();
				that.endtimeField.show();
			}
		});
		this.byDayRows = this.eventViewObject.find("span[class='byday-row']");
		this.byDayField = this.eventViewObject.find("input[name='tx_cal_controller\[byday\]']");
		this.byMonthDayRows = this.eventViewObject.find("div[class='bymonthday-row']");
		this.byMonthDayField = this.eventViewObject.find("input[name='tx_cal_controller\[bymonthday\]']");
		this.suField = this.eventViewObject.find("input[name='tx_cal_controller\[su\]']");
		this.moField = this.eventViewObject.find("input[name='tx_cal_controller\[mo\]']");
		this.tuField = this.eventViewObject.find("input[name='tx_cal_controller\[tu\]']");
		this.weField = this.eventViewObject.find("input[name='tx_cal_controller\[we\]']");
		this.thField = this.eventViewObject.find("input[name='tx_cal_controller\[th\]']");
		this.frField = this.eventViewObject.find("input[name='tx_cal_controller\[fr\]']");
		this.saField = this.eventViewObject.find("input[name='tx_cal_controller\[sa\]']");
		this.freqField = this.eventViewObject.find("select[name='tx_cal_controller\[freq\]']");
		this.freqField.click( function() {
			switch (that.freqField.val()){
				case "day": 
					that.eventViewObject.find("#edit_event_view_interval_container").show();
					that.eventViewObject.find("#edit_event_view_byweekday_container").hide();
					that.eventViewObject.find("#edit_event_view_byday_container").hide();
					that.eventViewObject.find("#edit_event_view_bymonthday_container").hide();
					that.eventViewObject.find("#edit_event_view_until_container").show();
					break;
				case "week":
					that.eventViewObject.find("#edit_event_view_interval_container").show();
					that.eventViewObject.find("#edit_event_view_byweekday_container").show();
					that.eventViewObject.find("#edit_event_view_byday_container").hide();
					that.eventViewObject.find("#edit_event_view_bymonthday_container").hide();
					that.eventViewObject.find("#edit_event_view_until_container").show();
					break;
				case "month":
					that.eventViewObject.find("#edit_event_view_interval_container").show();
					that.eventViewObject.find("#edit_event_view_byweekday_container").show();
					that.eventViewObject.find("#edit_event_view_byday_container").show();
					that.eventViewObject.find("#edit_event_view_bymonthday_container").hide();
					that.eventViewObject.find("#edit_event_view_until_container").show();
					break;
				case "year":
					that.eventViewObject.find("#edit_event_view_interval_container").show();
					that.eventViewObject.find("#edit_event_view_byweekday_container").hide();
					that.eventViewObject.find("#edit_event_view_byday_container").show();
					that.eventViewObject.find("#edit_event_view_bymonthday_container").show();
					that.eventViewObject.find("#edit_event_view_until_container").show();
					break;
				default:
					that.eventViewObject.find("#edit_event_view_interval_container").hide();
					that.eventViewObject.find("#edit_event_view_byweekday_container").hide();
					that.eventViewObject.find("#edit_event_view_byday_container").hide();
					that.eventViewObject.find("#edit_event_view_bymonthday_container").hide();
					that.eventViewObject.find("#edit_event_view_until_container").hide();
			}
		});
		this.intervalField = this.eventViewObject.find("select[name='tx_cal_controller\[interval\]']");
		this.addByDayRecurrenceField = this.eventViewObject.find("img[class='addByDayRecurrence']");
		this.addByDayRecurrenceField.click(function(){
			that.byDayRows.append(that.generateByDayRow(""));
			that.byDayRowChanged();
		});
		
		this.addByMonthDayRecurrenceField = this.eventViewObject.find("img[class='addByMonthDayRecurrence']");
		this.addByMonthDayRecurrenceField.click(function(){
			that.byMonthDayRows.append(that.generateByMonthDayRow(""));
			that.byMonthDayRowChanged();
		});
		
		this.countField = this.eventViewObject.find("input[name='tx_cal_controller\[count\]']");
		
		this.untilField = this.eventViewObject.find("input[name='tx_cal_controller\[until\]']");
		this.untilField.change(function() {
			that.validate();
		});
		
		this.untilFieldSelector = this.eventViewObject.find("#edit_event_view_until");
		this.untilFieldSelector.click(function(){
			if(that.untilFieldSelector.attr("checked")==true){
				that.untilField.show();
			}
		});
		this.neverFieldSelector = this.eventViewObject.find("#edit_event_view_forever");
		this.neverFieldSelector.click(function(){
			if(that.neverFieldSelector.attr("checked")==true){
				that.untilField.hide();
			}
		});
		
		this.calendarIdField = this.eventViewObject.find("select[name='tx_cal_controller\[calendar_id\]']");
		this.descriptionField = this.eventViewObject.find("textarea[name='tx_cal_controller\[description\]']");
		//this.descriptionField.markItUp(Calajax.Registry.options.myHtmlSettings);
		this.locationTextField = this.eventViewObject.find("input[name='locationText']");
		var locationUrl = Calajax.Registry.request.requestUrl+
			'&eID=cal_ajax'+
			'&tx_cal_controller[pid]='+Calajax.Registry.request.pid+
			'&tx_cal_controller[view]=search_location'+
			'&tx_cal_controller[type]=tx_cal_location';
		
		this.locationTextField.autocomplete(locationUrl,{
				dataType: "json",
				matchSubset: false,
				formatItem: function(item, i, max, value, term) {
					return item.displayText;
				},
				parse: function(data){
					var locations = [];
					for(var i = 0; i < data.length; i++){
						data[i].displayText = Calajax.Location.getLocationText(data[i]); 
						locations.push({
							data: data[i],
						});
					}
					return locations;
				}
		}).result(function(event, item) {
			that.locationIdField.val(item.uid);
			that.locationTextField.val(Calajax.Location.getLocationText(item, true));
		});	
		
		
		this.existingLocationSelector = this.eventViewObject.find("#existingLocationSelector");
		this.existingLocationSelector.click(function(){
			if(that.existingLocationSelector.attr('checked')==true){
				that.eventViewObject.find("span[class='existingLocation']").slideDown("fast");
				that.eventViewObject.find("span[class='newLocation']").slideUp("fast");
			}
		});
		
		this.newLocationSelector = this.eventViewObject.find("#newLocationSelector");
		this.newLocationSelector.click(function(){
			if(that.newLocationSelector.attr('checked')==true){
				that.eventViewObject.find("span[class='existingLocation']").slideUp("fast");
				that.eventViewObject.find("span[class='newLocation']").slideDown("fast");
			}
		});
		this.locationIdField = this.eventViewObject.find("input[name='tx_cal_controller\[location_id\]']");
		
		this.newLocationName = this.eventViewObject.find("input[name='tx_cal_controller\[location_name\]']");
		this.newLocationStreet = this.eventViewObject.find("input[name='tx_cal_controller\[location_street\]']");
		this.newLocationZip = this.eventViewObject.find("input[name='tx_cal_controller\[location_zip\]']");
		this.newLocationCity = this.eventViewObject.find("input[name='tx_cal_controller\[location_city\]']");
		
		this.startdateField.datepicker({dateFormat:Calajax.Registry.format.datepickerDate});
		this.enddateField.datepicker({dateFormat:Calajax.Registry.format.datepickerDate});
		this.untilField.datepicker({dateFormat:Calajax.Registry.format.datepickerDate});
		
		this.populateView(eventRef);
	},
	
	show : function(eventRef){
		this.populateView(eventRef);
	},
	
	populateView : function(eventRef){
		var that = this;
		this.eventObject = eventRef;
		Calajax.Util.resetForm(this.eventViewObject);
		
		this.titleField.val(eventRef.title);
		this.statusField.val(eventRef.status);
		this.priorityField.val(eventRef.priority);
		this.completedField.val(eventRef.completed);
		this.eventTypeField.val(eventRef.event_type);
		this.eventTypeField.trigger('click');
		if(eventRef.parent_startdate){
			var parentStart = Calajax.Util.getDateFromYYYYMMDD(eventRef.parent_startdate);
			var minutes = eventRef.parent_starttime%3600;
			var hours = eventRef.parent_starttime/3600;
			parentStart.setMinutes(minutes);
			parentStart.setHours(hours);
			parentStart.setSeconds(0);
			parentStart.setMilliseconds(0);
			this.startdateField.val(parentStart.format(Calajax.Registry.format.date));
			this.starttimeField.val(parentStart.format(Calajax.Registry.format.timepickerTime));
			
			var parentEnd = Calajax.Util.getDateFromYYYYMMDD(eventRef.parent_enddate);
			var minutes = eventRef.parent_endtime%3600;
			var hours = eventRef.parent_endtime/3600;
			parentEnd.setMinutes(minutes);
			parentEnd.setHours(hours);
			parentEnd.setSeconds(0);
			parentEnd.setMilliseconds(0);
			this.enddateField.val(parentEnd.format(Calajax.Registry.format.date));
			this.endtimeField.val(parentEnd.format(Calajax.Registry.format.timepickerTime));
		} else {
			this.startdateField.val(eventRef.startObject.format(Calajax.Registry.format.date));
			this.starttimeField.val(eventRef.startObject.format(Calajax.Registry.format.timepickerTime));
			this.enddateField.val(eventRef.endObject.format(Calajax.Registry.format.date));
			this.endtimeField.val(eventRef.endObject.format(Calajax.Registry.format.timepickerTime));
		}
		this.alldayField.attr('checked', eventRef.allday==1?true:false);
		this.suField.attr('checked', false);
		this.moField.attr('checked', false);
		this.tuField.attr('checked', false);
		this.weField.attr('checked', false);
		this.thField.attr('checked', false);
		this.frField.attr('checked', false);
		this.saField.attr('checked', false);
		
		if(eventRef.byday != undefined && eventRef.byday != ""){
			var byDayArray = eventRef.byday.split(",");
			for(var i = 0; i < byDayArray.length; i++){
				switch(byDayArray[i].toLowerCase()){
					case "su":
						this.suField.attr('checked', true);
						break;
					case "mo":
						this.moField.attr('checked', true);
						break;
					case "tu":
						this.tuField.attr('checked', true);
						break;
					case "we":
						this.weField.attr('checked', true);
						break;
					case "th":
						this.thField.attr('checked', true);
						break;
					case "fr":
						this.frField.attr('checked', true);
						break;
					case "sa":
						this.saField.attr('checked', true);
						break;
				}
			}
		}
		
		this.freqField.val(eventRef.freq);
		this.intervalField.val(eventRef.interval);
		this.countField.val(eventRef.cnt>0?eventRef.cnt:"");
		this.untilField.val(Calajax.Util.getDateFromYYYYMMDD(eventRef.until).format(Calajax.Registry.format.date));
		
		
		
		this.calendarIdField.val(Calajax.CalendarView.renderSelectorOptions('edit_event_view_calendar_id', eventRef.calendar_uid));
		this.descriptionField.val(eventRef.description);
		
		
		this.eventViewObject.find("span[class='existingLocation']").show();
		this.eventViewObject.find("span[class='newLocation']").hide();
		
		if(eventRef.location_id > 0){
			
			Calajax.Location.loadLocation(eventRef.location_id, function(data) {
				that.locationTextField.val(Calajax.Location.getLocationText(data, true));
			});
		}
		
		this.locationIdField.val(eventRef.location_id);
		
		this.freqField.trigger("click");
		if(parseInt(eventRef.until) < 20000000){
			this.untilFieldSelector.trigger("click");
		} else {
			this.neverFieldSelector.trigger("click");
		}
		this.existingLocationSelector.click();
		
		var CalendarViewObject = Calajax.MainObjectFactory.getObject( 'calendarview' );
		var translation = CalendarViewObject.translate( 'buttonText' );
		
		var buttons = {};
		
		buttons[translation.cancel] = function(){
			that.eventViewObject.dialog("close");
		};
		
		if(allowedToCreateEvents || parseInt(eventRef.isallowedtoedit) == 1){
			buttons[translation.save] = function(){
				that.eventViewObject.dialog("close");
				that.saveEvent();
			};
		}
		if(eventRef.uid > 0 && parseInt(eventRef.isallowedtodelete) == 1) {
			buttons[translation.deleteText] = function(){
				that.eventViewObject.dialog("close");
				that.deleteEvent();
			};
		}
		
		jQuery('#edit_event_view_title_details').accordion({collapsible: true, active: false});
		
		var dialogTitle = create_event_label;
		if(eventRef.uid > 0){
			dialogTitle = edit_event_label;
		}
		
		this.eventViewObject.dialog({
			modal: true,
			width: 600,
			title: dialogTitle,
			autoOpen: false,
			position: 'center',
			close: function() {
				that.eventViewObject.dialog("destroy");
				//that.eventViewObject.hide();
				Calajax.Main.showLastView();
			},
			buttons: buttons,
		});
		this.eventViewObject.dialog('open');
		
		//dialogContent.dialog('option', 'dialogClass', 'showEvent_'+eventRef.headerstyle);
		//this.eventViewObject.show();
		this.titleField.focus();
		
		//timePicker uses the position of the rendered object to display the options.
		//If the object isn't rendered yet, it displays it at 0,0
		this.starttimeField.timePicker({step:Calajax.Registry.format.timesteps});
		this.endtimeField.timePicker({step:Calajax.Registry.format.timesteps});
		
		if(eventRef.allday==1){
			this.starttimeField.hide();
			this.endtimeField.hide();
		}
		this.oldTime = jQuery.timePicker(this.endtimeField).getTime();
		Calajax.Util.hideLoadingMask();
	},
	
	saveEvent : function(){
		if(!this.validate()){
			return false;
		}
		var _eventRef = this.eventObject;
		_eventRef.event_type = this.eventTypeField.val();
		if(parseInt(_eventRef.event_type) == 4) {
			_eventRef.model_type = 'tx_cal_todo';
			_eventRef.objecttype = 'todo';
		} else {
			_eventRef.model_type = "tx_cal_phpicalendar";
			_eventRef.objecttype = 'event';
		}
		_eventRef.startObject = this.startdateField.datepicker( 'getDate' );
		var starttimeArray = this.starttimeField.val().split(":");
		_eventRef.start_time = parseInt(starttimeArray[0]*3600) + parseInt(starttimeArray[1]*60);
		_eventRef.startObject.setHours(starttimeArray[0]);
		_eventRef.startObject.setMinutes(starttimeArray[1]);
		_eventRef.endObject = this.enddateField.datepicker( 'getDate' );
		var endtimeArray = this.endtimeField.val().split(":");
		_eventRef.end_time = parseInt(endtimeArray[0]*3600) + parseInt(endtimeArray[1]*60);
		_eventRef.endObject.setHours(endtimeArray[0]);
		_eventRef.endObject.setMinutes(endtimeArray[1]);
		
		_eventRef.title = this.titleField.val();
		_eventRef.description = this.descriptionField.val();
		
		_eventRef.calendar_uid = this.calendarIdField.val();
		_eventRef.calendar_id = _eventRef.calendar_uid;
		
		var className = Calajax.CalendarView.calendar.getCalendar(_eventRef.calendar_uid).headerstyle;
		if(className!=''){
			_eventRef.className = className;
		}
		
		_eventRef.allday = this.alldayField.attr('checked')==true?1:0;
		_eventRef.showTime = !_eventRef.allday;
		
		_eventRef.freq = this.freqField.val();
		_eventRef.frequency_id = _eventRef.freq;
		_eventRef.cnt = this.countField.val()>0?this.countField.val():"";
		_eventRef.count = _eventRef.cnt;
		_eventRef.interval = this.intervalField.val();
		if(_eventRef.freq == "week"){
			_eventRef.byday = "";
			_eventRef.byday += this.suField.attr('checked')==true?",SU":"";
			_eventRef.byday += this.moField.attr('checked')==true?",MO":"";
			_eventRef.byday += this.tuField.attr('checked')==true?",TU":"";
			_eventRef.byday += this.weField.attr('checked')==true?",WE":"";
			_eventRef.byday += this.thField.attr('checked')==true?",TH":"";
			_eventRef.byday += this.frField.attr('checked')==true?",FR":"";
			_eventRef.byday += this.saField.attr('checked')==true?",SA":"";
			if(_eventRef.byday.length > 0){
				_eventRef.byday = _eventRef.byday.substr(1);
			}
		} else {
			_eventRef.byday = this.byDayField.val();
		}
		_eventRef.by_day = _eventRef.byday;
		_eventRef.bymonthday = this.byMonthDayField.val();
		_eventRef.by_monthday = _eventRef.bymonthday;
		if(this.untilFieldSelector.attr("checked")==true){
			_eventRef.until = this.untilField.datepicker( 'getDate' ).format("yyyymmdd");
		} else {
			_eventRef.until = "0";
		}
		
		if(_eventRef.type == 4){
			_eventRef.status = this.statusField.val();
			_eventRef.priority = this.priorityField.val();
			_eventRef.completed = this.completedField.val();
		}
	
		Calajax.Main.showLastView();
		
		if(this.existingLocationSelector.attr('checked')==true){
			_eventRef.location_id = this.locationIdField.val();
			_eventRef.cal_location = this.locationIdField.val();
			Calajax.Event.startEventSave(_eventRef);
		} else {
			//check if new location fields are filled, create new one and assign the location_id
			
			if(this.newLocationName.val()!="" || this.newLocationCity.val()!=""){
				Calajax.Location.saveLocation(
					{
						name:	this.newLocationName.val(),
						street:	this.newLocationStreet.val(),
						zip:	this.newLocationZip.val(),
						city:	this.newLocationCity.val()
					},
					function(data){
						_eventRef.location_id = data.uid;
						_eventRef.cal_location = data.uid;
						Calajax.Event.startEventSave(_eventRef);
					}
				);
			}
		}
		
		return false;
	},
	
	validate : function() {
		var noFault = true;
		var startObject = this.startdateField.datepicker( 'getDate' );
		var starttimeArray = this.starttimeField.val().split(":");
		var start_time = parseInt(starttimeArray[0]*3600) + parseInt(starttimeArray[1]*60);
		startObject.setHours(starttimeArray[0]);
		startObject.setMinutes(starttimeArray[1]);
		var endObject = this.enddateField.datepicker( 'getDate' );
		var endtimeArray = this.endtimeField.val().split(":");
		var end_time = parseInt(endtimeArray[0]*3600) + parseInt(endtimeArray[1]*60);
		endObject.setHours(endtimeArray[0]);
		endObject.setMinutes(endtimeArray[1]);
		if(endObject.getTime() < startObject.getTime()) {
			this.endtimeField.addClass("error");
			this.enddateField.addClass("error");
			noFault = false;
		} else {
			this.endtimeField.removeClass("error");
			this.enddateField.removeClass("error");
		}
		
		if(this.titleField.val()==""){
			this.titleField.addClass("error");
			this.titleField.focus();
			noFault = false;
		} else {
			this.titleField.removeClass("error");
		}
		if(this.eventTypeField.val()==4 && this.statusField.val()=="COMPLETED" && this.completedField.val() < 100){
			this.statusField.addClass("error");
			this.completedField.addClass("error");
			this.completedField.focus();
			noFault = false;
		} else {
			this.statusField.removeClass("error");
			this.completedField.removeClass("error");
		}
		if(this.calendarIdField.val()>0){
			this.calendarIdField.removeClass("error");
		} else {
			this.calendarIdField.addClass("error");
			this.calendarIdField.focus();
			noFault = false;
		}
		return noFault;
	},
	
	eventTypeChanged : function(){
		if(this.eventTypeField.val()==4){
			this.statusField.show();
			this.statusLabel.show();
			this.priorityField.show();
			this.priorityLabel.show();
			this.completedField.show();
			this.completedLabel.show();
		} else {
			this.statusField.hide();
			this.statusLabel.hide();
			this.priorityField.hide();
			this.priorityLabel.hide();
			this.completedField.hide();
			this.completedLabel.hide();
		}
	},
	
	byDayRowChanged : function(){
		var selects = byDayRows.find("select");
		this.byDayField.val("");
		for(var i = 0; i < selects.length; i=i+2){
			if(i==0){
				this.byDayField.val(this.byDayField.val()+""+jQuery(selects[i]).val()+""+jQuery(selects[i+1]).val());
			}else{
				this.byDayField.val(this.byDayField.val()+","+jQuery(selects[i]).val()+""+jQuery(selects[i+1]).val());
			}
		}
	},
	
	byMonthDayRowChanged : function(){
		var selects = this.byMonthDayRows.find("select");
		this.byMonthDayField.val("");
		for(var i = 0; i < selects.length; i++){
			if(i==0){
				this.byMonthDayField.val(this.byMonthDayField.val()+""+jQuery(selects[i]).val());
			}else{
				this.byMonthDayField.val(this.byMonthDayField.val()+","+jQuery(selects[i]).val());
			}
		}
	},
	
	generateByDayRow : function(value){
		var that = this;
		var row = document.createElement('div');
		row.setAttribute("class","row");
		var count = document.createElement('select');
		count.setAttribute("class", "count");
		jQuery(count).click(function(){
			that.byDayRowChanged();
		});
		
		var all = document.createElement('option');
		all.setAttribute("value", "");
		count.appendChild(all);
		
		var values = {
			"1":"First",
			"2":"Second",
			"3":"Third",
			"4":"Fourth",
			"5":"Fifth",
			"-3":"Third to last",
			"-2":"Second to last",
			"-1":"Last"
		};
		
		for(var value in values){
			var x = document.createElement('option');
			x.setAttribute("value", value);
			x.appendChild(document.createTextNode(values[value]));
			count.appendChild(x);
		}
		
		row.appendChild(count);

		var day = document.createElement('select');
		day.setAttribute("class", "day");
		jQuery(day).click(function(){
			that.byDayRowChanged();
		});
		
		values = {
			"mo":"Monday",
			"tu":"Tuesday",
			"we":"Wednesday",
			"th":"Thursday",
			"fr":"Friday",
			"sa":"Saturday",
			"su":"Sunday",
		};
		
		for(var value in values){
			var x = document.createElement('option');
			x.setAttribute("value", value);
			x.appendChild(document.createTextNode(values[value]));
			day.appendChild(x);
		}
		
		row.appendChild(day);
		row.appendChild(document.createTextNode(" of every month"));
		
		var del = document.createElement('img');
		del.setAttribute("src","typo3conf/ext/cal/template/img/garbage.gif");
		del.setAttribute("class","addByDayRecurrence");
		jQuery(del).click(function(){
			jQuery(this.parentNode).remove();
			that.byDayRowChanged();
		});
		
		row.appendChild(del);

		return row; 
	},
	
	generateByMonthDayRow : function(value){
		var that = this;
		var row = document.createElement('div');
		row.setAttribute("class","row");
		
		row.appendChild(document.createTextNode("Day "));
		var day = document.createElement('select');
		day.setAttribute("class", "day");
		jQuery(day).click(function(){
			that.byMonthDayRowChanged();
		});
		
		for(var i = 1; i < 32; i++){
			var x = document.createElement('option');
			x.setAttribute("value", i);
			x.appendChild(document.createTextNode(i));
			day.appendChild(x);
		}

		row.appendChild(day);
		row.appendChild(document.createTextNode(" of every month."));
		
		var del = document.createElement('img');
		del.setAttribute("src","typo3conf/ext/cal/template/img/garbage.gif");
		del.setAttribute("class","addByMonthDayRecurrence");
		jQuery(del).click(function(){
			jQuery(this.parentNode).remove();
			that.byMonthDayRowChanged();
		});
		
		row.appendChild(del);
		
		return row;
	},
	
	/**
	 * This method is called at COMMAND each time the view is selected.
	 * Is used to update between views date ranges
	 */
	activatedViaCommand : function () {
	}
}

Calajax.EventView.displayEvent = function(eventRef){
	var dialogContent = jQuery("#"+eventRef.objecttype+"_display_container");
	dialogContent.dialog("destroy");

	if(eventRef.startObject.format('yyyymmdd') == eventRef.endObject.format('yyyymmdd')){
		//same day
		if(eventRef.allday==1){
			eventRef.date_holder = eventRef.startObject.format('ddd d. mmm');
		} else {
			eventRef.date_holder = eventRef.startObject.format('ddd d. mmm HH:MM tt - ')+eventRef.endObject.format('HH:MM tt');
		}
	} else {
		// longer than one day
		if(eventRef.allday==1){
			eventRef.date_holder = eventRef.startObject.format('ddd d. mmm -')+eventRef.endObject.format(' ddd d. mmm');
		} else {
			eventRef.date_holder = eventRef.startObject.format('ddd d. mmm HH:MM tt - ')+eventRef.endObject.format('ddd d. mmm HH:MM tt');
		}
	}

	dialogContent.find("div[class*='event-']").each(function(i,val){
		var valueName = val.className.substr(6,val.className.length);
		if(valueName == "location" && eventRef.locationid > 0){
			dialogContent.find("label[class='event-"+valueName+"-label']").show();
			jQuery(val).html('');
			Calajax.Location.loadLocation(eventRef.locationid, function(data) {
				jQuery(val).html(Calajax.Location.getLocationText(data)).show();
			});
		} else if(eventRef[valueName] != undefined && eventRef[valueName] != ""){
			jQuery(val).html(eventRef[valueName]).show();
			dialogContent.find("label[class='event-"+valueName+"-label']").show();
		} else {
			jQuery(val).hide();
			dialogContent.find("label[class='event-"+valueName+"-label']").hide();
		}
	});
	
	var CalendarViewObject = Calajax.MainObjectFactory.getObject( 'calendarview' );
	var translation = CalendarViewObject.translate( 'buttonText' );
	
	var buttons = {};
	if(eventRef.isallowedtoedit==1){
		buttons[translation.edit] = function(){
			dialogContent.dialog("close");
			Calajax.Registry.divcontainer.lastView = Calajax.Registry.divcontainer.currentView; 
			Calajax.Main.eventViewCommand.execute(eventRef);
		};
	}
	if(eventRef.isallowedtodelete==1){
		buttons[translation.deleteText] = function(){
			dialogContent.dialog("close");
			Calajax.Event.deleteEvent(eventRef, function(data){});
			Calajax.Main.removeAndAddEvents(eventRef.id,[]);

		};
	}

	dialogContent.dialog({
		modal: false,
		title: eventRef.title+"<span class='date'>"+eventRef.date_holder+"</span>",
		close: function() {
		   dialogContent.dialog("destroy");
		   dialogContent.hide();
		},
		buttons: buttons,
	});
	dialogContent.dialog('option', 'dialogClass', 'showEvent_'+eventRef.headerstyle);
	Calajax.Util.hideLoadingMask();
};

//+----------------------------------------------------------------------------
// | Extend View
// +----------------------------------------------------------------------------

/**
 * Extend
 */
jQuery.extend( true, Calajax.EventView.prototype, new Calajax.View() );

Calajax.EventView.prototype.show = function(eventRef){
	this.populateView(eventRef);
	jQuery( '#' + this.placeHolderId ).show();
	this.currentStatus = 2; // Set status to ACTIVE(2)
	Calajax.Util.hideLoadingMask();
};
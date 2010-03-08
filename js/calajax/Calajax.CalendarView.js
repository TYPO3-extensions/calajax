Calajax.CalendarView = function(){
	
	// Identifier for calendar placeholder default "calendar-list"
	this.placeHolderId = Calajax.Registry.divcontainer.calendarView;

	/**
	 * Current possible status for calendar view are:
	 * INACTIVE
	 * BUILDING
	 * ACTIVE
	 * HIDDING
	 */

	var status = new Array( 4 );
	status[0] = 'INACTIVE';
	status[1] = 'BUILDING';
	status[2] = 'ACTIVE';
	status[3] = 'HIDDING';
	status[4] = 'WAITING';

	this.currentStatus = 0; // Default status INACTIVE
};


Calajax.CalendarView.calendar = {
	isDataLoaded: false,
 	container: [],
 	loadData : function () {
		jQuery.get(
			Calajax.Registry.request.requestUrl,
				{
				'eID': 'cal_ajax',
				'tx_cal_controller[pid]': pid,
				'tx_cal_controller[view]': 'load_calendars'
			},
			function(data) {
				Calajax.CalendarView.calendar.setCalendar(data);
				Calajax.CalendarView.calendar.isDataLoaded = true;
				Calajax.CalendarView.calendar.fire( data );
			},
			Calajax.Registry.request.dataType
		);
	},
 	setCalendar: function(calendarArray) {
		Calajax.CalendarView.calendar.container = [];
 		for(var i=0; i < calendarArray.length; i++){
 			if(!calendarArray[i].headerstyle || calendarArray[i].headerstyle == ''){
 				calendarArray[i].headerstyle = 'default_catheader';
 			}
 			if(calendarArray[i].events == undefined){
	 			calendarArray[i].events = [];
	 		}
 			calendarArray[i].oldHeaderStyle = calendarArray[i].headerstyle;
 			Calajax.CalendarView.calendar.container[calendarArray[i].uid] = calendarArray[i];
 		}
 	},
 	addCalendar: function(calendar) {
 		if(calendar.events == undefined){
 			calendar.events = [];
 		}
 		if(Calajax.CalendarView.calendar.container[calendar.uid] == undefined) {
 			Calajax.CalendarView.calendar.container[calendar.uid] = calendar;
 		} else {
 			calendar.events = Calajax.CalendarView.calendar.container[calendar.uid].events;
 			Calajax.CalendarView.calendar.container[calendar.uid] = calendar;
 		}
 	},
 	removeCalendar: function(calendarId) {
 		delete Calajax.CalendarView.calendar.container[calendarId];
 	},
 	getCalendar: function(id) {
 		return Calajax.CalendarView.calendar.container[id];
 	},
	getCalendarsWithCreatePermission: function() {
 		var calendarArray = [];
 		for(var calendarId in Calajax.CalendarView.calendar.container){
 			if(Calajax.Rights.admin == 1){
 				return Calajax.CalendarView.calendar.container;
 			}
 			if( typeof( Calajax.CalendarView.calendar.container[calendarId].owner.fe_users ) !== "undefined"
					|| Calajax.CalendarView.calendar.container[calendarId].owner.fe_users ){
	 			for(var feUserId in Calajax.CalendarView.calendar.container[calendarId].owner.fe_users){
	 				if(this.container[calendarId].owner.fe_users[feUserId] == Calajax.Rights.userId){
	 					calendarArray[calendarId] = (Calajax.CalendarView.calendar.container[calendarId]);
	 				}
	 			}
	 		}
 			if( typeof( Calajax.CalendarView.calendar.container[calendarId].owner.fe_groups ) !== "undefined"
					|| Calajax.CalendarView.calendar.container[calendarId].owner.fe_groups ){
	 			for(var groupId in Calajax.CalendarView.calendar.container[calendarId].owner.fe_groups){
	 				if(Calajax.CalendarView.calendar.container[calendarId].owner.fe_groups[groupId]){
	 					calendarArray[calendarId] = (Calajax.CalendarView.calendar.container[calendarId]);
	 				}
	 			}
	 		}
 		}
 		return calendarArray;
 	},
 	
 	subscribeToCalendar: function(renderedEvent, savedEvent){
 		renderedEvent['originalEvent'] = savedEvent;
 		var calendar = Calajax.CalendarView.calendar.getCalendar(savedEvent.calendar_id);
 		if(calendar){
	 		if(calendar.displayValue == "hidden"){
	 			renderedEvent.hide();
	 		}
	 		calendar.events.push(renderedEvent);
 		} else {
 			Calajax.Util.errorHandler( 'could not find calendar with the id: ' + savedEvent.calendar_id );
 		}
 	},
 	emptyCalendarEvents: function() {
 		for(var calendarId in Calajax.CalendarView.calendar.container){
 			Calajax.CalendarView.calendar.container[calendarId].events = [];
 		}
 	},
 	action: function(ev, calendarId) {

		/*** DAY VIEW START ***/
		if ( Calajax.Registry.divcontainer.currentView == 'dayview') {
			switch( ev ) {
			case 'hide':
				Calajax.DayView.hideEvents( calendarId );
				break;
			case 'show':
				Calajax.DayView.showEvents( calendarId );
				break;
			}
		}
		/*** DAY VIEW END ***/

		/*** WEEK VIEW START ***/
		if ( Calajax.Registry.divcontainer.currentView == 'weekview') {
			switch( ev ) {
			case 'hide':
				Calajax.WeekView.hideEvents( calendarId );
				break;
			case 'show':
				Calajax.WeekView.showEvents( calendarId );
				break;
			}
		}
		/*** WEEK VIEW END ***/

		var calendar = Calajax.CalendarView.calendar.getCalendar(calendarId);
 		if(!calendar.events){
 			calendar.events = [];
 		}
 		if(ev=="hide"){
 			calendar.displayValue = "hidden";
	 		for(var i=0; i < calendar.events.length; i++){
	 			calendar.events[i].hide();
	 		}
	 		jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar_menu"+calendar.uid).removeClass("calendarName_"+calendar.oldHeaderStyle);
	 		jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar_menu"+calendar.uid).removeClass("calendarName_"+calendar.headerstyle);
	 	}
	 	if(ev=="show"){
	 		calendar.displayValue = "";
	 		for(var i=0; i < calendar.events.length; i++){
	 			calendar.events[i].show();
	 		}
	 		jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar_menu"+calendar.uid).addClass("calendarName_"+calendar.headerstyle);
	 	}
	 	if(ev=="color"){
	 		for(var i=0; i < calendar.events.length; i++){
	 			calendar.events[i].removeClass(calendar.events[i].originalEvent.headerstyle);
	 		}
	 		for(var i=0; i < calendar.events.length; i++){
	 			calendar.events[i].originalEvent.setNewHeaderStyle(calendar.headerstyle);
	 			calendar.events[i].addClass(calendar.events[i].originalEvent.headerstyle);
	 		}

	 		jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar"+calendar.uid).removeClass("calendarEditor_"+calendar.oldHeaderStyle);
	 		jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar_menu"+calendar.uid).removeClass("calendarName_"+calendar.oldHeaderStyle);
		  	jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar"+calendar.uid).addClass("calendarEditor_"+calendar.headerstyle);
		  	if(calendar.displayValue != "hidden"){
		  		jQuery('#' + Calajax.Registry.divcontainer.calendarView).find("#calendar_menu"+calendar.uid).addClass("calendarName_"+calendar.headerstyle);
		  	}
		  	calendar.oldHeaderStyle = calendar.headerstyle;
		  	
	 	}
 	},
 	updateCalendar: function(calendar, callback){
 		if(calendar.calendar_id > 0){
			calendar = Calajax.CalendarView.calendar.getCalendar(calendar.calendar_id);
		}
		
		var allowedParams = Calajax.Registry.options.calendar.allowedRequestParams;
		var params = {
			eID:"cal_ajax",
			"tx_cal_controller[view]":"save_calendar",
			"tx_cal_controller[pid]":Calajax.Registry.request.pid,
			"tx_cal_controller[type]":"tx_cal_calendar"
		};
		for(var i=0; i < allowedParams.length; i++){
			if(calendar[allowedParams[i]] != undefined){
				if(allowedParams[i] == "owner"){
					var owner_ids = [];
					for(var table in calendar.owner){
						for(var id in calendar.owner[table]){
							owner_ids.push(table.substr(3,1)+"_"+id); 
						}
					}
					params["tx_cal_controller[owner_ids]"] = owner_ids.join(',');
				} else {
					params["tx_cal_controller["+allowedParams[i]+"]"] = calendar[allowedParams[i]];
				}
			}
		}
		jQuery.get(
	    	Calajax.Registry.request.requestUrl,
			params,
			function(data){
	    		callback(data);
			},
			Calajax.Registry.request.dataType // Json by default ( see registry )
		);
	}
};

Calajax.CalendarView.editCalendarInitiated = false;
Calajax.CalendarView.editCalendarView = function (calendarRef, clickEvent){
	var calendar = calendarRef;
	
	var dialogContent = jQuery("#calendar_edit_container");
    Calajax.Util.resetForm(dialogContent);
    var titleField = dialogContent.find("input[name='tx_cal_controller\[title\]']");
    titleField.val(calendar.title);
    titleField.unbind("change").change(function() {
		validate();
	});
    
    var publicField = dialogContent.find("input[name='tx_cal_controller\[public\]']");

    publicField.attr('checked', (calendar.owner['fe_users'] || calendar.owner['fe_groups'])?false:true);
    publicField.unbind("change").change(function() {
		validate();
	});
    
    var colorField = dialogContent.find("input[name='tx_cal_controller\[headerstyle\]']");
    colorField.val(calendar.headerstyle);
    
    var colorPicker = dialogContent.find("div[id='calendar_color']").colorPicker({
			defaultColor: calendar.headerstyle,
			columns:7,
			click: function(color){
    			colorField.val(color);
    		}
		}
	);
    var ownerContainer = jQuery('#calendar_owner_container');
    var ownerField = false;
    
    jQuery.get(
		Calajax.Registry.request.requestUrl,
			{
			'eID': 'cal_ajax',
			'tx_cal_controller[pid]': pid,
			'tx_cal_controller[view]': 'search_user_and_group'
		},
		function(data) {
			var owner = '<select name="available" size="5" id="calendar_owner" multiple="true" style="width:200px;">';
			for(var i = 0; i < data['fe_users'].length; i++){
				if(calendar.owner.fe_users != undefined && calendar.owner.fe_users[data['fe_users'][i].uid] != undefined){
					owner += '<option value="u_'+data['fe_users'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/user.png)" selected="selected">'+data['fe_users'][i].name+'</option>';
				} else {
					owner += '<option value="u_'+data['fe_users'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/user.png)">'+data['fe_users'][i].name+'</option>';
				}
			}
			for(var i = 0; i < data['fe_groups'].length; i++){
				if(calendar.owner.fe_groups != undefined && calendar.owner.fe_groups[data['fe_groups'][i].uid] != undefined){
					owner += '<option value="g_'+data['fe_groups'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/group.png)" selected="selected">'+data['fe_groups'][i].title+'</option>';
				} else {
					owner += '<option value="g_'+data['fe_groups'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/group.png)">'+data['fe_groups'][i].title+'</option>';
				}
			}
			owner += '</select>';
			ownerContainer.html(owner);
			ownerField = jQuery('#calendar_owner');
		},
		Calajax.Registry.request.dataType
	);
	
	checkOwnership = function(){
    	var isOwner = false;
    	var children = ownerField.find("option:selected");
		for(var i = 0; i < children.length && !isOwner; i++){
			var optValueArray = children[i].value.split('_');
			if(optValueArray[0]=='u'){
				if(optValueArray[1] == Calajax.Rights.userId){
					isOwner = true;
				} 
			} else if(optValueArray[0]=='g'){
				for(var userGroupIndex in Calajax.Rights.userGroups){
					if(Calajax.Rights.userGroups[userGroupIndex] == optValueArray[1]){
						isOwner = true;
					}
				}
			}
		}
    	return isOwner;
    };
	
	validate = function(){
		var noFault = true;
		if(titleField.val()==""){
			titleField.addClass("error");
			titleField.focus();
			noFault = false;
		} else {
			titleField.removeClass("error");
		}
		
		if(publicField.attr('checked') == true && ownerField.find("option:selected").length > 0){
			ownerField.addClass("error");
			publicField.addClass("error");
			ownerField.focus();
			noFault = false;
		} else {
			ownerField.removeClass("error");
			publicField.removeClass("error");
			if(ownerField.find("option:selected").length == 0){
				publicField.attr('checked', true);
			}
		}
		return noFault;
	};
	
	var CalendarViewObject = Calajax.MainObjectFactory.getObject( 'calendarview' );
	var translation = CalendarViewObject.translate( 'buttonText' );

	var buttonDefinition = {};
	
	if(calendar.isallowedtoedit==1 || calendar.uid == undefined){
		
		buttonDefinition[translation.save] = function(){
			if(!validate()){
				return false;
			}
			if(publicField.attr('checked') != true && !checkOwnership()){
				if(!window.confirm("You are not included as an owner. Do you really want to save?")){
					return false;
				}
			}
			var calendarRef = calendar;
			calendarRef.headerstyle = colorField.val();
			calendarRef.title = titleField.val();
			calendarRef.owner = new Array();
			var ownerField = jQuery('#calendar_owner');
			var children = ownerField.find("option:selected");
			for(var i = 0; i < children.length; i++){
				var optValueArray = children[i].value.split('_');
				if(optValueArray[0]=='u'){
					if(calendarRef.owner.fe_users == undefined){
						calendarRef.owner.fe_users = {};
					} 
					calendarRef.owner.fe_users[optValueArray[1]] = optValueArray[1];
				} else if(optValueArray[0]=='g'){
					if(calendarRef.owner.fe_groups == undefined){
						calendarRef.owner.fe_groups = {};
					}
					calendarRef.owner.fe_groups[optValueArray[1]] = optValueArray[1];
				}
			}
			
			if(calendar.isallowedtoedit==1){
				Calajax.CalendarView.calendar.getCalendar(calendarRef.uid).headerstyle = colorField.val();
			  	Calajax.CalendarView.calendar.action("color",calendarRef.uid);
			}
			Calajax.CalendarView.calendar.updateCalendar(calendarRef, function(data){
		  		Calajax.CalendarView.calendar.addCalendar(data);
		  		Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.CalendarViewString ).renderCalendarList();
		  	});
		  	dialogContent.dialog("destroy");
           	dialogContent.hide();
		};
	}
	
	if(calendar.isallowedtodelete==1){
		buttonDefinition[translation.deleteText] = function(){
			jQuery.get(
				Calajax.Registry.request.requestUrl,
				{
					id:pid,
					eID:"cal_ajax",
					"tx_cal_controller[view]":"remove_calendar",
					"tx_cal_controller[pid]":pid,
					"tx_cal_controller[type]":"tx_cal_calendar",
					"tx_cal_controller[uid]":calendar.uid
				},
				function(data){
					//
				},
				Calajax.Registry.request.dataType
			);
			dialogContent.dialog("destroy");
           	dialogContent.hide();
           	Calajax.CalendarView.calendar.action("hide",calendar.uid);
			jQuery('#calendar-list-item'+calendar.uid).html('');
			Calajax.CalendarView.calendar.removeCalendar(calendar.uid);
			Calajax.CalendarView.task.removeCalendar(calendar.uid);
			Calajax.CalendarView.task.renderView();
		};
	};
	
	var dialogTitle = translation.edit + " - " + calendar.title;
	if(calendar.uid == undefined){
		dialogTitle = translation.create;
	}
	
	
	dialogContent.dialog({
        modal: false,
        //position: [(clickEvent.pageX + Calajax.Registry.format.calendarEditPanelOffsetX),clickEvent.pageY],
        title: dialogTitle,
        buttons: buttonDefinition,
        close: function() {
        	dialogContent.dialog("destroy");
           	dialogContent.hide();
        },
        cancel : function(){
            dialogContent.dialog("close");
        },
        width:'auto'
    });
};


Calajax.CalendarView.task = {
	isDataLoaded: false,
	container: [],
 	loadData : function () {
		jQuery.get(
			Calajax.Registry.request.requestUrl,
				{
				'eID': 'cal_ajax',
				'tx_cal_controller[pid]': pid,
				'tx_cal_controller[view]': 'load_todos'
			},
			function(data) {
				Calajax.CalendarView.task.setTasks(data);
				Calajax.CalendarView.task.isDataLoaded = true;
				Calajax.CalendarView.task.fire( data );
			},
			Calajax.Registry.request.dataType
		);
	},
 	setTasks: function(taskArray) {
		Calajax.CalendarView.task.container = [];
 		for(var i=0; i < taskArray.length; i++){
 			Calajax.CalendarView.task.container[taskArray[i].uid] = taskArray[i];
 		}
 	},
 	addTask: function(task) {
 		if(task.completed < 100){
 			Calajax.CalendarView.task.container[task.uid] = task;
 		} else {
 			Calajax.CalendarView.task.removeTask(task.uid);
 		}
 	},
 	removeTask: function(taskId) {
 		delete Calajax.CalendarView.task.container[taskId];
 	},
 	removeCalendar: function(calendarId){
 		for(var i in Calajax.CalendarView.task.container){
 			if(Calajax.CalendarView.task.container[i].calendar_id == calendarId){
 				delete Calajax.CalendarView.task.container[i];
 			}
 		}
 	},
 	getTask: function(id) {
 		return Calajax.CalendarView.task.container[id];
 	},
 	
 	renderView: function(){
 		var sortedTasks = [];
 		
 		var taskList = jQuery('#task-list');
 		taskList.html('');
 		
 		for(var taskId in Calajax.CalendarView.task.container){
 			if(sortedTasks[Calajax.CalendarView.task.container[taskId].start_date] == undefined){
 				sortedTasks[Calajax.CalendarView.task.container[taskId].start_date] = [];
 			}
 			sortedTasks[Calajax.CalendarView.task.container[taskId].start_date][taskId] = Calajax.CalendarView.task.container[taskId];
 		}
 		sortedTasks = Calajax.Util.sortAssoc(sortedTasks);
 		for(var date in sortedTasks){
 			var taskArrayOfDate = sortedTasks[date];
 			taskList.append('<li>'+Calajax.Util.getDateFromYYYYMMDD(date).format('mmm dd, yyyy')+'<li/>');
	 		for(var taskId in sortedTasks[date]){
	 			var task = sortedTasks[date][taskId];
	 			var optionsStr = '';
	 			if(task.isallowedtoedit == 1){
		 			optionsStr = '<select id="task_status_'+task.uid+'" onchange="Calajax.CalendarView.task.setNewStatus('+task.uid+',this.value)">';
		 			optionsStr += '<option value="NEEDS-ACTION" '+(task.status=="NEEDS-ACTION"?"selected='selected'":"")+' title="typo3conf/ext/calajax/res/images/cog_error.png">&nbsp;</option>';
		 			optionsStr += '<option value="IN-PROGRESS" '+(task.status=="IN-PROGRESS"?"selected='selected'":"")+' title="typo3conf/ext/calajax/res/images/cog.png">&nbsp;</option>';
		 			optionsStr += '<option value="COMPLETED" '+(task.status=="COMPLETED"?"selected='selected'":"")+' title="typo3conf/ext/calajax/res/images/tick.png">&nbsp;</option>';
		 			optionsStr += '<option value="CANCELLED" '+(task.status=="CANCELLED"?"selected='selected'":"")+' title="typo3conf/ext/calajax/res/images/cross.png">&nbsp;</option>';
		 			optionsStr += '</select>';
	 			} else {
	 				optionsStr = '<span class="event_status_'+((task.status!='' && task.status != undefined)?task.status.toLowerCase():0)+'" title="'+((task.status!=''&&task.status!=undefined)?task.status.toLowerCase():0)+'">&nbsp;</span>';
	 			}
	 			taskList.append('<li>'+optionsStr+'<span id="task-list-item'+task.uid+'" class="task-list-item-text" title="jumpt to it">'+task.title+'</span></li>');
	 			var statusSelect = taskList.find('#task_status_'+task.uid);
	 			statusSelect.msDropDown();
	 			taskList.find('#task-list-item'+task.uid).click(function(clickTask){
					var taskId = this.id.substr(14,this.id.length);
					var task = Calajax.CalendarView.task.container[taskId];
	 				var taskRef = new Calajax.Event(task);
	 		 		Calajax.Registry.getdate = taskRef.startObject;
	 		 		jQuery("#calendar-nav").datepicker( 'setDate' , Calajax.Registry.getdate);
	 				Calajax.Main.refresh();
	 			});
	 		}
 		}
 	},
 	
 	setNewStatus : function(taskId, status){
 		var task = Calajax.CalendarView.task.container[taskId];
 		task.status = status;
 		if(task.status == "COMPLETED"){
 			task.completed = 100;
 		}
 		Calajax.Event.startEventSave(new Calajax.Event(task));
 	}
};


Calajax.CalendarView.renderSelectorOptions = function(placeId, selectedId){
	jQuery('#' + placeId).html('');
	var calendarArray = Calajax.CalendarView.calendar.getCalendarsWithCreatePermission();
	for(var calendarId in calendarArray){
		var calendar = calendarArray[calendarId];
		jQuery('#' + placeId).append('<option value="'+calendar.uid+'" style="background-color:'+calendar.headerstyle+';" '+(calendar.uid==selectedId?'selected="selected"':'')+' >'+calendar.title+'</option>');
	}
};

Calajax.CalendarView.prototype	= {
	
	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	 getTranslationKey : function () {
		 return Calajax.Registry.translator.monthViewRequestKey;
	 },
		
	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	 translate : function ( tag ) {
		 return Calajax.Translator.getTranslation( this.getTranslationKey(), tag );
	 },
	 
	init: function(){
		 
		dateFormat.i18n = {
			dayNames: [],
			monthNames: []
		};
		var shortDays = this.translate( 'shortDays' );
		for(var i = 0; i < shortDays.length; i++){
			dateFormat.i18n.dayNames.push(shortDays[i]);
		}
		var longDays = this.translate( 'longDays' );
		for(var i = 0; i < longDays.length; i++){
			dateFormat.i18n.dayNames.push(longDays[i]);
		}
		var shortMonths = this.translate( 'shortMonths' );
		for(var i = 0; i < shortMonths.length; i++){
			dateFormat.i18n.monthNames.push(shortMonths[i]);
		}
		var longMonths = this.translate( 'longMonths' );
		for(var i = 0; i < longMonths.length; i++){
			dateFormat.i18n.monthNames.push(longMonths[i]);
		}
		jQuery("#calendar-nav").datepicker({
			dateFormat: 'yymmdd',
			firstDay: Calajax.Registry.options.weekstart,
			monthNames: longMonths,
			dayNamesMin: shortDays,
			dayNamesShort: shortDays,
			numberOfMonths: 2,
			showCurrentAtPos: 0,
			onSelect: function(dateText, inst){
				Calajax.Registry.getdate = new Date();
				var then = Calajax.Util.getDateFromYYYYMMDD(dateText);
				Calajax.Registry.getdate.setFullYear(then.getFullYear());
				Calajax.Registry.getdate.setMonth(then.getMonth());
				Calajax.Registry.getdate.setDate(then.getDate());
 				Calajax.Main.refresh();
 				Calajax.Util.refreshInfoText();
			}
		});
		
		this.renderCalendarList();
	},
	
	renderCalendarList : function() {
		var _self = this;
		calendarList = jQuery('#' + _self.placeHolderId);
		calendarList.renderMenu = function() {
			this.html('');
			
			var createHtml = '';
			jQuery('#calendar-list-bottom').remove();

			var CalendarViewObject = Calajax.MainObjectFactory.getObject( 'calendarview' );
			
			try{
				if(Calajax.Rights.create.calendar==true){
					var translation = CalendarViewObject.translate( 'buttonText' );
					createHtml = '<div id="calendar-list-bottom" class="list-container-bottom"><a class="new_calendar">'+translation.create+'</a></div>';
				}
			} catch(e){
				Calajax.Util.errorHandler(e);
			}
			
			for (var calendarId in Calajax.CalendarView.calendar.container) {
				var calendar = Calajax.CalendarView.calendar.container[calendarId];
				if(typeof calendar == 'object'){
					var editorHtml = '';
	
					if(calendar.isallowedtoedit==1){
						editorHtml = '<div id="calendar'+calendar.uid+'" class="calendarEditor_'+calendar.headerstyle+'"></div>';
					}
					
					this.append('<li id="calendar-list-item'+calendar.uid+'"><div id="calendar_menu'+calendar.uid+'" class="calendarName_'+calendar.headerstyle+'">'+calendar.title+'</div>'+editorHtml+'<div style="clear:left;"></div></li>');
					var selector = this.find("#calendar_menu"+calendar.uid);
					// var selector = jQuery('<input type="checkbox"
					// value="'+calendar.uid+'" checked="checked"/>');
		
					if(calendar.isallowedtoedit==1){
						var editorTrigger = this.find("#calendar"+calendar.uid);
						editorTrigger.unbind("click").click(function(clickEvent){
							var calendarId = this.id.substr(8,this.id.length);
							var calendar = Calajax.CalendarView.calendar.getCalendar(calendarId);
							Calajax.CalendarView.editCalendarView(calendar, clickEvent);
					    });
					}
					selector.unbind("click").click( 
						function(){
							var self = jQuery(this);
							if(self.context.className==""){
								Calajax.CalendarView.calendar.action("show",this.id.substr(13,this.id.length));
							} else {
								Calajax.CalendarView.calendar.action("hide",this.id.substr(13,this.id.length));
							}
						}				
					);
				}
			}
			if(createHtml!=''){
				
				var createCalendarButton = jQuery(createHtml);
				createCalendarButton.unbind("click").click(function(clickEvent){
					Calajax.CalendarView.editCalendarView({'title':'','headerstyle':'','owner':[]},clickEvent);
				});
				this.parent().append(createCalendarButton);
			}
			this.show();
		};
		calendarList.renderMenu();
	},
	
	getCalendar: function(uid){
		for(var i=0; i < Calajax.Registry.calendars.length; i++){
			if(Calajax.Registry.calendars[i].uid == uid){
				return Calajax.Registry.calendars[i];
			}
		}
	},
	
	activateViaCommand : function(){
		this.renderCalendarList();
	}
};

Calajax.CalendarView.adminTasks = [];

Calajax.CalendarView.registerAdminTask = function(id, name, callback){
	Calajax.CalendarView.adminTasks[id] = {'name':name,'callback':callback};
};

Calajax.CalendarView.renderAdminTasks = function(){
	var adminList = jQuery('#' + Calajax.Registry.divcontainer.administration);
	adminList.html('');
	try{ // This is giving me error: Philip
		for(var id in Calajax.CalendarView.adminTasks){
			if(Calajax.Rights.edit[id] == true){
				adminList.append('<li><ul><li id="admin_list_edit_'+id+'">'+Calajax.CalendarView.adminTasks[id]['name']+'</li></ul></li>');
				adminList.find('#admin_list_edit_'+id).unbind('click').click(Calajax.CalendarView.adminTasks[id]['callback']);
			}
		}
	} catch(e){
		Calajax.Util.errorHandler(e);
	}
};

//+----------------------------------------------------------------------------
//| Observer Class Extend
//+----------------------------------------------------------------------------


/**
* Extend CalendarView to become Observable
*/
jQuery.extend( true, Calajax.CalendarView.calendar, new Calajax.Observer() );
jQuery.extend( true, Calajax.CalendarView.task, new Calajax.Observer() );
jQuery.extend( true, Calajax.CalendarView.calendar, new Calajax.View() );

Calajax.CalendarView.calendar.subscribe(Calajax.CalendarView.task.loadData);
Calajax.CalendarView.task.subscribe(Calajax.CalendarView.task.renderView);
Calajax.Rights.subscribe(Calajax.CalendarView.renderAdminTasks);
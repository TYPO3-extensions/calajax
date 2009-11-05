Calajax.OrganizerView = function(){

	// Identifier for calendar placeholder.
	this.placeHolderId = Calajax.Registry.divcontainer.organizerView;
}

Calajax.OrganizerView.prototype = {
	organizers : [],
	
	dataLoaded : false,
	
	initialized : false,
	
	organizerContainer : false,
	organizerTable : false,
	
	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	getTranslationKey : function () {
		return Calajax.Registry.translator.monthViewRequestKey;
	},
	 
	refresh : function(){
	},
	
	build : function(object){
		var that = this;
		var lastSel;
		this.organizerContainer = jQuery('#'+Calajax.Registry.divcontainer.organizerView);
		this.organizerTable = this.organizerContainer.find("table[class='organizer-table']");
		this.organizerTable.jqGrid({ 
			//cellsubmit: Calajax.Registry.request.requestUrl,
			datatype: "local", 
			colNames:['Id','Type','Name','Street', 'ZIP', 'City'], 
			colModel:[
				{name:'uid',index:'uid', hidden:true, width:50,editable:false,editoptions:{size:20}},
				{name:'type',index:'type', hidden:true, width:50,editable:false,editoptions:{size:20}},
				{name:'name',index:'name', width:150,editable:true,editoptions:{size:20}}, 
				{name:'street',index:'street', width:150,editable:true,editoptions:{size:20}}, 
				{name:'zip',index:'zip', width:50, sorttype:"int",editable:true,editoptions:{size:20}}, 
				{name:'city',index:'city', width:100,editable:true,editoptions:{size:20}} 
			], 
			multiselect: false,
			viewrecords: true,
			//gridview: true,
			rowNum:10,
			rowList:[10,20,30],
			sortname: 'name',
			sortorder: "asc",
			caption: "Organizers",
			shrinkToFit: true,
			autowidth: true,
			forceFit: true,
			pager : '#pager4',
			afterSaveCell : function(){
				alert('c');
				//that.afterEditCell,
			},
			afterEditCell : function(){
				alert('a');
				//that.afterEditCell,
			},
			beforeCellSubmit: function(){
				alert('b');
				//that.beforeCellSubmit,
			},
			loadBeforeSend: that.loadBeforeSend,

		});
		
		setOrganizerData = function(data){
			that.organizerTable.clearGridData(true);
			for(var i=0; i < data.length; i++){
				that.organizerTable.addRowData(i+1,{"uid":data[i].uid,"type":data[i].type,"name":data[i].name,"street":data[i].street,"zip":data[i].zip,"city":data[i].city});
			}
		};
		
		this.loadOrganizers(setOrganizerData);
		this.organizerTable.navGrid('#pager4',
				{view:false, del:true, search:false, refresh:false}, 
				{
					url: Calajax.Registry.request.requestUrl,
					onclickSubmit : function(params, posdata){
						var row = that.organizerTable.getRowData (posdata.id);
						return {
								'eID':'cal_ajax',
								'tx_cal_controller[pid]':Calajax.Registry.request.pid,
								'tx_cal_controller[view]':'save_organizer',
								'tx_cal_controller[type]':row.type,
								'tx_cal_controller[uid]':row.uid,
								'tx_cal_controller[name]':posdata.name,
								'tx_cal_controller[street]':posdata.street,
								'tx_cal_controller[zip]':posdata.zip,
								'tx_cal_controller[city]':posdata.city,
							};
					},
					afterSubmit : function(response, postdata){
						var success = true;
						var organizer = false;
						eval('organizer = '+response.responseText);
						that.organizerTable.jqGrid("setRowData",postdata.id,{"uid":organizer.uid,"type":organizer.type,"name":organizer.name,"street":organizer.street,"zip":organizer.zip,"city":organizer.city});
						return [success];
					},
					closeAfterEdit: true,
				}, // use default settings for edit
				{
					url: Calajax.Registry.request.requestUrl,
					onclickSubmit : function(params, posdata){
						return {
								'eID':'cal_ajax',
								'tx_cal_controller[pid]':Calajax.Registry.request.pid,
								'tx_cal_controller[view]':'save_organizer',
								'tx_cal_controller[type]':'tx_cal_organizer',
								'tx_cal_controller[name]':posdata.name,
								'tx_cal_controller[street]':posdata.street,
								'tx_cal_controller[zip]':posdata.zip,
								'tx_cal_controller[city]':posdata.city,
							};
					},
					afterSubmit : function(response, postdata){
						var success = true;
						var message = '';
						var new_id = postdata.id;
						var organizer = false;
						eval('organizer = '+response.responseText);
						that.organizerTable.jqGrid("addRowData",organizer.uid,{"uid":organizer.uid,"type":organizer.type,"name":organizer.name,"street":organizer.street,"zip":organizer.zip,"city":organizer.city});
						return [success,message,new_id];
					},
					closeAfterAdd: true,
				}, // use default settings for add
				{
					url: Calajax.Registry.request.requestUrl,
					onclickSubmit : function(postdata){
						var row = that.organizerTable.getRowData (that.organizerTable.getGridParam('selrow'));
						return {
								'eID':'cal_ajax',
								'tx_cal_controller[pid]':Calajax.Registry.request.pid,
								'tx_cal_controller[view]':'remove_organizer',
								'tx_cal_controller[type]':row.type,
								'tx_cal_controller[uid]':row.uid,
							};
					},
					afterSubmit : function(response, postdata){
						var success = true;
						that.organizerTable.jqGrid("delRowData",postdata);
						return [true];
					},
					closeAfterAdd: true,
				},  // delete instead that del:false we need this
				{multipleSearch : true}, // enable the advanced searching
				{closeOnEscape:true} /* allow the view dialog to be closed when user press ESC key*/
		);
		
		
		this.organizerContainer.show();
		Calajax.Util.hideLoadingMask();
	},
	
	loadOrganizers : function(callback){
		jQuery.get(
			Calajax.Registry.request.requestUrl,
			{
				'eID': 'cal_ajax',
				'tx_cal_controller[pid]': Calajax.Registry.request.pid,
				'tx_cal_controller[view]': 'load_organizers',
				'tx_cal_controller[type]': 'tx_cal_organizer',
			},
			function(data) {
				callback(data);
			},
			Calajax.Registry.request.dataType // Json by default ( see registry )
		);
	},
	
	/**
	 * This method is called at COMMAND each time the view is selected.
	 * Is used to update between views date ranges
	 */
	activatedViaCommand : function () {
		//nothing
	},
}

Calajax.Organizer = function(){};

Calajax.Organizer.loadOrganizer = function(organizerId, callback){
	jQuery.get(
	Calajax.Registry.request.requestUrl,
		{
			'eID': 'cal_ajax',
			'tx_cal_controller[pid]': Calajax.Registry.request.pid,
			'tx_cal_controller[view]': 'organizer',
			'tx_cal_controller[type]': 'tx_cal_organizer',
			'tx_cal_controller[uid]': organizerId
		},
		function(data){
			callback(data);
		},
		Calajax.Registry.request.dataType // Json by default ( see registry )
	);
}

Calajax.Organizer.saveOrganizer = function(organizer, callback){
	var allowedParams = Calajax.Registry.options.organizer.allowedRequestParams;
	var params = {
		eID:"cal_ajax",
		"tx_cal_controller[view]":"save_organizer",
		"tx_cal_controller[pid]":Calajax.Registry.request.pid,
		"tx_cal_controller[type]":"tx_cal_organizer",
		"tx_cal_controller[formCheck]" : 1,
	};
	for(var i=0; i < allowedParams.length; i++){
		if(organizer[allowedParams[i]] != undefined){
			params["tx_cal_controller["+allowedParams[i]+"]"] = organizer[allowedParams[i]];
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

Calajax.Organizer.getOrganizerText = function(organizer, plainText) {
	if(plainText==true){
		return organizer.city+", "+organizer.zip+" "+organizer.street+" - "+organizer.name;
	} else {
		return organizer.city+",&nbsp;<span class='zip'>"+organizer.zip+"</span>&nbsp;<span class='street'>"+organizer.street+"</span>&nbsp;-&nbsp;<span class='street'>"+organizer.name+"</span>";
	}
}

Calajax.CalendarView.registerAdminTask('organizer','Organizer',function(){
	Calajax.Registry.divcontainer.lastView = Calajax.Registry.divcontainer.currentView;
	Calajax.Main.organizerViewCommand.execute();
});

//+----------------------------------------------------------------------------
//| Extend View
//+----------------------------------------------------------------------------

/**
* Extend
*/
jQuery.extend( true, Calajax.OrganizerView.prototype, new Calajax.View() );

Calajax.OrganizerView.prototype.show = function (){
	this.loadOrganizers(setOrganizerData);
	jQuery( '#' + this.placeHolderId ).show();
	this.currentStatus = 2; // Set status to ACTIVE(2)
	Calajax.Util.hideLoadingMask();
}
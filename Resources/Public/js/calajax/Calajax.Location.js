Calajax.LocationView = function(){

	// Identifier for calendar placeholder.
	this.placeHolderId = Calajax.Registry.divcontainer.locationView;
};

Calajax.LocationView.prototype = {
	locations : [],
	
	dataLoaded : false,
	
	initialized : false,
	
	locationContainer : false,
	locationTable : false,
	
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
		this.locationContainer = jQuery('#'+Calajax.Registry.divcontainer.locationView);
		
		this.locationContainer.dialog({
			modal: true,
			width: 600,
			title: '',
			autoOpen: false,
			position: 'center',
			close: function() {
				that.locationContainer.dialog("destroy");
				//that.eventViewObject.hide();
				Calajax.Main.showLastView();
			}
			//buttons: buttons,
		});
		
		this.locationTable = this.locationContainer.find("table[class='location-table']");
		this.locationTable.jqGrid({ 
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
			caption: "Locations",
			shrinkToFit: true,
			autowidth: true,
			forceFit: true,
			pager : '#pager3',
			afterSaveCell : function(){
				//alert('c');
				//that.afterEditCell,
			},
			afterEditCell : function(){
				//alert('a');
				//that.afterEditCell,
			},
			beforeCellSubmit: function(){
				//alert('b');
				//that.beforeCellSubmit,
			},
			loadBeforeSend: that.loadBeforeSend

		});
		
		setLocationData = function(data){
			that.locationTable.clearGridData(true);
			for(var i=0; i < data.length; i++){
				that.locationTable.addRowData(i+1,{"uid":data[i].uid,"type":data[i].type,"name":data[i].name,"street":data[i].street,"zip":data[i].zip,"city":data[i].city});
			}
		};
		
		this.loadLocations(setLocationData);
		this.locationTable.navGrid('#pager3',
				{view:false, del:true, search:false, refresh:false}, 
				{
					url: Calajax.Registry.request.requestUrl,
					onclickSubmit : function(params, posdata){
						var row = that.locationTable.getRowData (posdata.id);
						return {
								'eID':'cal_ajax',
								'tx_cal_controller[pid]':Calajax.Registry.request.pid,
								'tx_cal_controller[view]':'save_location',
								'tx_cal_controller[type]':row.type,
								'tx_cal_controller[uid]':row.uid,
								'tx_cal_controller[name]':posdata.name,
								'tx_cal_controller[street]':posdata.street,
								'tx_cal_controller[zip]':posdata.zip,
								'tx_cal_controller[city]':posdata.city
							};
					},
					afterSubmit : function(response, postdata){
						var success = true;
						var location = false;
						eval('location = '+response.responseText);
						that.locationTable.jqGrid("setRowData",postdata.id,{"uid":location.uid,"type":location.type,"name":location.name,"street":location.street,"zip":location.zip,"city":location.city});
						return [success];
					},
					closeAfterEdit: true
				}, // use default settings for edit
				{
					url: Calajax.Registry.request.requestUrl,
					onclickSubmit : function(params, posdata){
						return {
								'eID':'cal_ajax',
								'tx_cal_controller[pid]':Calajax.Registry.request.pid,
								'tx_cal_controller[view]':'save_location',
								'tx_cal_controller[type]':'tx_cal_location',
								'tx_cal_controller[name]':posdata.name,
								'tx_cal_controller[street]':posdata.street,
								'tx_cal_controller[zip]':posdata.zip,
								'tx_cal_controller[city]':posdata.city
							};
					},
					afterSubmit : function(response, postdata){
						var success = true;
						var message = '';
						var new_id = postdata.id;
						var location = false;
						eval('location = '+response.responseText);
						that.locationTable.jqGrid("addRowData",location.uid,{"uid":location.uid,"type":location.type,"name":location.name,"street":location.street,"zip":location.zip,"city":location.city});
						return [success,message,new_id];
					},
					closeAfterAdd: true
				}, // use default settings for add
				{
					url: Calajax.Registry.request.requestUrl,
					onclickSubmit : function(postdata){
						var row = that.locationTable.getRowData (that.locationTable.getGridParam('selrow'));
						return {
								'eID':'cal_ajax',
								'tx_cal_controller[pid]':Calajax.Registry.request.pid,
								'tx_cal_controller[view]':'remove_location',
								'tx_cal_controller[type]':row.type,
								'tx_cal_controller[uid]':row.uid
							};
					},
					afterSubmit : function(response, postdata){
						var success = true;
						that.locationTable.jqGrid("delRowData",postdata);
						return [true];
					},
					closeAfterAdd: true
				},  // delete instead that del:false we need this
				{multipleSearch : true}, // enable the advanced searching
				{closeOnEscape:true} /* allow the view dialog to be closed when user press ESC key*/
		);
		
		
		this.locationContainer.show();
		Calajax.Util.hideLoadingMask();
	},
	
	loadLocations : function(callback){
		jQuery.get(
			Calajax.Registry.request.requestUrl,
			{
				'eID': 'cal_ajax',
				'tx_cal_controller[pid]': Calajax.Registry.request.pid,
				'tx_cal_controller[view]': 'load_locations',
				'tx_cal_controller[type]': 'tx_cal_location'
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
	}
};

Calajax.Location = function(){};

Calajax.Location.loadLocation = function(locationId, callback){
	jQuery.get(
	Calajax.Registry.request.requestUrl,
		{
			'eID': 'cal_ajax',
			'tx_cal_controller[pid]': Calajax.Registry.request.pid,
			'tx_cal_controller[view]': 'location',
			'tx_cal_controller[type]': 'tx_cal_location',
			'tx_cal_controller[uid]': locationId
		},
		function(data){
			callback(data);
		},
		Calajax.Registry.request.dataType // Json by default ( see registry )
	);
};

Calajax.Location.saveLocation = function(location, callback){
	var allowedParams = Calajax.Registry.options.location.allowedRequestParams;
	var params = {
		eID:"cal_ajax",
		"tx_cal_controller[view]":"save_location",
		"tx_cal_controller[pid]":Calajax.Registry.request.pid,
		"tx_cal_controller[type]":"tx_cal_location",
		"tx_cal_controller[formCheck]" : 1
	};
	for(var i=0; i < allowedParams.length; i++){
		if(location[allowedParams[i]] != undefined){
			params["tx_cal_controller["+allowedParams[i]+"]"] = location[allowedParams[i]];
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
};

Calajax.Location.getLocationText = function(location, plainText) {
	if(plainText==true){
		return location.city+", "+location.zip+" "+location.street+" - "+location.name;
	} else {
		return location.city+",&nbsp;<span class='zip'>"+location.zip+"</span>&nbsp;<span class='street'>"+location.street+"</span>&nbsp;-&nbsp;<span class='street'>"+location.name+"</span>";
	}
};

Calajax.CalendarView.registerAdminTask('location','Location',function(){
	Calajax.Registry.divcontainer.lastView = Calajax.Registry.divcontainer.currentView;
	Calajax.Main.locationViewCommand.execute();
});

//+----------------------------------------------------------------------------
//| Extend View
//+----------------------------------------------------------------------------

/**
* Extend
*/
jQuery.extend( true, Calajax.LocationView.prototype, new Calajax.View() );

Calajax.LocationView.prototype.show = function (){
	this.loadLocations(setLocationData);
	jQuery( '#' + this.placeHolderId ).show();
	this.currentStatus = 2; // Set status to ACTIVE(2)
	Calajax.Util.hideLoadingMask();
};
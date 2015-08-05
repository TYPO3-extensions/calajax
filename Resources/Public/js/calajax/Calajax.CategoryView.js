Calajax.CategoryView = function(){
	
	// Identifier for calendar placeholder default "category-list"
	this.placeHolderId = Calajax.Registry.divcontainer.categoryView;

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


Calajax.CategoryView.category = {
	isDataLoaded: false,
 	container: [],
 	loadData : function () {
		jQuery.get(
			Calajax.Registry.request.requestUrl,
				{
				'eID': 'cal_ajax',
				'tx_cal_controller[pid]': pid,
				'tx_cal_controller[view]': 'load_categories'
			},
			function(data) {
				Calajax.CategoryView.category.setCategory(data[0][0]);
				Calajax.CategoryView.category.isDataLoaded = true;
				Calajax.CategoryView.category.fire( data );
			},
			Calajax.Registry.request.dataType
		);
	},
 	setCategory: function(categoryArray) {
		Calajax.CategoryView.category.container = [];
		for (var i in categoryArray){
			if(parseInt(i,10) > 0){
				if(!categoryArray[i].headerstyle || categoryArray[i].headerstyle == ''){
	 				categoryArray[i].headerstyle = 'default_catheader';
	 			}
	 			if(categoryArray[i].events == undefined){
		 			categoryArray[i].events = [];
		 		}
	 			categoryArray[i].oldHeaderStyle = categoryArray[i].headerstyle;
	 			Calajax.CategoryView.category.container[categoryArray[i].uid] = categoryArray[i];
			}
		}
 		/*for(var i=0; i < categoryArray.length; i++){
 			if(!categoryArray[i].headerstyle || categoryArray[i].headerstyle == ''){
 				categoryArray[i].headerstyle = 'default_catheader';
 			}
 			if(categoryArray[i].events == undefined){
	 			categoryArray[i].events = [];
	 		}
 			categoryArray[i].oldHeaderStyle = categoryArray[i].headerstyle;
 			Calajax.CategoryView.category.container[categoryArray[i].uid] = categoryArray[i];
 		}*/
 	},
 	addCategory: function(category) {
 		if(category.events == undefined){
 			category.events = [];
 		}
 		if(Calajax.CategoryView.category.container[category.uid] == undefined) {
 			Calajax.CategoryView.category.container[category.uid] = category;
 		} else {
 			category.events = Calajax.CategoryView.category.container[category.uid].events;
 			Calajax.CategoryView.category.container[category.uid] = category;
 		}
 	},
 	removeCategory: function(categoryId) {
 		delete Calajax.CategoryView.category.container[categoryId];
 	},
 	getCategory: function(id) {
 		return Calajax.CategoryView.category.container[id];
 	},
	getCategorysWithCreatePermission: function() {
 		var categoryArray = [];
 		for(var categoryId in Calajax.CategoryView.category.container){
 			if(Calajax.Rights.admin == 1){
 				return Calajax.CategoryView.category.container;
 			}
 			if( typeof( Calajax.CategoryView.category.container[categoryId].owner.fe_users ) !== "undefined"
					|| Calajax.CategoryView.category.container[categoryId].owner.fe_users ){
	 			for(var feUserId in Calajax.CategoryView.category.container[categoryId].owner.fe_users){
	 				if(this.container[categoryId].owner.fe_users[feUserId] == Calajax.Rights.userId){
	 					categoryArray[categoryId] = (Calajax.CategoryView.category.container[categoryId]);
	 				}
	 			}
	 		}
 			if( typeof( Calajax.CategoryView.category.container[categoryId].owner.fe_groups ) !== "undefined"
					|| Calajax.CategoryView.category.container[categoryId].owner.fe_groups ){
	 			for(var groupId in Calajax.CategoryView.category.container[categoryId].owner.fe_groups){
	 				if(Calajax.CategoryView.category.container[categoryId].owner.fe_groups[groupId]){
	 					categoryArray[categoryId] = (Calajax.CategoryView.category.container[categoryId]);
	 				}
	 			}
	 		}
 		}
 		return categoryArray;
 	},
 	
 	subscribeToCategory: function(renderedEvent, savedEvent){
 		renderedEvent['originalEvent'] = savedEvent;
 		var category = Calajax.CategoryView.category.getCategory(savedEvent.category_id);
 		if(category){
	 		if(category.displayValue == "hidden"){
	 			renderedEvent.hide();
	 		}
	 		category.events.push(renderedEvent);
 		} else {
 			Calajax.Util.errorHandler( 'could not find category with the id: ' + savedEvent.category_id );
 		}
 	},
 	emptyCategoryEvents: function() {
 		for(var categoryId in Calajax.CategoryView.category.container){
 			Calajax.CategoryView.category.container[categoryId].events = [];
 		}
 	},
 	action: function(ev, categoryId) {

		/*** DAY VIEW START ***/
		if ( Calajax.Registry.divcontainer.currentView == 'dayview') {
			switch( ev ) {
			case 'hide':
				Calajax.DayView.hideEvents( categoryId );
				break;
			case 'show':
				Calajax.DayView.showEvents( categoryId );
				break;
			}
		}
		/*** DAY VIEW END ***/

		/*** WEEK VIEW START ***/
		if ( Calajax.Registry.divcontainer.currentView == 'weekview') {
			switch( ev ) {
			case 'hide':
				Calajax.WeekView.hideEvents( categoryId );
				break;
			case 'show':
				Calajax.WeekView.showEvents( categoryId );
				break;
			}
		}
		/*** WEEK VIEW END ***/

		var category = Calajax.CategoryView.category.getCategory(categoryId);
 		if(!category.events){
 			category.events = [];
 		}
 		if(ev=="hide"){
 			category.displayValue = "hidden";
	 		for(var i=0; i < category.events.length; i++){
	 			category.events[i].hide();
	 		}
	 		jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category_menu"+category.uid).removeClass("categoryName_"+category.oldHeaderStyle);
	 		jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category_menu"+category.uid).removeClass("categoryName_"+category.headerstyle);
	 	}
	 	if(ev=="show"){
	 		category.displayValue = "";
	 		for(var i=0; i < category.events.length; i++){
	 			category.events[i].show();
	 		}
	 		jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category_menu"+category.uid).addClass("categoryName_"+category.headerstyle);
	 	}
	 	if(ev=="color"){
	 		for(var i=0; i < category.events.length; i++){
	 			category.events[i].removeClass(category.events[i].originalEvent.headerstyle);
	 		}
	 		for(var i=0; i < category.events.length; i++){
	 			category.events[i].originalEvent.setNewHeaderStyle(category.headerstyle);
	 			category.events[i].addClass(category.events[i].originalEvent.headerstyle);
	 		}

	 		jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category"+category.uid).removeClass("categoryEditor_"+category.oldHeaderStyle);
	 		jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category_menu"+category.uid).removeClass("categoryName_"+category.oldHeaderStyle);
		  	jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category"+category.uid).addClass("categoryEditor_"+category.headerstyle);
		  	if(category.displayValue != "hidden"){
		  		jQuery('#' + Calajax.Registry.divcontainer.categoryView).find("#category_menu"+category.uid).addClass("categoryName_"+category.headerstyle);
		  	}
		  	category.oldHeaderStyle = category.headerstyle;
		  	
	 	}
 	},
 	updateCategory: function(category, callback){
 		if(category.category_id > 0){
			category = Calajax.CategoryView.category.getCategory(category.category_id);
		}
		
		var allowedParams = Calajax.Registry.options.category.allowedRequestParams;
		var params = {
			eID:"cal_ajax",
			"tx_cal_controller[view]":"save_category",
			"tx_cal_controller[pid]":Calajax.Registry.request.pid,
			"tx_cal_controller[type]":"tx_cal_category"
		};
		for(var i=0; i < allowedParams.length; i++){
			if(category[allowedParams[i]] != undefined){
				if(allowedParams[i] == "owner"){
					var owner_ids = [];
					for(var table in category.owner){
						for(var id in category.owner[table]){
							owner_ids.push(table.substr(3,1)+"_"+id); 
						}
					}
					params["tx_cal_controller[owner_ids]"] = owner_ids.join(',');
				} else {
					params["tx_cal_controller["+allowedParams[i]+"]"] = category[allowedParams[i]];
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

Calajax.CategoryView.editCategoryInitiated = false;
Calajax.CategoryView.editCategoryView = function (categoryRef, clickEvent){
	var category = categoryRef;
	
	var dialogContent = jQuery("#category_edit_container");
    Calajax.Util.resetForm(dialogContent);
    var titleField = dialogContent.find("input[name='tx_cal_controller\[title\]']");
    titleField.val(category.title);
    titleField.unbind("change").change(function() {
		validate();
	});
    
    var publicField = dialogContent.find("input[name='tx_cal_controller\[public\]']");

    publicField.attr('checked', (category.owner['fe_users'] || category.owner['fe_groups'])?false:true);
    publicField.unbind("change").change(function() {
		validate();
	});
    
    var colorField = dialogContent.find("input[name='tx_cal_controller\[headerstyle\]']");
    colorField.val(category.headerstyle);
    
    var colorPicker = dialogContent.find("div[id='category_color']").colorPicker({
			defaultColor: category.headerstyle,
			columns:7,
			click: function(color){
    			colorField.val(color);
    		}
		}
	);
    var ownerContainer = jQuery('#category_owner_container');
    var ownerField = false;
    
    jQuery.get(
		Calajax.Registry.request.requestUrl,
			{
			'eID': 'cal_ajax',
			'tx_cal_controller[pid]': pid,
			'tx_cal_controller[view]': 'search_user_and_group'
		},
		function(data) {
			var owner = '<select name="available" size="5" id="category_owner" multiple="true" style="width:200px;">';
			for(var i = 0; i < data['fe_users'].length; i++){
				if(category.owner.fe_users != undefined && category.owner.fe_users[data['fe_users'][i].uid] != undefined){
					owner += '<option value="u_'+data['fe_users'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/user.png)" selected="selected">'+data['fe_users'][i].name+'</option>';
				} else {
					owner += '<option value="u_'+data['fe_users'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/user.png)">'+data['fe_users'][i].name+'</option>';
				}
			}
			for(var i = 0; i < data['fe_groups'].length; i++){
				if(category.owner.fe_groups != undefined && category.owner.fe_groups[data['fe_groups'][i].uid] != undefined){
					owner += '<option value="g_'+data['fe_groups'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/group.png)" selected="selected">'+data['fe_groups'][i].title+'</option>';
				} else {
					owner += '<option value="g_'+data['fe_groups'][i].uid+'" style="background-image:url(typo3conf/ext/calajax/res/images/group.png)">'+data['fe_groups'][i].title+'</option>';
				}
			}
			owner += '</select>';
			ownerContainer.html(owner);
			ownerField = jQuery('#category_owner');
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
	
	var CategoryViewObject = Calajax.MainObjectFactory.getObject( 'categoryview' );
	var translation = CategoryViewObject.translate( 'buttonText' );

	var buttonDefinition = {};
	
	if(category.isallowedtoedit==1 || category.uid == undefined){
		
		buttonDefinition[translation.save] = function(){
			if(!validate()){
				return false;
			}
			if(publicField.attr('checked') != true && !checkOwnership()){
				if(!window.confirm("You are not included as an owner. Do you really want to save?")){
					return false;
				}
			}
			var categoryRef = category;
			categoryRef.headerstyle = colorField.val();
			categoryRef.title = titleField.val();
			categoryRef.owner = new Array();
			var ownerField = jQuery('#category_owner');
			var children = ownerField.find("option:selected");
			for(var i = 0; i < children.length; i++){
				var optValueArray = children[i].value.split('_');
				if(optValueArray[0]=='u'){
					if(categoryRef.owner.fe_users == undefined){
						categoryRef.owner.fe_users = {};
					} 
					categoryRef.owner.fe_users[optValueArray[1]] = optValueArray[1];
				} else if(optValueArray[0]=='g'){
					if(categoryRef.owner.fe_groups == undefined){
						categoryRef.owner.fe_groups = {};
					}
					categoryRef.owner.fe_groups[optValueArray[1]] = optValueArray[1];
				}
			}
			
			if(category.isallowedtoedit==1){
				Calajax.CategoryView.category.getCategory(categoryRef.uid).headerstyle = colorField.val();
			  	Calajax.CategoryView.category.action("color",categoryRef.uid);
			}
			Calajax.CategoryView.category.updateCategory(categoryRef, function(data){
		  		Calajax.CategoryView.category.addCategory(data);
		  		Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.CategoryViewString ).renderCategoryList();
		  	});
		  	dialogContent.dialog("destroy");
           	dialogContent.hide();
		};
	}
	
	if(category.isallowedtodelete==1){
		buttonDefinition[translation.deleteText] = function(){
			jQuery.get(
				Calajax.Registry.request.requestUrl,
				{
					id:pid,
					eID:"cal_ajax",
					"tx_cal_controller[view]":"remove_category",
					"tx_cal_controller[pid]":pid,
					"tx_cal_controller[type]":"tx_cal_category",
					"tx_cal_controller[uid]":category.uid
				},
				function(data){
					//
				},
				Calajax.Registry.request.dataType
			);
			dialogContent.dialog("destroy");
           	dialogContent.hide();
           	Calajax.CategoryView.category.action("hide",category.uid);
			jQuery('#category-list-item'+category.uid).html('');
			Calajax.CategoryView.category.removeCategory(category.uid);
		};
	};
	
	var dialogTitle = translation.edit + " - " + category.title;
	if(category.uid == undefined){
		dialogTitle = translation.create;
	}
	
	
	dialogContent.dialog({
        modal: false,
        //position: [(clickEvent.pageX + Calajax.Registry.format.categoryEditPanelOffsetX),clickEvent.pageY],
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


Calajax.CategoryView.renderSelectorOptions = function(placeId, selectedId){
	jQuery('#' + placeId).html('');
	var categoryArray = Calajax.CategoryView.category.getCategorysWithCreatePermission();
	for(var categoryId in categoryArray){
		var category = categoryArray[categoryId];
		jQuery('#' + placeId).append('<option value="'+category.uid+'" style="background-color:'+category.headerstyle+';" '+(category.uid==selectedId?'selected="selected"':'')+' >'+category.title+'</option>');
	}
};

Calajax.CategoryView.prototype	= {
	
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
		jQuery("#category-nav").datepicker({
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
		
		this.renderCategoryList();
		jQuery('#left-accordion').accordion({autoHeight:false});
	},
	
	renderCategoryList : function() {
		var _self = this;
		categoryList = jQuery('#' + _self.placeHolderId);
		categoryList.renderMenu = function() {
			this.html('');
			
			var createHtml = '';
			jQuery('#category-list-bottom').remove();

			var CategoryViewObject = Calajax.MainObjectFactory.getObject( 'categoryview' );
			
			try{
				if(Calajax.Rights.create.category==true){
					var translation = CategoryViewObject.translate( 'buttonText' );
					createHtml = '<div id="category-list-bottom" class="list-container-bottom"><a class="new_category">'+translation.create+'</a></div>';
				}
			} catch(e){
				Calajax.Util.errorHandler(e);
			}
			
			for (var categoryId in Calajax.CategoryView.category.container) {
				var category = Calajax.CategoryView.category.container[categoryId];
				if(typeof category == 'object'){
					var editorHtml = '';
	
					if(category.isallowedtoedit==1){
						editorHtml = '<div id="category'+category.uid+'" class="categoryEditor_'+category.headerstyle+'"></div>';
					}
					
					this.append('<li id="category-list-item'+category.uid+'"><div id="category_menu'+category.uid+'" class="categoryName_'+category.headerstyle+'">'+category.title+'</div>'+editorHtml+'<div style="clear:left;"></div></li>');
					var selector = this.find("#category_menu"+category.uid);
					// var selector = jQuery('<input type="checkbox"
					// value="'+category.uid+'" checked="checked"/>');
		
					if(category.isallowedtoedit==1){
						var editorTrigger = this.find("#category"+category.uid);
						editorTrigger.unbind("click").click(function(clickEvent){
							var categoryId = this.id.substr(8,this.id.length);
							var category = Calajax.CategoryView.category.getCategory(categoryId);
							Calajax.CategoryView.editCategoryView(category, clickEvent);
					    });
					}
					selector.unbind("click").click( 
						function(){
							var self = jQuery(this);
							if(self.context.className==""){
								Calajax.CategoryView.category.action("show",this.id.substr(13,this.id.length));
							} else {
								Calajax.CategoryView.category.action("hide",this.id.substr(13,this.id.length));
							}
						}				
					);
				}
			}
			if(createHtml!=''){
				
				var createCategoryButton = jQuery(createHtml);
				createCategoryButton.unbind("click").click(function(clickEvent){
					Calajax.CategoryView.editCategoryView({'title':'','headerstyle':'','owner':[]},clickEvent);
				});
				this.parent().append(createCategoryButton);
			}
			this.show();
		};
		categoryList.renderMenu();
	},
	
	getCategory: function(uid){
		for(var i=0; i < Calajax.Registry.categorys.length; i++){
			if(Calajax.Registry.categorys[i].uid == uid){
				return Calajax.Registry.categorys[i];
			}
		}
	},
	
	activateViaCommand : function(){
		this.renderCategoryList();
	}
};


//+----------------------------------------------------------------------------
//| Observer Class Extend
//+----------------------------------------------------------------------------


/**
* Extend CategoryView to become Observable
*/
jQuery.extend( true, Calajax.CategoryView.category, new Calajax.Observer() );
jQuery.extend( true, Calajax.CategoryView.category, new Calajax.View() );
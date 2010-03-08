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
 * Registry Singleton
 */
Calajax.Registry = {

	/**
	 * Current view data
	 */
	currentView: {
		Instance : false,		// Current instance
		Object : false,			// Class methods or parameters
		placeHolder : false		// View placeholder ID
	},

	/**
	 * Page TYPOSCRIPT configuration
	 */
	TSConf : false,
	TSConfLoad: function (){

		Calajax.Util.ajax({
			data : {
				eID : Calajax.Registry.request.eID_SELF,
				action: 'getTSCconf'
			},
			success : function( data ) {
				Calajax.Registry.TSConf = data;
				// Set Translator Key "calajax" pointing to the transaltor object
				Calajax.Translator.mainTranslationObject['calajax'] = data['translations'];
				Calajax.Registry.fire();
			}

		});

	},

	/**
	 * Application containers
	 */
	divcontainer : {

		//menuBar:		'calajax-container-menubar',
		loading :		'calajax-container-loading-main',
		dayView:		'calajax-container-dayview',
		weekView :		'calajax-container-weekview',
		monthView :		'month-large',
		calendarView :	'calendar-list',
		categoryView :	'category-list',
		currentView : 	'monthview',
		lastView :		'',
		administration:	'admin-list',
		locationView :	'calajax-container-location',
		organizerView :	'calajax-container-organizer',
		eventView :		'edit_event_view'

	},

	/**
	 * Configuration for jQuery
	 */
	jQuery : {
		fadeOutSpeed : 'fast',
		fadeInSpeed : 'normal'
	},

	/**
	 * Translator Attributes
	 */
	translator : {
		requestActionVar: "tx_cal_controller[translations]",
		dayViewRequestKey: "day",
		weekViewRequestKey: "day",
		monthViewRequestKey: "month"
	},


	/**
	 * Request  Attributes
	 */
	 request : {
		requestUrl	: url,			// Currently set at fe_editing.tmpl
		pid			: pid,			// Currently set at fe_editing.tmpl
		id			: pid,			// Currently set at fe_editing.tmpl
		eID			: "cal_ajax",	// Cal ajax engine
		eID_SELF	: "calajax",	// Extension self ajax engine
		noCache		: 1,			// no_cache parameter
		dataType	: "json"
	 },

	/**
	 * Date & time formats - and maybe others
	 */
	 format : {
	 	 date 						: 'dd/mm/yyyy',
		 datepickerDate				: 'dd/mm/yy',
		 time 						: 'HH:MM tt',
		 timepickerTime 			: 'HH:MM',
		 timesteps					: 15,
		 monthEventTime				: 'HH:mm',
		 weekEventTime				: 'H:i',
		 weekHeaderFormat			: 'j. M',
		 weekUseShortDayNames		: true,
		 dayHeaderFormat			: 'j. F',
		 dayUseShortDayNames		: false,
		 calendarEditPanelOffsetX 	: -300
	 },

	 options : {
	 	 debug : 0,
		 activateHeaderLinksOnWeekView : 1, // Activate links to access day view on weekview
		 activateHeaderLinksOnMonthView : 1, // Activate links to access day view on monthview
		 weekstart : 1,
		 overlapEventsSeparate : false,
		 calendar : {
		 	 allowedRequestParams : ["uid","title","headerstyle","owner"]
	 	 },
		 event : {
			 allowedRequestParams : ["uid","event_type","title","allday","calendar_id","category_ids","location","location_id","cal_location","description","frequency_id","interval","count","by_day","by_monthday","until","status","priority","completed"]
		 },
		 location : {
			 allowedRequestParams : ["uid","name","street","zip","city"]
		 },
		 myHtmlSettings : {
		    nameSpace:       "description", // Useful to prevent multi-instances CSS conflict
		    onShiftEnter:    {keepDefault:false, replaceWith:'<br />\n'},
		    onCtrlEnter:     {keepDefault:false, openWith:'\n<p>', closeWith:'</p>\n'},
		    onTab:           {keepDefault:false, openWith:'     '},
		    markupSet:  [
		        {name:'Bold', key:'B', openWith:'(!(<strong>|!|<b>)!)', closeWith:'(!(</strong>|!|</b>)!)' },
				{name:'Italic', key:'I', openWith:'(!(<em>|!|<i>)!)', closeWith:'(!(</em>|!|</i>)!)'  },
				{name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
				{separator:'---------------' },
				{name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
				{name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
				{separator:'---------------' },
				{name:'Clean', className:'clean', replaceWith:function(markitup) { return markitup.selection.replace(/<(.*?)>/g, ""); } },		
				{name:'Preview', className:'preview',  call:'preview'}
		    ]
		}
	 },
	 
	 /**
	 * Data that transverses all views
	 */
	 getdate : new Date(),

	 /**
	  * Events Transversal
	  */ 
	 events: {

			currentEvents : [],
			AllDayEvents : []

	 },
	 
	 locationTable : {
		sortColumn: 'zip',					// Integer or String of the name of the column to sort by.  
		sortClassAsc: 'headerSortUp', 		// class name for ascending sorting action to header
		sortClassDesc: 'headerSortDown',	// class name for descending sorting action to header
		headerClass: 'header', 				// class name for headers (th's)
		disableHeader: 'ID'					// DISABLE Sorting on ID
	 }

};

// +----------------------------------------------------------------------------
// | Observer Class Extend
// +----------------------------------------------------------------------------

/**
 * Extend to become Observable
 */
jQuery.extend( true, Calajax.Registry, new Calajax.Observer() );
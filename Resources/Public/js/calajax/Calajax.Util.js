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
 * Util Singleton
 * This is also a wrapper for jQuery native function
 * this is done in order to allow future developments with other API's.
 */
Calajax.Util = {

	/*
	 * Loading Mask Controll
	 */
	showLoadingMask : function () {
		jQuery( '#' + Calajax.Registry.divcontainer.loading ).show();
	},

	hideLoadingMask : function () {
		jQuery( '#' + Calajax.Registry.divcontainer.loading ).hide();
	},

	/*
	 * Event Control
	 */
	addEvent : function ( element, event, callback ) {
		jQuery( element ).bind( event, callback );
	},

	/*
	 * Error handler sketch
	 */
	errorHandler : function( e ) {
		// Development fase logging to console
		if ( typeof( console ) !== 'undefined' && console != null ) {
			console.log( 'Error logged ( Calajax.Util.errorHandler ) : ' + e );
		}
	},

	/*
	 *  Wrapper to jQuery.ajax( options )
	 *  This is done so we have a central point where requests can be pre processed
	 */
	ajax : function( requestObject ){

		// More option at:
		// http://docs.jquery.com/Ajax/jQuery.ajax#options

		// URL
		if (typeof requestObject.url == 'undefined' )
			requestObject.url = Calajax.Registry.request.requestUrl;

		// DATATYPE
		if (typeof requestObject.dataType == 'undefined' )
			requestObject.dataType = Calajax.Registry.request.dataType;

		// DATA
		if (typeof requestObject.data == 'undefined' ) {
			Calajax.Util.errorHandler('We need a requestObject.data parameter!');
			return;
		}

		if (typeof requestObject.data['eID'] == 'undefined' )
			requestObject.data['eID'] = Calajax.Registry.request.eID;

		if (typeof requestObject.data['id'] == 'undefined' )
			requestObject.data['id'] = Calajax.Registry.request.pid;

		requestObject.data['tx_cal_controller[pid]'] = pid;

		if(Calajax.Registry.options.debug == 1){
			jQuery('#calajax-debug-container').show();
			var dataValues = '';
			for(var d in requestObject.data){
				dataValues += '&'+d+'='+requestObject.data[d];
			}
			jQuery('#calajax-debug').append('url:' + requestObject.url + ' - dataType:' + requestObject.dataType + ' - data:' + dataValues + '<br/>');
		}

		// ERROR
		if (typeof requestObject.error == 'undefined' ) {
			requestObject.error = function (XMLHttpRequest, textStatus, errorThrown) {
			
				if(Calajax.Registry.options.debug == 1){
					jQuery('#calajax-debug').append('Request Failed! Code' + textStatus + 'Error: ' + errorThrown + '<br/>');
				}

				// TODO: stop application, resend request until done if not exit and terminate application
				Calajax.Util.errorHandler( 'Request Failed! Code' + textStatus );
				Calajax.Util.errorHandler( 'Error: ' + errorThrown );
				Calajax.Util.errorHandler( 'data: ' + this.data );
				Calajax.Util.errorHandler( 'url: ' + this.url );
				// typically only one of textStatus or errorThrown
				// will have info
				// this; // the options for this ajax request
			};
		}

		jQuery.ajax( requestObject );

	},
	 
	getDateFromYYYYMMDD : function(value){
		if(value != undefined && value.length == 8){
			var newDate = new Date();
			var year = parseInt(value.substr(0,4),10);
			var month = parseInt(value.substr(4,2),10);
			var day = parseInt(value.substr(6,2),10);
			newDate.setFullYear(year);
			newDate.setMonth(month-1);
			newDate.setDate(day);
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
			return newDate;
		} else {
			return new Date(0,0,0,0,0,1);
		}
	},
	
	sortAssoc: function(aInput) {
		var aTemp = [];
		for (var sKey in aInput)
		aTemp.push([sKey, aInput[sKey]]);
		aTemp.sort(function () {return arguments[0][0] < arguments[1][0];});
	
		var aOutput = [];
		for (var nIndex = aTemp.length-1; nIndex >=0; nIndex--)
		aOutput[aTemp[nIndex][0]] = aTemp[nIndex][1];
	
		return aOutput;
	},
	
	resetForm : function(dialogContent) {
		dialogContent.find("input").val("");
		dialogContent.find("textarea").val("");
		dialogContent.find("class='error'").removeClass('error');
	},
	
	refreshInfoText : function() {
		jQuery(document).ready(function(){
	  		var timeInfo = '';
			switch(Calajax.Registry.divcontainer.currentView){
				case Calajax.MainObjectFactory.MonthViewString:
					timeInfo = Calajax.Registry.getdate.format('mmmm yyyy');
					break;
				case Calajax.MainObjectFactory.WeekViewString:
					if(Calajax.WeekView.viewStart){
						timeInfo = Calajax.WeekView.viewStart.format('mmm d - ')+new Date(Calajax.WeekView.viewStart.getTime()+(6* 86400000)).format('mmm d, yyyy');
					}
					break;
				case Calajax.MainObjectFactory.DayViewString:
					timeInfo = Calajax.Registry.getdate.format('ddd, mmm d, yyyy');
					break;
			}
			jQuery('#timeInfo').html(timeInfo);
		});
  },

  setCurrentViewRegistryData : function() {

		Calajax.Registry.currentView.Instance = Calajax.MainObjectFactory.getObject( Calajax.Registry.divcontainer.currentView );

		switch ( Calajax.Registry.divcontainer.currentView ) {
		case 'dayview':
			Calajax.Registry.currentView.Object = Calajax.DayView;
			Calajax.Registry.currentView.placeHolder = Calajax.Registry.divcontainer.dayView;
			break;
		case 'weekview':
			Calajax.Registry.currentView.Object = Calajax.WeekView;
			Calajax.Registry.currentView.placeHolder = Calajax.Registry.divcontainer.weekView;
			break;
		default:
			Calajax.Registry.currentView.Object = Calajax.MonthView;
			Calajax.Registry.currentView.placeHolder = Calajax.Registry.divcontainer.monthView;
			break;
		}
	},

	/**
	 * Add day links to Weekview and monthview
	 */
	addDayViewLinks: function() {

		var currentView = Calajax.Registry.divcontainer.currentView;
		var MonthViewObject = Calajax.MainObjectFactory.getObject( 'monthview' );
		var ViewInstance = Calajax.Registry.currentView.Instance;
		var ViewObject = Calajax.Registry.currentView.Object;
		var firstDay = new Date( ViewObject.viewStart );

		switch( currentView ) {
		case 'monthview':
			var dayClass = 'fc-day-number';
			break;
		case 'weekview':
			var dayClass = 'wc-day-column-header';
			break;
		case 'dayview':
			return;
		}

		jQuery( "#" + ViewInstance.placeHolderId + " ." + dayClass ).each( function( i, val ) {

			var currentDate = new Date( firstDay.getFullYear(), firstDay.getMonth(), (firstDay.getDate() + i) );
			if(jQuery(val).html().search(/<a href=.+/)==-1){
				jQuery(val).html('<a href="#1" title="' + jQuery(val).html() + '">' + jQuery(val).html() + '</a>');
				jQuery(val).children().click( function( e ) {
	
					Calajax.Registry.getdate = currentDate;
	
					//jQuery( "#" + Calajax.Registry.divcontainer.menuBar + " #menuItemDay" ).click();
					MonthViewObject.fullcalendarObject.fullCalendar('gotoDate', Calajax.Registry.getdate.getFullYear(),Calajax.Registry.getdate.getMonth(),Calajax.Registry.getdate.getDate());
					MonthViewObject.fullcalendarObject.fullCalendar('changeView', 'agendaDay');
					
					//jQuery( this.wCalBodyID ).weekCalendar( 'gotoDate', Calajax.Registry.getdate);
					
					e.stopPropagation();
	
				});
			}
		});

	}

};

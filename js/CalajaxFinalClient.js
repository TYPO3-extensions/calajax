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


/*
 * The final client code for processing calajax.
 * Here is where the engine starts.
 */



Calajax.StartingView = function(){

}

Calajax.StartingView.prototype = {
	/*
	 * Translator Simplified
	 * Acts as a bridge for the real translator object
	 */
	getTranslationKey : function () {
		return Calajax.Registry.translator.monthViewRequestKey; // Default view
	},
	 
	weekViewCommand : false,
	monthViewCommand : false,
	eventViewCommand : false,
	locationViewCommand : false,
	organizerViewCommand : false,

	builted : false,
	build : function(){
		
		if  ( this.builted ) return;

		/***********************************************************************
		 * NAVIGATION BAR
		 * Implementation code.
		 **********************************************************************/

		/* Create the menu bar. */
		var calajaxMenuBar = new Calajax.MenuBar( Calajax.Registry.divcontainer.menuBar );

//		/* Create the commands and inject menu bar object for show/hide functionality. */
//		this.dayViewCommand		= new Calajax.MenuCommand( 'dayview', calajaxMenuBar );
//		
//		this.dayViewCommand.render = function(command) {
//			jQuery(document).ready(function(){
//				var that = command;
//				Calajax.Util.addEvent( jQuery('#menuItemDay'), 'click', function( e ) { // Invoke the command on click.
//					that.command.execute( command );
//				});
//				that.element = jQuery('#menuItemDay');
//			});
//		};
//		
//		this.weekViewCommand	= new Calajax.MenuCommand( 'weekview', calajaxMenuBar );
//		
//		this.weekViewCommand.render = function(command) {
//			jQuery(document).ready(function(){
//				var that = command;
//				Calajax.Util.addEvent( jQuery('#menuItemWeek'), 'click', function( e ) { // Invoke the command on click.
//					that.command.execute( command );
//				});
//				that.element = jQuery('#menuItemWeek');
//			});
//		};
		
		this.monthViewCommand	= new Calajax.MenuCommand( 'monthview', calajaxMenuBar );
		
		this.monthViewCommand.render = function(command) {
			jQuery(document).ready(function(){
				var that = command;
				Calajax.Util.addEvent( jQuery('#menuItemMonth'), 'click', function( e ) { // Invoke the command on click.
					that.command.execute( command );
				});
				that.element = jQuery('#menuItemMonth');
			});
		};
		
		this.eventViewCommand	= new Calajax.MenuCommand( 'eventview', calajaxMenuBar );
		this.locationViewCommand= new Calajax.MenuCommand( 'locationview', calajaxMenuBar );
		this.organizerViewCommand= new Calajax.MenuCommand( 'organizerview', calajaxMenuBar );
		
		/* Navigation commands */
//		var prevCommand			= new Calajax.MenuCommandNav( 'previous' );
//		
//		prevCommand.render = function(command) {
//			jQuery(document).ready(function(){
//				Calajax.Util.addEvent( jQuery('#menuItemPrevious'), 'click', function( e ) { // Invoke the command on click.
//					command.command.execute( command );
//				});
//			});
//		};
//		
//		var todayCommand		= new Calajax.MenuCommandNav( 'today' );
//		
//		todayCommand.render = function(command) {
//			jQuery(document).ready(function(){
//				Calajax.Util.addEvent( jQuery('#menuItemToday'), 'click', function( e ) { // Invoke the command on click.
//					command.command.execute( command );
//				});
//			});
//		};
//		
//		var nextCommand			= new Calajax.MenuCommandNav( 'next' );
//		
//		nextCommand.render = function(command) {
//			jQuery(document).ready(function(){
//				Calajax.Util.addEvent( jQuery('#menuItemNext'), 'click', function( e ) { // Invoke the command on click.
//					command.command.execute( command );
//				});
//			});
//		};
//
//		/* The result buttons. */
//		var dayViewButton = new Calajax.Menu( 'dayview', this.dayViewCommand );
//		var weekViewButton = new Calajax.Menu( 'weekview', this.weekViewCommand );
//		var monthViewButton = new Calajax.Menu( 'monthview', this.monthViewCommand );
//		
		/* Pseudo buttons */
		var eventViewButton = new Calajax.Menu( 'eventview', this.eventViewCommand );
		eventViewButton.dontShow = true;
		var locationViewButton = new Calajax.Menu( 'locationview', this.locationViewCommand );
		locationViewButton.dontShow = true;
		var organizerViewButton = new Calajax.Menu( 'organizerview', this.organizerViewCommand );
		organizerViewButton.dontShow = true;

//		var prevViewButton = new Calajax.Menu( 'previous', prevCommand );
//		var todayViewButton = new Calajax.Menu( 'today', todayCommand );
//		var nextViewButton = new Calajax.Menu( 'next', nextCommand );
		

		/* Add buttons to menubar */
//		calajaxMenuBar.add( dayViewButton );
//		calajaxMenuBar.add( weekViewButton );
//		calajaxMenuBar.add( monthViewButton );
		calajaxMenuBar.add( eventViewButton );
		calajaxMenuBar.add( locationViewButton );
		calajaxMenuBar.add( organizerViewButton );

		/* Navigation */
//		calajaxMenuBar.add( prevViewButton );
//		calajaxMenuBar.add( nextViewButton );
//		calajaxMenuBar.add( todayViewButton );
		

		// Activate default View by running execute
		//weekViewCommand.execute();
		this.monthViewCommand.execute();

		calajaxMenuBar.show();

		this.builted = true;

	},
	 
	refresh : function(){
		switch(Calajax.Registry.divcontainer.currentView){
			case Calajax.MainObjectFactory.MonthViewString:
				Calajax.MainObjectFactory.MonthView.activatedViaCommand();
				break;
			case Calajax.MainObjectFactory.WeekViewString:
				Calajax.MainObjectFactory.WeekView.activatedViaCommand();
				break;
			case Calajax.MainObjectFactory.DayViewString:
				Calajax.MainObjectFactory.DayView.activatedViaCommand();
				break;
		}
	},
	
	removeAndAddEvents : function (eventId, events) {
		switch(Calajax.Registry.divcontainer.currentView){
			case Calajax.MainObjectFactory.MonthViewString:
				Calajax.MainObjectFactory.MonthView.removeAndAddEvents(eventId, events);
				break;
			case Calajax.MainObjectFactory.WeekViewString:
				Calajax.MainObjectFactory.WeekView.removeAndAddEvents(eventId, events);
				break;
			case Calajax.MainObjectFactory.DayViewString:
				Calajax.MainObjectFactory.DayView.removeAndAddEvents(eventId, events);
				break;
		}
	},
	
	showLastView : function(){
		
		Calajax.Registry.divcontainer.currentView = Calajax.Registry.divcontainer.lastView;
		switch(Calajax.Registry.divcontainer.lastView){
			case Calajax.MainObjectFactory.MonthViewString:
				this.monthViewCommand.execute();
				break;
			case Calajax.MainObjectFactory.WeekViewString:
				this.weekViewCommand.execute();
				break;
			case Calajax.MainObjectFactory.DayViewString:
				this.dayViewCommand.execute();
				break;
		}
	}
}

// +----------------------------------------------------------------------------
// | Extend Starting View
// +----------------------------------------------------------------------------
jQuery.extend( true, Calajax.StartingView.prototype, new Calajax.View() );

// +----------------------------------------------------------------------------
// | Start Object
// +----------------------------------------------------------------------------

Calajax.Main = new Calajax.StartingView();
Calajax.Main.init();

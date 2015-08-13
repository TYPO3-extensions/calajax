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
 * Original source taken from:
 * http://jsdesignpatterns.com/
 * Refactored.
 */

/*
 * This file loads the following interfaces and classes:
 *
 * INTERFACES:
 *
 * Calajax.Command
 * Calajax.Composite
 * Calajax.MenuObject
 *
 * CLASS:
 *
 * Calajax.MenuBar
 * Calajax.Menu
 * Calajax.MenuCommand
 *
 *
 */


/* Command, Composite and MenuObject Calajax.Interfaces. */

Calajax.Command = new Calajax.Interface('Command', ['execute','show','hide']);
Calajax.Composite = new Calajax.Interface('Composite', ['add', 'remove', 'getChild', 'getElement']);
Calajax.MenuObject = new Calajax.Interface('MenuObject', ['show']);

/* MenuBar class, a composite. */

Calajax.MenuBar = function( container ) { // implements Composite, MenuObject
  this.container = document.getElementById( container );
  this.menus = {};
  this.element = document.createElement('ul');
  this.element.style.display = 'none';
  
  //jQuery('#superfish-menu').superfish();
  //jQuery('#ui-buttonbar-new').click(function() { jQuery('#ui-buttonbar-sub-new').toggle('blind',{},500)});
  //jQuery('#cal_login_link').click(function() { jQuery('#cal_login_form_table').toggle('blind',{},500)});
  jQuery('#left-accordion').accordion({autoHeight:false}).show();
  
  if(Calajax.Rights.create.event!=true) {
	  jQuery('#ui-buttonbar-new-event').hide();
  }
  
  if(Calajax.Rights.create.calendar!=true) {
	  jQuery('#ui-buttonbar-new-calendar').hide();
  }
  
  if(Calajax.Rights.create.event!=true && Calajax.Rights.create.calendar!=true) {
	  jQuery('#ui-widget-header-new').hide();
  }
  
  jQuery('#ui-buttonbar-refresh').click(function() {
	  Calajax.MainObjectFactory.getObject( 'monthview' ).fullcalendarObject.fullCalendar( 'refetchEvents' );
  });

  // Append bar to document
//  this.container.appendChild( this.element );
};

Calajax.MenuBar.prototype = {
	add: function( menuObject ) {
		Calajax.Interface.ensureImplements( Calajax.menuObject, Calajax.Composite, Calajax.MenuObject);
		this.menus[menuObject.name] = menuObject;
//		if(this.menus[menuObject.name].command.render){
//			//do nothing
//		} else {
//			this.element.appendChild(this.menus[menuObject.name].getElement());
//		}
	},
	remove: function(name) {
		delete this.menus[name];
	},
	getChild: function() {
		return this.menus;
	},
	getElement: function() {
		return this.element;
	},
	show: function() {
		this.element.style.display = 'block';
		for(name in this.menus) { // Pass the call down the composite.
			if(this.menus[name].dontShow == true){
				// nothing
			} else {
				this.menus[name].show();
			}
		}
	}
};

/* Menu class, a composite. */

Calajax.Menu = function( name, command ) { // implements Composite, MenuObject
	this.name = name;
	this.command = command;
	
	if(this.command.render){
		this.command.render(this);
	} else {
		this.element = document.createElement('li');
		this.element.style.display = 'none';

		this.button = document.createElement('BUTTON');
		this.button.setAttribute( 'title', this.name );
		
		var buttonImage = document.createElement('img');
		buttonImage.src = Calajax.Registry.TSConf['setup.']['icons.'][ name ];
		this.button.appendChild( buttonImage );
		this.element.appendChild( this.button );
		// Add name of menu
		jQuery( this.element ).append(
			'<div>' +
			Calajax.Translator.getTranslation( 'calajax', name )
			+ '</div>');
		var that = this;
		Calajax.Util.addEvent( this.button, 'click', function( e ) { // Invoke the command on click.
			that.command.execute( that );
		});
	}
};

Calajax.Menu.prototype = {
	add: function() {},
	remove: function() {},
	getChild: function() {},
	getElement: function() {
		return this.element;
	},
	show: function() {
		if(!this.command.render){
	  		this.element.style.display = 'block';
	  	}
	}
};


/*
* MenuCommand class, a command object.
* Used for navigation items
*/
Calajax.MenuCommandNav = function( navString ) {
	this.navString = navString;
};
Calajax.MenuCommandNav.prototype.type = 'nav';
Calajax.MenuCommandNav.prototype.execute = function() {

	if(Calajax.Registry.divcontainer.currentView != Calajax.MainObjectFactory.DayViewString &&
		Calajax.Registry.divcontainer.currentView != Calajax.MainObjectFactory.WeekViewString &&
		Calajax.Registry.divcontainer.currentView != Calajax.MainObjectFactory.MonthViewString) {
		Calajax.Main.showLastView();
	}
	
	switch( Calajax.Registry.divcontainer.currentView ) {
	case Calajax.MainObjectFactory.DayViewString:

		switch ( this.navString ) {
		case 'today':
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.DayViewString ).today();
			break;
		case 'next':
			/* Set registry transversal data */
			Calajax.Registry.getdate = new Date(Calajax.Registry.getdate.getTime() + 86400000);
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.DayViewString ).next();
			break;
		case 'previous':
			/* Set registry transversal data */
			Calajax.Registry.getdate = new Date(Calajax.Registry.getdate.getTime() - 86400000);
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.DayViewString ).previous();
			break;
		}
	break;

	case Calajax.MainObjectFactory.WeekViewString:

		switch ( this.navString ) {
		case 'today':
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.WeekViewString ).today();
			/* Set registry transversal data */
			Calajax.Registry.getdate = new Date();
			break;
		case 'next':
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.WeekViewString ).next();
			/* Set registry transversal data */
			Calajax.Registry.getdate = new Date(Calajax.Registry.getdate.getTime() + 7 * 86400000);
			break;
		case 'previous':
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.WeekViewString ).previous();
			/* Set registry transversal data */
			Calajax.Registry.getdate = new Date(Calajax.Registry.getdate.getTime() - 7 * 86400000);
			break;
		}

		break;
	case Calajax.MainObjectFactory.MonthViewString:

		switch ( this.navString ) {
		case 'today':
			/* Set registry transversal data */
			Calajax.Registry.getdate = new Date();
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.MonthViewString ).today();
			break;
		case 'next':
			/* Set registry transversal data */
			Calajax.Registry.getdate.setMonth(Calajax.Registry.getdate.getMonth() + 1 );
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.MonthViewString ).next();
			break;
		case 'previous':
			/* Set registry transversal data */
			Calajax.Registry.getdate.setMonth(Calajax.Registry.getdate.getMonth() - 1 );
			Calajax.MainObjectFactory.getObject( Calajax.MainObjectFactory.MonthViewString ).previous();
			break;
		}
		
		break;
	}
	jQuery("#calendar-nav").datepicker('setDate', new Date(Calajax.Registry.getdate.getTime()));
	// Calajax.Util.hideLoadingMask();
};


/*
* MenuCommand class, a command object.
* Used for complex view menu items
*/

Calajax.MenuCommand = function( objectString, menuBar ) { // implements Command
  //
  // This instance provides lazy loading initialization for objects

  this.objectString = objectString;		// Used to get the object from factory
  this.objectInstance = false;			// Used to keep the instance so we do not get a new object
  this.menuBar = menuBar;				// Current Menu bar
  this.state = 0;						// We are sleeping :| ( INACTIVE )

};

Calajax.MenuCommand.prototype.type = 'view';
Calajax.MenuCommand.prototype.execute = function(object) {

	// Second call to object check menu state
	switch ( this.state ) {
	// If active return
	case 1:
		return;
	// If inactive do stuff...
	case 0:

		// Set current view
		Calajax.Registry.divcontainer.currentView = this.objectString;

		/**
		 * Set Registry data for current view
		 */
		Calajax.Util.setCurrentViewRegistryData();

		for ( item in this.menuBar.menus) {
			// HIDE VIEW
			if ( this.menuBar.menus[item].command.objectInstance != false && this.menuBar.menus[item].command.type == 'view' ) {
				if(this.menuBar.menus[item].name != 'monthview'){
					this.menuBar.menus[item].command.objectInstance.hide();		// Hide
				}
				this.menuBar.menus[item].command.state = 0;					// Reset command state ( Inactive )
//				if(jQuery.isFunction(this.menuBar.menus[item].element.removeClass)){
//					this.menuBar.menus[item].element.removeClass('active');
//				}
			}
		}

		// Lazy loading...
		// Ask for a new object instance from factory at first call
		// and initialize it.
		if ( this.objectInstance == false ) {
			this.objectInstance = Calajax.MainObjectFactory.getObject( this.objectString );

			// INITIALIZE VIEW ( ONE TIME ONLY )
			this.objectInstance.init(object);
			this.state = 1; // We are wake up :) ( ACTIVE )
//			if(jQuery.isFunction(this.menuBar.menus[Calajax.Registry.divcontainer.currentView].element.addClass)){
//				this.menuBar.menus[Calajax.Registry.divcontainer.currentView].element.addClass('active');
//			}

			/* Alert view that the command has activate it */
			//this.objectInstance.activatedViaCommand();
			Calajax.Util.refreshInfoText();

			/**
			 * Set Registry data for current view
			 */
			Calajax.Util.setCurrentViewRegistryData();


			return;
		}




		// Show selected menu object and set it as active
		// SHOW VIEW
		this.objectInstance.show(object);
		this.state = 1;
		if(jQuery.isFunction(this.menuBar.menus[Calajax.Registry.divcontainer.currentView].element.addClass)){
			this.menuBar.menus[Calajax.Registry.divcontainer.currentView].element.addClass('active');
		}

		/* Alert view that the command has activate it */
		this.objectInstance.activatedViaCommand();
		return;
	}

};

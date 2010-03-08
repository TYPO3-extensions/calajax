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


/* Rights Singleton */

Calajax.Rights = {

	isLoaded : false,

	/**
	 * Fe-editing rights for creating elements. Edit & delete is stored in each element itself
	 */
	create : {
		calendar	: false,
		category	: false,
		event		: false,
		location	: false,
		organizer	: false
	},
	
	edit : {
		calendar	: false,
		category	: false,
		event		: false,
		location	: false,
		organizer	: false
	},
	
	del : {
		calendar	: false,
		category	: false,
		event		: false,
		location	: false,
		organizer	: false
	},
	
	admin : false,
	userId : -1,
	userGroups : [],
	
	/**
	 * Fetch the rights from the server
	 */
	load : function() {

		Calajax.Util.ajax({
			data : {
				"tx_cal_controller[view]":"load_rights"
			},
			success : function( data ) {
				Calajax.Rights.create = data.create;
				Calajax.Rights.edit = data.edit;
				Calajax.Rights.del = data.del;
				Calajax.Rights.admin = data.admin;
				Calajax.Rights.userId = data.userId;
				Calajax.Rights.userGroups = data.userGroups;
				Calajax.Rights.isLoaded = true;
				Calajax.Rights.fire( data );
			}

		});

	}
};

// +----------------------------------------------------------------------------
// | Observer Class Extend
// +----------------------------------------------------------------------------

/**
 * Extend it to become Observable
 */
jQuery.extend( true, Calajax.Rights, new Calajax.Observer() );
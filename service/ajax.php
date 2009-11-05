<?php

/***************************************************************
 *  Copyright notice
 *
 *  (c) 2009 Philip Almeida <http://www.freedomson.com>
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


/*
 * Ajax client server code processed via eID method of Typo3
 *
 */


// Exit, if script is called directly (must be included via eID in index_ts.php)
if (!defined ('PATH_typo3conf')) die ('Could not access this script directly!');

// +----------------------------------------------------------------------------
// | Require files
// +----------------------------------------------------------------------------

require_once(PATH_t3lib.'class.t3lib_page.php');
require_once(PATH_t3lib.'class.t3lib_befunc.php');
require_once(t3lib_extMgm::extPath('calajax').'pi1/class.tx_calajax_pi1.php');

// +----------------------------------------------------------------------------
// | Get POST or GET vars.
// +----------------------------------------------------------------------------

$pid = t3lib_div::_GP('id');
$action = t3lib_div::_GP('action');

// +----------------------------------------------------------------------------
// | Cal eID starting Methods
// +----------------------------------------------------------------------------

$feUserObj = tslib_eidtools :: initFeUser();	// Initialize FE user object
tslib_eidtools :: connectDB();					// Connect to database:

// +----------------------------------------------------------------------------
// | Process AJAX request according
// +----------------------------------------------------------------------------

switch ( $action ) {

// Get current page configuration

case 'getTSCconf':

	// +------------------------------------------------------------------------
	// | Initialize required objects
	// +------------------------------------------------------------------------

	$tx_calajax_pi1 = t3lib_div :: makeInstance('tx_calajax_pi1');
	$template		= t3lib_div::makeInstance('t3lib_tsparser_ext'); // Defined global here!
	$sys_page		= t3lib_div::makeInstance('t3lib_pageSelect');

	// +------------------------------------------------------------------------
	// | Process Typoscript Setup Tree
	// +------------------------------------------------------------------------
	//
	//we need to get the plugin setup to create correct source URLs
	$template->tt_track = 0;
	// Do not log time-performance information
	$template->init();
	$rootLine = $sys_page->getRootLine($pid);
	$template->runThroughTemplates($rootLine); // This generates the constants/config + hierarchy info for the template.
	$template->generateConfig();//
	$conf = $template->setup['plugin.']['tx_calajax_pi1.'];

	// +------------------------------------------------------------------------
	// | Parse icon path
	// +------------------------------------------------------------------------

	foreach ( $conf['icons.'] as $icons => $path ) {

		$conf['icons.'][$icons] = $tx_calajax_pi1->getPath( $path );

	}

	// +------------------------------------------------------------------------
	// | Load local translations
	// +------------------------------------------------------------------------

	$lang = $template->setup['config.']['language'] ? $template->setup['config.']['language'] : 'default';
	$tx_calajax_pi1->LLkey = $lang;
	$tx_calajax_pi1->pi_loadLL();

	foreach ( $tx_calajax_pi1->LOCAL_LANG[ 'default' ] as $tag => $translation ) {

		$tx_calajax_pi1->LOCAL_LANG[ $lang ][ $tag ] = htmlentities( $tx_calajax_pi1->LOCAL_LANG[ $lang ][ $tag ], ENT_QUOTES, ( $template->setup['config.']['metaCharset'] ? $template->setup['config.']['metaCharset'] : 'UTF-8' ) );

		// If no translation go for default
		if ( ! $tx_calajax_pi1->LOCAL_LANG[ $lang ][ $tag ] ) {
			$tx_calajax_pi1->LOCAL_LANG[ $lang ][ $tag ] = htmlentities( $tx_calajax_pi1->LOCAL_LANG[ 'default' ][ $tag ], ENT_QUOTES, ( $template->setup['config.']['metaCharset'] ? $template->setup['config.']['metaCharset'] : 'UTF-8' ) );

		}


	}

	$result['translations'] = $tx_calajax_pi1->LOCAL_LANG[ $lang ];
	$result['setup.'] = $conf;

	break;


}

// +----------------------------------------------------------------------------
// | Output result to browser
// +----------------------------------------------------------------------------

echo json_encode( $result );

?>

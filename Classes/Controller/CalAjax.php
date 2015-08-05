<?php

namespace TYPO3\CMS\Calajax\Controller;

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

/**
 * Plugin 'Calajax' for the 'cal' extension.
 *
 * @author	Philip Almeida <http://www.freedomson.com>
 * @package	TYPO3
 * @subpackage	tx_calajax
 */
class CalAjax extends \TYPO3\CMS\Frontend\Plugin\AbstractPlugin {
	
	var $prefixId = 'tx_calajax_pi1'; // Same as class name
	var $scriptRelPath = 'Classes/Controller/CalAjax.php'; // Path to this script relative to the extension dir.
	var $extKey = 'calajax'; // The extension key.
	var $pi_checkCHash = true;

	/**
     * Gets the path to a file, needed to translate the 'EXT:extkey' into the real path
     *
     * @param    string  $path: Path to the file
     * @return the real path
     */
    public function getPath($path) {
        if (substr( $path, 0, 4 ) == 'EXT:') {
            $keyEndPos = strpos( $path, '/', 6 );
            $key = substr( $path, 4, $keyEndPos - 4 );
            $keyPath = \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::siteRelpath( $key );
            $newPath = $keyPath . substr( $path, $keyEndPos + 1 );
            return $newPath;
        } else {
            return $path;
        }
    } # end getPath
	    
}

?>
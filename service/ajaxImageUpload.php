<?php
/***************************************************************
 * Copyright notice
 *
 * (c) 2005-2008 Mario Matzulla
 * (c) 2005-2008 Christian Technology Ministries International Inc.
 * All rights reserved
 *
 * This file is part of the Web-Empowered Church (WEC)
 * (http://WebEmpoweredChurch.org) ministry of Christian Technology Ministries 
 * International (http://CTMIinc.org). The WEC is developing TYPO3-based
 * (http://typo3.org) free software for churches around the world. Our desire
 * is to use the Internet to help offer new life through Jesus Christ. Please
 * see http://WebEmpoweredChurch.org/Jesus.
 *
 * You can redistribute this file and/or modify it under the terms of the 
 * GNU General Public License as published by the Free Software Foundation;
 * either version 2 of the License, or (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This file is distributed in the hope that it will be useful for ministry,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the file!
 ***************************************************************/
require_once (t3lib_extMgm::extPath('cal').'controller/class.tx_cal_functions.php');

require_once (PATH_tslib.'/class.tslib_content.php');
require_once (t3lib_extMgm::extPath('cal').'controller/class.tx_cal_tsfe.php');
require_once(PATH_t3lib.'class.t3lib_userauth.php');
require_once(PATH_tslib.'class.tslib_feuserauth.php');
require_once(PATH_t3lib.'class.t3lib_tsparser_ext.php');
require_once(PATH_t3lib.'class.t3lib_befunc.php');
require_once(PATH_t3lib.'class.t3lib_page.php');

// Exit, if script is called directly (must be included via eID in index_ts.php)
if (!defined ('PATH_typo3conf')) die ('Could not access this script directly!');

//debug('Start:'.tx_cal_functions::getmicrotime());
if($_COOKIE['fe_typo_user']){
error_log('cookie');
	session_id($_COOKIE['fe_typo_user']);
	session_start();
}
	// Initialize FE user object:
$feUserObj = tslib_eidtools::initFeUser();
// Connect to database:
tslib_eidtools::connectDB();
$controllerPiVarsGET = t3lib_div::_GET('tx_cal_controller');
$controllerPiVarsPOST = t3lib_div::_POST('tx_cal_controller');
$controllerPiVars = array();
if(is_array($controllerPiVarsPOST) && is_array($controllerPiVarsGET)){
	$controllerPiVars = array_merge($controllerPiVarsPOST, $controllerPiVarsGET);
}else if (is_array($controllerPiVarsPOST)){
	$controllerPiVars = $controllerPiVarsPOST;
}else if (is_array($controllerPiVarsGET)){
	$controllerPiVars = $controllerPiVarsGET;
}
//debug($_POST);
$pid = intval($controllerPiVars['pid']);

require_once (t3lib_extMgm::extPath('cal').'/controller/class.tx_cal_api.php');

if(is_array($_SESSION['cal_api_'.$pid.'_conf'])){
	$tx_cal_api = t3lib_div :: makeInstance('tx_cal_api');
	$cObj = t3lib_div :: makeInstance('tslib_cObj');
	$GLOBALS['TSFE'] = &$_SESSION['cal_api_'.$pid.'_tsfe'];
	$GLOBALS['TCA'] = &$_SESSION['cal_api_'.$pid.'_tca'];
	$tx_cal_api = &$tx_cal_api->tx_cal_api_with($cObj, $_SESSION['cal_api_'.$pid.'_conf']);
}else{
	$tx_cal_api = t3lib_div :: makeInstance('tx_cal_api');
	$tx_cal_api = &$tx_cal_api->tx_cal_api_without($pid, $feUserObj);
	$_SESSION['cal_api_'.$pid.'_conf'] = $tx_cal_api->conf;
	$_SESSION['cal_api_'.$pid.'_tsfe'] = $GLOBALS['TSFE'];
	$_SESSION['cal_api_'.$pid.'_tca'] = $GLOBALS['TCA'];
}
$prefixId = 'tx_cal_controller';
$type = 'image';

//if($tx_cal_api->rightsObj->isAllowedTo("edit","event","image")){
	if (($_FILES[$prefixId]['name'][$type])) {
		require_once (PATH_t3lib . 'class.t3lib_basicfilefunc.php');
		
		$uploadPath = $GLOBALS['TCA']['tx_cal_event']['columns'][$type]['config']['uploadfolder'];
		
		$files = Array();
		if($controllerPiVars[$type]){
			$files = $controllerPiVars[$type];
		}
					
		$fileFunc = t3lib_div::makeInstance('t3lib_basicFileFunctions');
		$all_files = Array();
		$all_files['webspace']['allow'] = '*';
		$all_files['webspace']['deny'] = '';
		$fileFunc->init('', $all_files);
		
		$allowedExt = array();
		$denyExt = array();
		if($type=='image'){
			$allowedExt = explode(',',$GLOBALS['TYPO3_CONF_VARS']['GFX']['imagefile_ext']);
		}else if($type=='attachment'){
			$allowedExt = explode(',',$GLOBALS['TYPO3_CONF_VARS']['BE']['fileExtensions']['webspace']['allow']);
			$denyExt = explode(',',$GLOBALS['TYPO3_CONF_VARS']['BE']['fileExtensions']['webspace']['deny']);
		}
		$removeFiles = $controllerPiVars['remove_'.$type]?$controllerPiVars['remove_'.$type]:Array();
		
		if($_FILES[$prefixId]['error'][$type]){
			continue;
		}else{
			$theFile = t3lib_div::upload_to_tempfile($_FILES[$prefixId]['tmp_name'][$type]);
			$fI = t3lib_div::split_fileref($_FILES[$prefixId]['name'][$type]);
			if(in_array($fI['fileext'],$denyExt)){
				continue;
			}else if($type=='image' && !empty($allowedExt) && !in_array($fI['fileext'],$allowedExt)){
				continue;
			}

			$theDestFile = $fileFunc->getUniqueName($fileFunc->cleanFileName($fI['file']), $uploadPath);

			t3lib_div::upload_copy_move($theFile,$theDestFile);
			$ajax_return_data = basename($theDestFile);
		}
	
		foreach($files as $file){
			if(in_array($file,$removeFiles)){
				unlink($uploadPath.'/'.$file);
			}
		}
	}

//} else {
	//$ajax_return_data = "da";
//}


header('Expires: '.gmdate( 'D, d M Y H:i:s' ).' GMT');
// gmdate is ok.
header('Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . 'GMT'); 
header('Cache-Control: no-cache, must-revalidate'); 
header('Pragma: no-cache');
header('Content-Length: '.strlen($ajax_return_data));
header($htmlheader_contenttype);

echo $ajax_return_data;
exit;
?>
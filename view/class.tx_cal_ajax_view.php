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

require_once (t3lib_extMgm :: extPath('cal').'view/class.tx_cal_base_view.php');

/**
 * TODO
 *
 * @author Mario Matzulla <mario(at)matzullas.de>
 */
class tx_cal_ajax_view extends tx_cal_base_view {
	
	function start(){
		
		$controllerObj = &tx_cal_registry::Registry('basic','controller');
		$hookObjectsArr = $controllerObj->getHookObjectsArray('ajaxClass');
		
		// Hook: preAjaxRendering
		foreach ($hookObjectsArr as $hookObj) {
			if (method_exists($hookObj, 'preAjaxRendering')) {
				$hookObj->preAjaxRendering($this);
			}
		}
		
		$conf = &tx_cal_registry::Registry('basic','conf');
		$cObj = &tx_cal_registry::Registry('basic','cobj');
		$drawnAjax = $cObj->fileResource($conf['view.']['event.']['ajaxTemplate']);
		if ($drawnAjax == '') {
			return '<h3>calajax: no template file found:</h3>'.$conf['view.']['event.']['ajaxTemplate'].'<br />Please check your template record and add calajax "include static (from extension)"';
		}
		$array = array();
		$drawnAjax = $this->finish($drawnAjax,$array);

		// Hook: postAjaxRendering
		foreach ($hookObjectsArr as $hookObj) {
			if (method_exists($hookObj, 'postAjaxRendering')) {
				$hookObj->postSearchLocationRendering($drawnAjax, $this);
			}
		}
		$pid = $GLOBALS['TSFE']->id;

		if(!is_array($_SESSION['cal_api_'.$pid.'_conf'])){
			$_SESSION['cal_api_'.$pid.'_conf'] = $conf;
			$_SESSION['cal_api_'.$pid.'_tsfe'] = $GLOBALS['TSFE'];
			$_SESSION['cal_api_'.$pid.'_tca'] = $GLOBALS['TCA'];
		}

		return $drawnAjax;
	}
}

if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/calajax/view/class.tx_cal_ajax_view.php']) {
	include_once ($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/calajax/view/class.tx_cal_ajax_view.php']);
}
?>
<?php
namespace TYPO3\CMS\Calajax\View;

/**
 * *************************************************************
 * Copyright notice
 *
 * (c) 2010-2015 Mario Matzulla (mario(at)matzullas.de)
 * All rights reserved
 *
 * This script is part of the TYPO3 project. The TYPO3 project is
 * free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 * *************************************************************
 */

/**
 * TODO
 *
 * @author Mario Matzulla <mario(at)matzullas.de>
 */
class AjaxView extends \TYPO3\CMS\Cal\View\BaseView {
	
	public function __construct(){
		parent::__construct();
	}
	
	public function start(){
		
		//$controllerObj = &tx_cal_registry::Registry('basic','controller');
		$hookObjectsArr = $this->controller->getHookObjectsArray('ajaxClass');
		
		// Hook: preAjaxRendering
		foreach ($hookObjectsArr as $hookObj) {
			if (method_exists($hookObj, 'preAjaxRendering')) {
				$hookObj->preAjaxRendering($this);
			}
		}
		
// 		$conf = &tx_cal_registry::Registry('basic','conf');
// 		$cObj = &tx_cal_registry::Registry('basic','cobj');
		$drawnAjax = $this->cObj->fileResource($this->conf['view.']['event.']['ajaxTemplate']);
		if ($drawnAjax == '') {
			return '<h3>calajax: no template file found:</h3>'.$this->conf['view.']['event.']['ajaxTemplate'].'<br />Please check your template record and add calajax "include static (from extension)"';
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

?>
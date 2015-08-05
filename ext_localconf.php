<?php
if (! defined ( 'TYPO3_MODE' ))
	die ( 'Access denied.' );

$TYPO3_CONF_VARS ['FE'] ['eID_include'] ['calajax'] = 'EXT:calajax/Classes/Service/Ajax.php';
$TYPO3_CONF_VARS ['FE'] ['eID_include'] ['cal_ajax_image'] = 'EXT:calajax/Classes/Service/AjaxImageUpload.php';

/* Default confirm location View */
t3lib_extMgm::addService ( $_EXTKEY, 'cal_view' /* sv type */,  'tx_cal_custom_model' /* sv key */,
	array (
		'title' => 'Default Ajax View',
		'description' => '',
		'subtype' => 'ajax',
		'available' => TRUE,
		'priority' => 50,
		'quality' => 50,
		'os' => '',
		'exec' => '',
		'className' => 'TYPO3\\CMS\\Calajax\\View\\AjaxView' 
) );

$GLOBALS ['TYPO3_CONF_VARS'] ['FE'] ['EXTCONF'] ['ext/cal/service/class.tx_cal_event_service.php'] ['addAdditionalField'] ['tx_calajax'] = 'TYPO3\\CMS\\Calajax\\Hooks\\AdditionalFields';
$GLOBALS ['TYPO3_CONF_VARS'] ['BE'] ['EXTCONF'] ['ext/cal/service/class.tx_cal_icalendar_service.php'] ['importIcsContent'] ['tx_calajax'] = 'TYPO3\\CMS\\Calajax\\Hooks\\ICalendarService';
?>
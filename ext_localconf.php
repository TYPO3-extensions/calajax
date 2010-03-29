<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$TYPO3_CONF_VARS['FE']['eID_include']['calajax'] = 'EXT:calajax/service/ajax.php';
$TYPO3_CONF_VARS['FE']['eID_include']['cal_ajax_image'] = 'EXT:calajax/service/ajaxImageUpload.php';

/* Default confirm location View */
t3lib_extMgm::addService($_EXTKEY,  'cal_view' /* sv type */,  'tx_cal_custom_model' /* sv key */,
	array(
		'title' => 'Default Ajax View', 'description' => '', 'subtype' => 'ajax',
		'available' => TRUE, 'priority' => 50, 'quality' => 50,
		'os' => '', 'exec' => '',
		'classFile' => t3lib_extMgm::extPath($_EXTKEY).'view/class.tx_cal_ajax_view.php',
		'className' => 'tx_cal_ajax_view',
	)
);

$GLOBALS ['TYPO3_CONF_VARS']['FE']['EXTCONF']['ext/cal/service/class.tx_cal_event_service.php']['addAdditionalField'][] = 'EXT:calajax/hooks/class.tx_cal_additionalFields.php:&tx_cal_additionalFields';
?>
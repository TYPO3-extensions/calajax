<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$TYPO3_CONF_VARS['FE']['eID_include']['calajax'] = 'EXT:calajax/service/ajax.php';

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
?>
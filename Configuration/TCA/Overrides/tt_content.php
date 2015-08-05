<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}
$_EXTKEY = $GLOBALS['_EXTKEY'] = 'calajax';

/***************
 * Default TypoScript
 */
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile ($_EXTKEY, 'Configuration/TypoScript/', 'AJAX-based template');
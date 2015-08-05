<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

// Add the static templates.
#t3lib_extMgm::addStaticFile($_EXTKEY,'static/','AJAX-based template');
#t3lib_extMgm::addStaticFile($_EXTKEY,'static2/','GWT-based template');
?>

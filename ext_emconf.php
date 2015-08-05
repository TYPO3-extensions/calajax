<?php

########################################################################
# Extension Manager/Repository config file for ext: "calajax"
#
# Auto generated 18-08-2008 19:37
#
# Manual updates:
# Only the data in the array - anything else is removed by next write.
# "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Calendar Base FE AJAX interface',
	'description' => 'Addon extension to give cal a google-like frontend',
	'category' => 'plugin',
	'shy' => 0,
	'version' => '0.1.0',
	'loadOrder' => '',
	'state' => 'alpha',
	'uploadfolder' => 0,
	'clearcacheonload' => 1,
	'author' => 'Mario Matzulla, Philip Almeida',
	'author_email' => 'mario@matzullas.de, philip.almeida@freedomson.com',
	'author_company' => '',
	'constraints' => array(
		'depends' => array(
			'typo3' => '6.1.0-7.9.99',
			'cal' => '1.9.0-'
		),
	),
);

?>
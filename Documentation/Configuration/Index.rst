.. _Configuration:

==============
Configuration
==============

.. include:: ../Includes.txt

The extension is mainly a collection of javascript files based on jQuery.

We include a jQuery (1.3.2) version and have it already configured for convenience. Please remove the according javascript includes from the TS, if you have already a jQuery version running.

Currently we include all javascript code by: 
page.includeJSFooterlibs.calajax_XXX; where xxx starts at 102 and goes to 380. Not all numbers are used, but if you have already a script included with the same number, it might get overwritten!

Many things can be configured in the Calajax.Registry.js. Have a look at the current options there.



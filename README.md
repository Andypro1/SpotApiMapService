Spot Api Map Service
====================

A small nodejs application that uses the Spot API for Spot Satellite GPS devices to provide custom client side mapping or other services.

### Usage

getpoints.js
------------

Add this script to cron with

	crontab -e

Then enter

	*/5	*	*	*	*	/usr/local/bin/node <<your-script-path>>/getpoints.js <<your-spot-feed-id>> <<your-spot-feed-password>>

to update the master list of points every five mintutes, for example.  Alternatively, just run it manually from a shell.


servepoints.js
--------------

Run this simple http service with node however you'd like.  I have mine running on port 4446 behind an nginx proxy.
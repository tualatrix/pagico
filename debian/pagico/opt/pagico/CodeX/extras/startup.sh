#!/bin/bash
if [ ! -r ~/Library/Preferences/Pagico/pagico.conf ]
then
	mkdir ~/Library/Preferences/Pagico
	cp /Applications/Pagico/Pagico.app/Contents/Resources/Pagico/extras/httpd.conf ~/Library/Preferences/Pagico/pagico.conf
	
	ln -f ~/Library/Preferences/Pagico/pagico.conf /Applications/Pagico/Pagico.app/Contents/Resources/pagico.conf
fi

/Applications/Pagico/Pagico.app/Contents/Resources/pagicod -d -c pagico.conf
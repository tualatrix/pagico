@echo off
echo Stopping Pagico Service...
taskkill /F /IM abyssws.exe
taskkill /F /IM php-cgi.exe

echo Restarting Pagico Service...
"C:\Program Files\Pagico\httpd\abyssws.exe" --slave "C:\Program Files\Pagico\httpd"

echo "Done"
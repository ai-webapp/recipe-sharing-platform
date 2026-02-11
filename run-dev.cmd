@echo off
cd /d "%~dp0"
echo Avvio server su http://localhost:3000 ...
node node_modules\next\dist\bin\next dev --webpack
pause

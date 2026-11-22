@echo off
echo ====================================================
echo        BUILDCRAFT LOCAL DEVELOPMENT SERVER
echo        Starting server at http://localhost:3000
echo ====================================================
start "" http://localhost:3000
node server.js
pause

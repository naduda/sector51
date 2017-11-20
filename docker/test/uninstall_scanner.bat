@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

call %~dp0Scanner\ScannerService.exe -u
docker-compose -f %~dp0Scanner\docker-compose.yml down -v
call rd /s q/ %~dp0Scanner
pause

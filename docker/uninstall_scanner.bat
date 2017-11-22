@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

call %~dp0Scanner\ScannerService.exe -u
docker-compose -f %~dp0Scanner\docker-compose.yml down -v
docker rmi scanner_web -f
docker rmi scanner_db -f
pause
docker rmi anapsix/alpine-java -f
docker rmi postgres -f
rd /s /q %~dp0Scanner
pause

@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

call %~dp0Scanner\ScannerService.exe -u
docker stop web_container && docker stop db_container
docker rm -f web_container db_container
docker volume rm -f scanner_db_volume
docker rmi -f scanner_web scanner_db
set /p remove=Remove images? [y/n]

IF %remove% EQU y (
  docker rmi -f anapsix/alpine-java:8_jdk postgres:9.6-alpine
)
rd /s /q %~dp0Scanner
pause

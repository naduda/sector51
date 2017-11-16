@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

echo You can press ENTER to set value by default
set dirName=sector51
set installDir=%~dp0%dirName%
set props=settings2.properties

rem rd /s /q %installDir%

IF NOT EXIST %installDir% (
  set branch=master && set /p branch=Enter branch:
  echo Selected branch is %branch%
  call :saveGitScanner %branch%
  echo %installDir%\.gitignore
  del /q /s %installDir%\.gitignore
)
IF NOT EXIST %props% (
  set line=localhost && set /p line=Enter db host:
  call :saveKeyValueToFile %props% POSTGRES_HOST %line%
  set line=5432 && set /p line=Enter db port:
  call :saveKeyValueToFile %props% POSTGRES_PORT %line%
  set line=sector51 && set /p line=Enter db name:
  call :saveKeyValueToFile %props% POSTGRES_DB %line%
  set line=12345678 && set /p line=Enter db password:
  call :saveKeyValueToFile %props% POSTGRES_PASSWORD %line%
)
copy /y %~dp0%props% %installDir%\docker\%props%

call %installDir%\docker\build.bat
pause
cd ../
exit /b 0

:read_settings
set SETTINGSFILE=%1
if not exist %SETTINGSFILE% (
  echo FAIL: File "%SETTINGSFILE%" not exist
  exit /b 1
)
for /f "eol=# delims== tokens=1,2" %%i in (%SETTINGSFILE%) do (
  set %%i=%%j
)
exit /b 0

:saveKeyValueToFile
set file=%1
set content=%2=%3
echo %content% && echo %content% >> %file%
exit /b 0

:saveGitScanner
set btanch=%1
set all=https://github.com/naduda/sector51/archive/%branch%.zip
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%all%','%~dp0/project.zip')"
powershell -Command "Expand-Archive -Path %~dp0/project.zip -DestinationPath %~dp0/"
rename sector51-%branch% sector51 && del /s /q project.zip
exit /b 0

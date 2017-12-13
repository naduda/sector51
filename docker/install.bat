@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

echo You can press ENTER to set value by default
set installDir=%~dp0sector51
set props=%~dp0settings.properties

IF NOT EXIST %props% (
  set branch=master&& set /p branch=Enter branch:
  call :saveKeyValueToFile %props% GIT_BRANCH "!branch!"
  set line=localhost&& set /p line=Enter db host:
  call :saveKeyValueToFile %props% POSTGRES_HOST "!line!"
  set line=5432&& set /p line=Enter db port:
  call :saveKeyValueToFile %props% POSTGRES_PORT "!line!"
  set line=8087&& set /p line=Enter webserver port:
  call :saveKeyValueToFile %props% WEB_SERVER_PORT "!line!"
  set line=sector51&& set /p line=Enter db name:
  call :saveKeyValueToFile %props% POSTGRES_DB "!line!"
  set line=12345678&& set /p line=Enter db password:
  call :saveKeyValueToFile %props% POSTGRES_PASSWORD "!line!"
  powershell -Command "(gc %props%) -replace '\u0022', '' | Out-File %props%"
  powershell -Command "(gc %props%) -replace '`r`n', '`n' | sc %props% -Force"
)
call :read_settings %props%

IF NOT EXIST %installDir% (
  echo Selected branch is %GIT_BRANCH%
  call :saveGitRepository %GIT_BRANCH%
  del /q /s %installDir%\.gitignore
)
IF NOT EXIST %~dp0Scanner (
  mkdir %~dp0Scanner
  set release=%installDir%\Scanner\ScannerService\bin\Release
  copy /y !release! %~dp0Scanner
)
copy /y %props% %~dp0Scanner

xcopy %installDir%\docker\pr %~dp0Scanner\pr /y /e /i
call %~dp0Scanner\ScannerService.exe -s port=%WEB_SERVER_PORT%

set file=uninstall_scanner.bat
copy /y %installDir%\docker\%file% %~dp0%file%
set list=docker-compose.yml,Dockerfile.db,Dockerfile.web
FOR %%F IN (%list%) DO (
  copy /y %installDir%\docker\%%F %~dp0Scanner\%%F
)
xcopy %installDir%\sector51server %~dp0Scanner\sector51server /y /e /i
powershell -Command "(gc %~dp0Scanner\docker-compose.yml) -replace '5432:5432', '%POSTGRES_PORT%:5432' | Out-File %~dp0Scanner\docker-compose.yml"
powershell -Command "(gc %~dp0Scanner\docker-compose.yml) -replace '8087:8089', '%WEB_SERVER_PORT%:8089' | Out-File %~dp0Scanner\docker-compose.yml"
docker-compose -f %~dp0Scanner\docker-compose.yml up --build -d

rd /s /q %installDir% && pause

:read_settings
set SETTINGSFILE=%1
IF NOT EXIST %SETTINGSFILE% (
  echo FAIL: File "%SETTINGSFILE%" not exist
  exit /b 1
)
for /f "eol=# delims== tokens=1,2" %%i in (%SETTINGSFILE%) do (
  set %%i=%%j
)
exit /b 0

:saveKeyValueToFile
echo %2=%3 && echo %2=%3>>%1
exit /b 0

:saveGitRepository
set all=https://github.com/naduda/sector51/archive/%1.zip
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%all%','%~dp0project.zip')"
powershell -Command "Expand-Archive -Path %~dp0project.zip -DestinationPath %~dp0/"
rename %~dp0sector51-%1 sector51 && del /s /q %~dp0project.zip
exit /b 0

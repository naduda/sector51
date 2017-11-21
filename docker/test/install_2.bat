@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

echo You can press ENTER to set value by default
set installDir=%~dp0sector51
set props=settings.properties
set branch=dev

IF NOT EXIST %installDir% (
  set /p branch=Enter branch:
  echo Selected branch is !branch!
  call :saveGitRepository "!branch!"
  del /q /s %installDir%\.gitignore
)
IF NOT EXIST %~dp0Scanner (
  mkdir %~dp0Scanner
  set release=%installDir%\Scanner\ScannerService\bin\Release
  copy /y !release! %~dp0Scanner
)
IF NOT EXIST %props% (
  call :saveKeyValueToFile %props% GIT_BRANCH %branch%
  set line=localhost&& set /p line=Enter db host:
  call :saveKeyValueToFile %props% POSTGRES_HOST "!line!"
  set line=5432&& set /p line=Enter db port:
  call :saveKeyValueToFile %props% POSTGRES_PORT "!line!"
  set line=sector51&& set /p line=Enter db name:
  call :saveKeyValueToFile %props% POSTGRES_DB "!line!"
  set line=12345678&& set /p line=Enter db password:
  call :saveKeyValueToFile %props% POSTGRES_PASSWORD "!line!"
)
call :read_settings %props%
copy /y %~dp0%props% %~dp0Scanner\%props%
powershell -Command "(gc %~dp0Scanner\settings.env) -replace '\u0022', '' | Out-File %~dp0Scanner\settings.env"
rem copy /y %~dp0Scanner\%props% %~dp0Scanner\settings.env
rem powershell -Command "(gc %~dp0Scanner\settings.env) -replace '`r`n', '`n' | sc %~dp0Scanner\settings.env -Force"
xcopy %installDir%\docker\pr %~dp0Scanner\pr /y /e /i
call %~dp0Scanner\ScannerService.exe -s ^
              host=%POSTGRES_HOST% port=%POSTGRES_PORT% ^
              db=%POSTGRES_DB% psw=%POSTGRES_PASSWORD%

set file=uninstall_scanner.bat
copy /y %installDir%\docker\%file% %~dp0%file%
set list=docker-compose.yml,Dockerfile.db,Dockerfile.web
FOR %%F IN (%list%) DO (
  copy /y %installDir%\docker\%%F %~dp0Scanner\%%F
)
xcopy %installDir%\sector51server %~dp0Scanner\sector51server /y /e /i
powershell -Command "(gc %~dp0Scanner\docker-compose.yml) -replace '5432:5432', '%POSTGRES_PORT%:5432' | Out-File %~dp0Scanner\docker-compose.yml"
docker-compose -f %~dp0Scanner\docker-compose.yml up --build -d

rd /s /q %installDir%
pause
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
echo %2=%3 && echo %2=%3>>%1
exit /b 0

:saveGitRepository
set all=https://github.com/naduda/sector51/archive/%1.zip
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%all%','%~dp0project.zip')"
powershell -Command "Expand-Archive -Path %~dp0project.zip -DestinationPath %~dp0/"
rename sector51-%branch% sector51 && del /s /q project.zip
exit /b 0

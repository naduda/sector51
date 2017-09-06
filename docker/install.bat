@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION

call :read_settings %~dp0settings.properties || exit /b 1

IF NOT EXIST %~dp0services (
  mkdir %~dp0services
  set url="https://github.com/kohsuke/winsw/releases/download/winsw-v2.1.2/WinSW.NET4.exe"
  powershell -Command "(New-Object System.Net.WebClient).DownloadFile('%url%','%~dp0services\winsw.exe')"
)
IF NOT EXIST %~dp0services\scanner (
  mkdir %~dp0services\scanner
  call build.bat
  for %%i in ("%~dp0..") do set "scannerFolder=%%~fi\Scanner\Scanner\bin\Debug"
  xcopy /s /y %scannerFolder% %~dp0services\scanner
  call createService.bat scanner
)

docker stop %container_name%

set param=%1
for %%A in (civ cvi icv ivc vic vci) do if /i "%param%"=="--clean-%%A" (
  echo qwe2
  call :delete-containers
  call :delete-images
  call :delete-volumes
  echo qwe
)

for %%A in (cv vc) do if /i "%param%"=="--clean-%%A" (
  call :delete-containers
  call :delete-volumes
)

if /i "%param%"=="--clean-c" (
  call :delete-containers
)

if /i "%param%"=="--clean-i" (
  call :delete-images
)

if /i "%param%"=="--clean-v" (
  call :delete-volumes
)

REM Create image if not exist
set /a isexist=0
for /f "tokens=1,3 skip=1 usebackq" %%i in (`docker image ls -a`) do (
  if %%i==%image_name% set isexist=1
)
if %isexist%==0 (
  (docker build -t %image_name% .) || (exit /b %errorlevel%)
)

REM Create volume if not exist
set /a isexist=0
for /f "tokens=2 skip=1 usebackq" %%i in (`docker volume ls`) do (
  if %%i==%volume_name% set isexist=1
)
if %isexist%==0 (
  (docker volume create --name %volume_name%) || (exit /b %errorlevel%)
  echo volume "%volume_name%" was created
)

REM Create container if not exist
set /a isexist=0
for /f "tokens=1,2 skip=1 usebackq" %%i in (`docker ps -a`) do (
  if /i %%j==%image_name% set isexist=1
)

if %isexist%==0 (
  (docker create --name %container_name% ^
    -p 5432:5432 ^
    -v %~dp0pr:/pr ^
    -v %volume_name%:/var/lib/postgresql/data ^
    %image_name% ^
    --POSTGRES_PASSWORD=%POSTGRES_PASSWORD% ^
    --DB_NAME=%DB_NAME%) || (exit /b %errorlevel%)
  echo container "%container_name%" was created
)

docker start %container_name%
rem docker exec -it %container_name% /bin/sh
rem docker logs %container_name%
rem docker ps
set url=https://github.com/kohsuke/winsw/releases/download/winsw-v2.1.2/WinSW.NET4.exe
IF NOT EXIST %~dp0service mkdir %~dp0service
powershell -Command (New-Object Net.WebClient).DownloadFile('%url%','%~dp0service\winsv.exe')

rem ****************************** Functions ******************************
:delete-volumes
for /f "tokens=2 skip=1 usebackq" %%i in (`docker volume ls`) do (
  docker volume rm -f %%i
)
exit /b 0

:delete-images
for /f "tokens=1,3 skip=1 usebackq" %%i in (`docker image ls -a`) do (
  if %%i NEQ anapsix/alpine-java (
    echo **************** %%i ==================^> %%j
    docker rmi -f %%j
  )
)
docker images ls
pause
exit /b 0

:delete-containers
for /f "tokens=1 skip=1 usebackq" %%i in (`docker ps -a`) do (
  docker rm -f %%i
)
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

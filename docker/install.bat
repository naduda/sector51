@echo off
cls
call :read_settings %~dp0settings.properties || exit /b 1
set param=%param:--=%

for %%A in (civ cvi icv ivc vic vci) do if %param%==clean-%%A (
  call :delete-containers
  call :delete-images
  call :delete-volumes
)

for %%A in (cv vc) do if %param%==clean-%%A (
  call :delete-containers
  call :delete-volumes
)

if %param%==clean-c (
  call :delete-containers
)

if %param%==clean-i (
  call :delete-images
)

if %param%==clean-v (
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
for /f "tokens=7 skip=1 usebackq" %%i in (`docker ps -a`) do (
  if %%i==%volume_name% set isexist=1
)
if %isexist%==0 (
  rem (docker run --name %container_name% -v %~dp0pr:/pr -v %volume_name%:/var/lib/postgresql/data -p 5432:5432 -d %image_name% postgres) || (exit /b %errorlevel%)
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
docker exec -it %container_name% /bin/sh
docker logs %container_name%
docker ps
pause
exit /b 0

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
docker stop %container_name%
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
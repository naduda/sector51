@echo off

for /f "tokens=* usebackq" %%i in (`ng lint`) do set VAR=%%i
echo %VAR%
echo =============================================================
for /f "tokens=* usebackq" %%i in (`ng test -w=false`) do set VAR=%%i
echo %VAR%
echo =============================================================
for /f "tokens=* usebackq" %%i in (`npm run e2e`) do set VAR=%%i
echo %VAR%

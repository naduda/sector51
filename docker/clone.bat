@echo off
rem clone.bat branch folder
cls

git init
git remote add origin https://github.com/naduda/sector51.git
git config core.sparsecheckout true
powershell -Command "echo %2 | out-file -encoding ascii .git/info/sparse-checkout"
git pull --depth=1 origin %1
git checkout --track origin/%1

pause
exit /b 0
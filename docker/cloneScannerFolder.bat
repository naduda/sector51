@echo off
cls
git init
git remote add origin https://github.com/naduda/sector51.git
git config core.sparsecheckout true
powershell -Command "echo Scanner | out-file -encoding ascii .git/info/sparse-checkout"
git pull --depth=1 origin dev
git checkout dev
pause
exit /b 0
@echo off

set Solution=%~dp0Scanner\Scanner.sln

set MsBuild=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe 

echo %Solution% 
echo %MsBuild% 
%MsBuild% %Solution% /p:Configuration=Debug
pause
@echo off
set name=%~dp0services\%1\
set file_name=%name%service.xml
copy /y %~dp0services\winsw.exe %name%service.exe

echo ^<service^> > %file_name%
echo ^<id^>Winsw_%1^</id^> >> %file_name%
echo ^<name^>Winsw %1^</name^> >> %file_name%
echo ^<description^>Winsw %1^</description^> >> %file_name%
echo ^<executable^>%name%%1.exe^</executable^> >> %file_name%
echo ^<logmode^>rotate^</logmode^> >> %file_name%
echo ^</service^> >> %file_name%

rem call %name%service.exe install
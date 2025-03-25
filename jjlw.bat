@echo off
setlocal enabledelayedexpansion

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrator privileges...
    powershell Start-Process -FilePath "%comspec%" -ArgumentList '/c %~s0' -Verb RunAs
    exit /b
)

:main
cls
echo Running processes:
echo -------------------

:: Get list of running processes
set count=0
for /f "tokens=1,* skip=3" %%a in ('tasklist') do (
    set /a count+=1
    set "proc[!count!]=%%a"
    echo [!count!] %%a
)

:: Get user selection
echo -------------------
set /p selection="Select a process number to block (1-!count!): "

:: Validate input
if %selection% lss 1 (
    echo Invalid selection
    timeout /t 2 >nul
    goto main
)
if %selection% gtr !count! (
    echo Invalid selection
    timeout /t 2 >nul
    goto main
)

:: Get process name
set "exename=!proc[%selection%]!"

:: Create temporary firewall rule
echo Creating firewall rule to block !exename!
netsh advfirewall firewall add rule name="TempBlock_!exename!" dir=out program="%SystemDrive%\%exename%" action=block
netsh advfirewall firewall add rule name="TempBlock_!exename!" dir=in program="%SystemDrive%\%exename%" action=block

:: Cleanup on exit
:cleanup
echo Press any key to unblock !exename! and exit...
pause >nul
echo Removing firewall rule
netsh advfirewall firewall delete rule name="TempBlock_!exename!"
exit /b

@echo off
echo ============================================
echo  AIRO BOTS — Firewall Fix (Run as Admin)
echo ============================================
echo.

REM Remove old rules
netsh advfirewall firewall delete rule name="AIRO BOTS Frontend (3000)" >nul 2>&1
netsh advfirewall firewall delete rule name="AIRO BOTS Backend (4000)" >nul 2>&1

REM Add rules explicitly for Private AND Public profiles
netsh advfirewall firewall add rule name="AIRO BOTS Frontend (3000)" ^
  dir=in action=allow protocol=TCP localport=3000 profile=private,public

netsh advfirewall firewall add rule name="AIRO BOTS Backend (4000)" ^
  dir=in action=allow protocol=TCP localport=4000 profile=private,public

REM Make sure the Public profile is NOT set to block-all-inbound
netsh advfirewall set publicprofile firewallpolicy blockinbound,allowoutbound

REM Switch the Wi-Fi to Private profile (requires admin)
powershell -Command "Set-NetConnectionProfile -Name 'SILCHAR-5G 3' -NetworkCategory Private"

echo.
echo Done! Check the result below:
netsh advfirewall firewall show rule name="AIRO BOTS Frontend (3000)"
echo.
powershell -Command "Get-NetConnectionProfile | Select-Object Name, NetworkCategory"
echo.
echo Now try your phone again at http://192.168.1.40:3000
pause

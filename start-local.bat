@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js が見つかりません。Node.js をインストールしてから再実行してください。
  exit /b 1
)

if "%PORT%"=="" set PORT=5177
start "" "http://127.0.0.1:%PORT%/"
npm start

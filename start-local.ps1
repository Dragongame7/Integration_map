$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js が見つかりません。Node.js をインストールしてから再実行してください。"
  exit 1
}

$port = if ($env:PORT) { $env:PORT } else { "5177" }
$url = "http://127.0.0.1:$port/"

Write-Host "Starting infra integration map..."
Write-Host $url
Start-Process $url
npm start

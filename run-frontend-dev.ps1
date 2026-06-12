$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Join-Path $PSScriptRoot 'frontend')
& 'C:\Program Files\nodejs\npm.cmd' run dev -- --host 127.0.0.1 --port 3000

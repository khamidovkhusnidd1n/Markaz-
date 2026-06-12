$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root 'Backend'
$frontendDir = Join-Path $root 'frontend'
$backendScript = Join-Path $root 'run-backend-dev.ps1'
$frontendScript = Join-Path $root 'run-frontend-dev.ps1'
$backendPort = 8000

try {
  $busy8000 = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction Stop | Select-Object -First 1
  if ($busy8000) {
    $backendPort = 8001
  }
} catch {
  $backendPort = 8000
}

if (-not (Test-Path $backendDir)) {
  throw "Backend papkasi topilmadi: $backendDir"
}

if (-not (Test-Path $frontendDir)) {
  throw "Frontend papkasi topilmadi: $frontendDir"
}

if (-not (Test-Path $backendScript)) {
  throw "Backend start skripti topilmadi: $backendScript"
}

if (-not (Test-Path $frontendScript)) {
  throw "Frontend start skripti topilmadi: $frontendScript"
}

Write-Host "Backend ishga tushirilmoqda: http://127.0.0.1:$backendPort" -ForegroundColor Cyan
Start-Process powershell.exe -WorkingDirectory $backendDir -ArgumentList @(
  '-NoExit',
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  $backendScript
)

Start-Sleep -Seconds 2

Write-Host 'Frontend ishga tushirilmoqda: http://127.0.0.1:3000' -ForegroundColor Green
Start-Process powershell.exe -WorkingDirectory $frontendDir -ArgumentList @(
  '-NoExit',
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  $frontendScript
)

Write-Host ''
Write-Host 'Ishga tushirish buyruqlari yuborildi.' -ForegroundColor Yellow
Write-Host 'Frontend: http://127.0.0.1:3000' -ForegroundColor Green
Write-Host ("Backend:  http://127.0.0.1:{0}/api/all-data/" -f $backendPort) -ForegroundColor Cyan
Write-Host ''
Write-Host 'Keyingi safar shu buyruq yetadi:' -ForegroundColor White
Write-Host '.\start-dev.ps1' -ForegroundColor Magenta

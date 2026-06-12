$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Join-Path $PSScriptRoot 'Backend')

$candidatePorts = @(8000, 8001)
$selectedPort = $null

foreach ($port in $candidatePorts) {
  $portBusy = $false
  try {
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop | Select-Object -First 1
    if ($connection) {
      $portBusy = $true
    }
  } catch {
    $portBusy = $false
  }

  if (-not $portBusy) {
    $selectedPort = $port
    break
  }
}

if (-not $selectedPort) {
  throw "Bo'sh backend port topilmadi. Tekshirilgan portlar: $($candidatePorts -join ', ')"
}

Write-Host "Backend ishga tushmoqda: http://127.0.0.1:$selectedPort/api/" -ForegroundColor Cyan
& 'C:\Users\guldona\AppData\Local\Programs\Python\Python313\python.exe' manage.py runserver ("127.0.0.1:{0}" -f $selectedPort) --noreload

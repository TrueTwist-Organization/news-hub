#!/usr/bin/env pwsh
# ────────────────────────────────────────────────────────────
# Neural Times - Dev Server Auto-Restart Script
# Run from: c:\TrueTwist\news-hub-zip\news-hub
# Usage:    .\dev.ps1
# ────────────────────────────────────────────────────────────

$ROOT    = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND = Join-Path $ROOT "backend"

Write-Host "🚀 Starting Neural Times Dev Environment..." -ForegroundColor Cyan

# Kill any leftover node processes on our ports
Get-NetTCPConnection -LocalPort 5000, 5173, 5174, 5175, 5176, 5177 -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 1

# ── Backend: auto-restart loop ─────────────────────────────
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    while ($true) {
        Write-Host "[BACKEND] Starting server..." -ForegroundColor Green
        Set-Location $dir
        node server.js
        Write-Host "[BACKEND] ⚠️  Crashed. Restarting in 3s..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
} -ArgumentList $BACKEND

# ── Frontend: auto-restart loop ────────────────────────────
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    while ($true) {
        Write-Host "[FRONTEND] Starting Vite..." -ForegroundColor Blue
        Set-Location $dir
        npm run dev
        Write-Host "[FRONTEND] ⚠️  Crashed. Restarting in 3s..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
} -ArgumentList (Join-Path $ROOT "frontend")

Write-Host ""
Write-Host "✅ Both servers started with auto-restart." -ForegroundColor Green
Write-Host "   Frontend → http://localhost:5173" -ForegroundColor White
Write-Host "   Backend  → http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop everything." -ForegroundColor DarkGray
Write-Host ""

# Stream output from both jobs
try {
    while ($true) {
        Receive-Job -Job $backendJob  -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[BACKEND]  $_" -ForegroundColor DarkGreen }
        Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor DarkBlue }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host "`n🛑 Stopping all services..." -ForegroundColor Red
    Stop-Job  $backendJob, $frontendJob  -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Get-NetTCPConnection -LocalPort 5000, 5173, 5174, 5175, 5176, 5177 -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique |
        ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Write-Host "All services stopped." -ForegroundColor Gray
}

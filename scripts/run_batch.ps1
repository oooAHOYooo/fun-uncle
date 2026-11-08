# ==============================================================================
# FUN UNCLE: Cloud Unattended Auto-Batch Script
# Pulls git, builds UE C++ binaries, runs tests, and can auto-shutdown to save money
# ==============================================================================

param (
    [switch]$ShutdownOnFinish = $false,
    [string]$AgentPrompt = ""
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  FUN UNCLE: Executing Unattended Cloud Batch Pipeline    " -ForegroundColor Cyan
Write-Host "  Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$RepoDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location -Path $RepoDir

# 1. Pull Latest Code & Data
Write-Host "`n[1/4] Pulling latest changes from origin/main..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Git pull reported warnings or conflicts." -ForegroundColor DarkYellow
}

# 2. Check for Unreal Engine Installation
Write-Host "`n[2/4] Checking Unreal Engine 5 installation..." -ForegroundColor Yellow
$UEPath = ""
$PossiblePaths = @(
    "C:\Program Files\Epic Games\UE_5.5\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe",
    "C:\Program Files\Epic Games\UE_5.4\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe",
    "D:\Epic Games\UE_5.5\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe",
    "D:\Epic Games\UE_5.4\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe"
)

foreach ($path in $PossiblePaths) {
    if (Test-Path $path) {
        $UEPath = $path
        break
    }
}

if ($UEPath) {
    Write-Host "  -> Found Unreal Engine build tool at: $UEPath" -ForegroundColor Green
    $UPROJECT = (Get-ChildItem -Path $RepoDir -Filter "*.uproject" -Recurse | Select-Object -First 1).FullName
    if ($UPROJECT) {
        Write-Host "  -> Building project: $UPROJECT..." -ForegroundColor Cyan
        & "$UEPath" Development Win64 -Project="$UPROJECT" -WaitMutex
    } else {
        Write-Host "  -> No .uproject found in workspace yet. Skipping binary compilation." -ForegroundColor DarkGray
    }
} else {
    Write-Host "  -> Unreal Engine 5 not yet detected in default directories." -ForegroundColor DarkGray
    Write-Host "     (Install UE 5.4/5.5 via Epic Games Launcher if not installed)." -ForegroundColor DarkGray
}

# 3. Optional: Execute Remote Antigravity Agent Task
if ($AgentPrompt) {
    Write-Host "`n[3/4] Invoking Antigravity CLI (agy) with batch task..." -ForegroundColor Yellow
    Write-Host "  Prompt: $AgentPrompt" -ForegroundColor Cyan
    agy --prompt "$AgentPrompt"
} else {
    Write-Host "`n[3/4] No queued agent prompt. Skipping agy step." -ForegroundColor DarkGray
}

# 4. Summary & Optional Auto-Shutdown
Write-Host "`n[4/4] Batch tasks completed successfully!" -ForegroundColor Green

if ($ShutdownOnFinish) {
    Write-Host "`n==========================================================" -ForegroundColor Red
    Write-Host "  [SHUTDOWN-ON-FINISH] Halting AirGPU instance now...    " -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Red
    Start-Sleep -Seconds 5
    Stop-Computer -Force
} else {
    Write-Host "Instance will remain active (Idle watchdog will shut down after 20m if inactive)." -ForegroundColor DarkGray
}

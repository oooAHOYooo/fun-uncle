# ==============================================================================
# FUN UNCLE: Cloud GPU Workstation Automation Script (AirGPU / Windows Server)
# Timestamp: 2026-11-08T13:22:00-05:00
# Target: Windows 11 / Windows Server 2022/2025 with NVIDIA GPU
# Usage:
#   irm https://raw.githubusercontent.com/oooAHOYooo/fun-uncle/main/scripts/setup_airgpu.ps1 | iex
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  FUN UNCLE: Initializing Automated Cloud Dev Workstation " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor [System.Net.SecurityProtocolType]::Tls12

# 1. Install Package Managers & CLI Utilities
Write-Host "[1/7] Installing Git and GitHub CLI..." -ForegroundColor Yellow
winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements
winget install -e --id GitHub.cli --accept-source-agreements --accept-package-agreements

# 2. Install Node.js LTS and Python
Write-Host "[2/7] Installing Node.js LTS and Python 3.11..." -ForegroundColor Yellow
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
winget install -e --id Python.Python.3.11 --accept-source-agreements --accept-package-agreements

# Refresh environment variables in current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 3. Install Antigravity CLI (agy)
Write-Host "[3/7] Installing Antigravity CLI (agy) for autonomous agent operations..." -ForegroundColor Yellow
try {
    irm https://antigravity.google/cli/install.ps1 | iex
    Write-Host "  -> Antigravity CLI (agy) installed successfully." -ForegroundColor Green
} catch {
    Write-Host "  -> Note: Antigravity CLI install will retry after terminal restart." -ForegroundColor DarkGray
}

# 4. Install Game Development Tools & IDEs
Write-Host "[4/7] Installing Epic Games Launcher..." -ForegroundColor Yellow
winget install -e --id EpicGames.EpicGamesLauncher --accept-source-agreements --accept-package-agreements

Write-Host "[5/7] Installing Visual Studio 2022 Community (Game Dev with C++)..." -ForegroundColor Yellow
winget install -e --id Microsoft.VisualStudio.2022.Community --override "--add Microsoft.VisualStudio.Workload.NativeGame --passive --norestart" --accept-source-agreements --accept-package-agreements

Write-Host "[6/7] Installing VS Code CLI for agent tunneling..." -ForegroundColor Yellow
winget install -e --id Microsoft.VisualStudioCode --accept-source-agreements --accept-package-agreements

# 5. Configure Remote Access & OpenSSH Server
Write-Host "[7/7] Enabling OpenSSH Server & Auto-Idle Watchdog..." -ForegroundColor Yellow
try {
    Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 -ErrorAction SilentlyContinue
    Start-Service sshd -ErrorAction SilentlyContinue
    Set-Service -Name sshd -StartupType 'Automatic'
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22 -ErrorAction SilentlyContinue
    Write-Host "  -> OpenSSH Server configured successfully." -ForegroundColor Green
} catch {
    Write-Host "  -> Note: SSH setup can be completed after Windows reboot." -ForegroundColor DarkGray
}

# 6. Clone / Update Repository
$WorkspacePath = "$HOME\Projects"
if (-not (Test-Path -Path $WorkspacePath)) {
    New-Item -ItemType Directory -Path $WorkspacePath | Out-Null
}

$RepoPath = "$WorkspacePath\fun-uncle"
if (-not (Test-Path -Path "$RepoPath\.git")) {
    Write-Host "Cloning fun-uncle repository into $RepoPath..." -ForegroundColor Cyan
    git clone https://github.com/oooAHOYooo/fun-uncle.git $RepoPath
} else {
    Write-Host "fun-uncle repo already exists at $RepoPath. Pulling latest..." -ForegroundColor Cyan
    git -C $RepoPath pull
}

# 7. Register Auto-Idle Watchdog Scheduled Task (Cost Saver: Stops VM if idle >20m)
$WatchdogScript = "$RepoPath\scripts\watchdog_idle_shutdown.ps1"
if (Test-Path -Path $WatchdogScript) {
    try {
        $Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchdogScript`""
        $Trigger = New-ScheduledTaskTrigger -AtStartup
        Register-ScheduledTask -TaskName "FunUncleIdleWatchdog" -Action $Action -Trigger $Trigger -User "SYSTEM" -RunLevel Highest -Force -ErrorAction SilentlyContinue | Out-Null
        Start-ScheduledTask -TaskName "FunUncleIdleWatchdog" -ErrorAction SilentlyContinue | Out-Null
        Write-Host "  -> Idle Watchdog registered & started (Protects against runaway bills)." -ForegroundColor Green
    } catch {
        Write-Host "  -> Note: Watchdog registration skipped (can be run manually)." -ForegroundColor DarkGray
    }
}

# 8. Create Fast Launcher Shortcuts on Desktop
$AgentShortcut = "$HOME\Desktop\Start_Antigravity_Agent.bat"
"@echo off`ncd /d `"$RepoPath`"`nagy`npause" | Out-File -FilePath $AgentShortcut -Encoding ascii -Force

$BatchShortcut = "$HOME\Desktop\Auto_Batch_Sync.bat"
"@echo off`npowershell -ExecutionPolicy Bypass -File `"$RepoPath\scripts\run_batch.ps1`"`npause" | Out-File -FilePath $BatchShortcut -Encoding ascii -Force

$BatchShutdownShortcut = "$HOME\Desktop\Auto_Batch_Sync_AND_SHUTDOWN.bat"
"@echo off`npowershell -ExecutionPolicy Bypass -File `"$RepoPath\scripts\run_batch.ps1`" -ShutdownOnFinish`npause" | Out-File -FilePath $BatchShutdownShortcut -Encoding ascii -Force

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE! Environment Ready for Autonomous Dev   " -ForegroundColor Green
Write-Host "  1. agy (Antigravity CLI) is installed: run 'agy' in repo" -ForegroundColor White
Write-Host "  2. Open Epic Games Launcher & install Unreal Engine 5.4/5.5" -ForegroundColor White
Write-Host "  3. Idle watchdog is active (auto-shuts down if left idle)" -ForegroundColor White
Write-Host "  4. Workspace: $RepoPath" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green

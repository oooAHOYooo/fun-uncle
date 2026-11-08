# ==============================================================================
# FUN UNCLE: Cloud GPU Workstation Automation Script (AirGPU / Windows Server)
# Timestamp: 2026-11-08T11:58:00-05:00
# Target: Windows 11 / Windows Server 2022/2025 with NVIDIA GPU
# Usage:
#   irm https://raw.githubusercontent.com/oooAHOYooo/fun-uncle/main/scripts/setup_airgpu.ps1 | iex
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  FUN UNCLE: Initializing Cloud Dev Workstation Setup     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor [System.Net.SecurityProtocolType]::Tls12

# 1. Install Package Managers & CLI Utilities
Write-Host "[1/5] Installing Git and GitHub CLI..." -ForegroundColor Yellow
winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements
winget install -e --id GitHub.cli --accept-source-agreements --accept-package-agreements

# Refresh environment variables in current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 2. Install Game Development Tools
Write-Host "[2/5] Installing Epic Games Launcher..." -ForegroundColor Yellow
winget install -e --id EpicGames.EpicGamesLauncher --accept-source-agreements --accept-package-agreements

Write-Host "[3/5] Installing Visual Studio 2022 Community (Game Dev with C++)..." -ForegroundColor Yellow
winget install -e --id Microsoft.VisualStudio.2022.Community --override "--add Microsoft.VisualStudio.Workload.NativeGame --passive --norestart" --accept-source-agreements --accept-package-agreements

# 3. Configure Remote Access & OpenSSH Server
Write-Host "[4/5] Enabling and starting OpenSSH Server..." -ForegroundColor Yellow
try {
    Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 -ErrorAction SilentlyContinue
    Start-Service sshd -ErrorAction SilentlyContinue
    Set-Service -Name sshd -StartupType 'Automatic'
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22 -ErrorAction SilentlyContinue
    Write-Host "  -> OpenSSH Server configured successfully." -ForegroundColor Green
} catch {
    Write-Host "  -> Note: SSH setup can be completed after Windows reboot." -ForegroundColor DarkGray
}

# 4. Install VS Code and Remote Tunneling
Write-Host "[5/5] Installing VS Code CLI for agent tunneling..." -ForegroundColor Yellow
winget install -e --id Microsoft.VisualStudioCode --accept-source-agreements --accept-package-agreements

# 5. Clone the Repository if not present
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

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE! Next steps:                             " -ForegroundColor Green
Write-Host "  1. Open Epic Games Launcher & install Unreal Engine 5.4/5.5" -ForegroundColor White
Write-Host "  2. Run 'code tunnel' in terminal to link VS Code agent tunnel" -ForegroundColor White
Write-Host "  3. Project workspace is ready at: $RepoPath" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green

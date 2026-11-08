# ==============================================================================
# FUN UNCLE: Cloud GPU Idle Watchdog & Auto-Shutdown Protection
# Prevents runaway billing on AirGPU / Cloud VMs ($1-$2/hr savings)
# ==============================================================================

param (
    [int]$IdleMinutesThreshold = 20,
    [int]$CpuThresholdPercent = 10
)

Write-Host "[Watchdog] Starting AirGPU Idle Watchdog service..." -ForegroundColor Cyan
Write-Host "[Watchdog] Shutdown threshold: $IdleMinutesThreshold mins idle, CPU < $CpuThresholdPercent%" -ForegroundColor Gray

$idleCounter = 0
$checkIntervalSeconds = 60

while ($true) {
    Start-Sleep -Seconds $checkIntervalSeconds

    # 1. Check for active streaming or remote desktop sessions
    $activeMoonlight = Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Where-Object { 
        $_.LocalPort -in 47984, 47989, 48010, 47998, 47999, 48000
    }
    $activeSsh = Get-NetTCPConnection -LocalPort 22 -State Established -ErrorAction SilentlyContinue
    $activeRdp = Get-NetTCPConnection -LocalPort 3389 -State Established -ErrorAction SilentlyContinue

    $hasActiveSession = ($null -ne $activeMoonlight) -or ($null -ne $activeSsh) -or ($null -ne $activeRdp)

    # 2. Check CPU load
    $cpuLoad = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average

    # 3. Check for active game / compilation processes
    $busyProcesses = Get-Process -Name "UnrealEditor", "UnrealBuildTool", "cl", "link", "devenv", "git" -ErrorAction SilentlyContinue

    if ($hasActiveSession -or ($cpuLoad -gt $CpuThresholdPercent) -or ($null -ne $busyProcesses)) {
        if ($idleCounter -gt 0) {
            Write-Host "[Watchdog] Activity detected (ActiveSession=$([bool]$hasActiveSession), CPU=$cpuLoad%). Resetting idle counter." -ForegroundColor Green
        }
        $idleCounter = 0
    } else {
        $idleCounter++
        $remaining = $IdleMinutesThreshold - $idleCounter
        Write-Host "[Watchdog] VM idle for $idleCounter minute(s). Auto-shutdown in $remaining minute(s)..." -ForegroundColor Yellow

        if ($idleCounter -ge $IdleMinutesThreshold) {
            Write-Host "[Watchdog] IDLE THRESHOLD REACHED. Initiating cloud shutdown to prevent billing..." -ForegroundColor Red
            Stop-Computer -Force
            break
        }
    }
}

# cleanup_and_restart.ps1
# This script kills any process on port 5000 and restarts the backend with nodemon

echo "--- [1/3] Checking for processes on port 5000 ---"
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -First 1

if ($process) {
    $pidToKill = $process.OwningProcess
    echo "Found process $pidToKill on port 5000. Terminating..."
    Stop-Process -Id $pidToKill -Force
    echo "Process terminated."
} else {
    echo "No process found on port 5000."
}

echo "--- [2/3] Cleaning up any zombie Node processes ---"
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
echo "Cleanup complete."

echo "--- [3/3] Starting backend with nodemon ---"
npm run dev

# TVET Appraisal System Backend Development Server Startup Script

Write-Host "Starting TVET Appraisal System Backend Development Server..." -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found. Please run setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Error: node_modules not found. Please run setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Health check: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "API documentation: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

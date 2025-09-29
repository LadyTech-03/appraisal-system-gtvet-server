# TVET Appraisal System Database Reset Script

Write-Host "TVET Appraisal System Database Reset" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red
Write-Host ""
Write-Host "WARNING: This will delete all data in the database!" -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host "Are you sure you want to reset the database? (yes/no)"

if ($confirmation -eq "yes") {
    Write-Host "Resetting database..." -ForegroundColor Yellow
    
    # Reset the database
    npm run reset
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to reset database." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Database reset completed." -ForegroundColor Green
    Write-Host ""
    Write-Host "Running migrations..." -ForegroundColor Yellow
    npm run migrate
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to run migrations." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Running seeders..." -ForegroundColor Yellow
    npm run seed
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to run seeders." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Database reset and reinitialized successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Admin login credentials:" -ForegroundColor Yellow
    Write-Host "Email: admin@tvet.gov.gh" -ForegroundColor White
    Write-Host "Password: Check ADMIN_PASSWORD in your .env file" -ForegroundColor White
} else {
    Write-Host "Database reset cancelled." -ForegroundColor Yellow
}

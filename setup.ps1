# TVET Appraisal System Backend Setup Script for Windows PowerShell

Write-Host "TVET Appraisal System Backend Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies." -ForegroundColor Red
    exit 1
}

Write-Host "Dependencies installed successfully." -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created. Please update the database credentials and other settings." -ForegroundColor Yellow
} else {
    Write-Host ".env file already exists." -ForegroundColor Green
}

# Create uploads directories
Write-Host "Creating upload directories..." -ForegroundColor Yellow
$uploadDirs = @("src/uploads/signatures", "src/uploads/documents", "src/uploads/avatars", "logs")
foreach ($dir in $uploadDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Green
    }
}

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npm run migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to run migrations. Please check your database connection." -ForegroundColor Red
    exit 1
}

Write-Host "Database migrations completed successfully." -ForegroundColor Green

# Seed the database
Write-Host "Seeding database..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to seed database." -ForegroundColor Red
    exit 1
}

Write-Host "Database seeded successfully." -ForegroundColor Green

Write-Host ""
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update the .env file with your database credentials and other settings" -ForegroundColor White
Write-Host "2. Start the development server with: npm run dev" -ForegroundColor White
Write-Host "3. The API will be available at: http://localhost:5000" -ForegroundColor White
Write-Host "4. Health check endpoint: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@tvet.gov.gh" -ForegroundColor White
Write-Host "Password: Check ADMIN_PASSWORD in your .env file" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see the README.md file." -ForegroundColor Yellow

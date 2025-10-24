# 🚀 Civic DAO - API Keys Setup Script (PowerShell)
# This script helps you configure all the required API keys for the Civic DAO project

Write-Host "🏛️ Welcome to Civic DAO API Keys Setup!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Function to prompt for API key
function Prompt-ApiKey {
    param(
        [string]$KeyName,
        [string]$Description,
        [string]$Url = "",
        [bool]$IsRequired = $false
    )
    
    Write-Host "📋 $Description" -ForegroundColor Blue
    if ($Url -ne "") {
        Write-Host "   Setup URL: $Url" -ForegroundColor Yellow
    }
    
    if ($IsRequired) {
        Write-Host "   ⚠️  REQUIRED" -ForegroundColor Red
    } else {
        Write-Host "   ℹ️  Optional" -ForegroundColor Yellow
    }
    
    $apiKey = Read-Host "   Enter your $KeyName"
    
    if ($apiKey -ne "") {
        Write-Host "   ✅ $KeyName configured" -ForegroundColor Green
        return "$KeyName=$apiKey"
    } else {
        if ($IsRequired) {
            Write-Host "   ❌ $KeyName is required but not provided" -ForegroundColor Red
            return $null
        } else {
            Write-Host "   ⏭️  Skipping $KeyName" -ForegroundColor Yellow
            return $null
        }
    }
    Write-Host ""
}

# Function to create environment files
function Create-EnvFiles {
    Write-Host "📁 Creating environment files..." -ForegroundColor Blue
    
    # Frontend .env.local
    if (!(Test-Path "frontend\.env.local")) {
        Copy-Item "frontend\env.example" "frontend\.env.local"
        Write-Host "✅ Created frontend\.env.local" -ForegroundColor Green
    } else {
        Write-Host "⚠️  frontend\.env.local already exists" -ForegroundColor Yellow
    }
    
    # Backend .env
    if (!(Test-Path "backend\.env")) {
        Copy-Item "backend\env.example" "backend\.env"
        Write-Host "✅ Created backend\.env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  backend\.env already exists" -ForegroundColor Yellow
    }
    
    # Contracts .env
    if (!(Test-Path "contracts\.env")) {
        Copy-Item "contracts\env.example" "contracts\.env"
        Write-Host "✅ Created contracts\.env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  contracts\.env already exists" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Function to setup blockchain APIs
function Setup-BlockchainApis {
    Write-Host "⛓️  Blockchain & Web3 APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Alchemy (Primary)
    $alchemyKey = Prompt-ApiKey -KeyName "NEXT_PUBLIC_ALCHEMY_API_KEY" -Description "Alchemy API Key (Primary blockchain provider)" -Url "https://www.alchemy.com/" -IsRequired $true
    if ($alchemyKey) { $envVars += $alchemyKey }
    
    # Infura (Alternative)
    $infuraKey = Prompt-ApiKey -KeyName "NEXT_PUBLIC_INFURA_KEY" -Description "Infura API Key (Alternative blockchain provider)" -Url "https://infura.io/" -IsRequired $false
    if ($infuraKey) { $envVars += $infuraKey }
    
    # WalletConnect
    $walletConnectKey = Prompt-ApiKey -KeyName "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID" -Description "WalletConnect Project ID" -Url "https://cloud.walletconnect.com/" -IsRequired $true
    if ($walletConnectKey) { $envVars += $walletConnectKey }
    
    return $envVars
}

# Function to setup governance APIs
function Setup-GovernanceApis {
    Write-Host "🏛️  Governance & DAO APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Tally
    $tallyKey = Prompt-ApiKey -KeyName "NEXT_PUBLIC_TALLY_API_KEY" -Description "Tally API Key (Governance analytics)" -Url "https://www.tally.xyz/" -IsRequired $false
    if ($tallyKey) { $envVars += $tallyKey }
    
    $tallyDaoId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_TALLY_DAO_ID" -Description "Tally DAO ID" -IsRequired $false
    if ($tallyDaoId) { $envVars += $tallyDaoId }
    
    # Snapshot (Alternative)
    $snapshotUrl = Prompt-ApiKey -KeyName "NEXT_PUBLIC_SNAPSHOT_API_URL" -Description "Snapshot API URL" -Url "https://snapshot.org/" -IsRequired $false
    if ($snapshotUrl) { $envVars += $snapshotUrl }
    
    $snapshotSpaceId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_SNAPSHOT_SPACE_ID" -Description "Snapshot Space ID" -IsRequired $false
    if ($snapshotSpaceId) { $envVars += $snapshotSpaceId }
    
    return $envVars
}

# Function to setup identity APIs
function Setup-IdentityApis {
    Write-Host "🔐 Identity & ZK-Proof APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # World ID
    $worldIdAppId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_WORLD_ID_APP_ID" -Description "World ID App ID" -Url "https://worldcoin.org/world-id" -IsRequired $false
    if ($worldIdAppId) { $envVars += $worldIdAppId }
    
    $worldIdActionId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_WORLD_ID_ACTION_ID" -Description "World ID Action ID" -IsRequired $false
    if ($worldIdActionId) { $envVars += $worldIdActionId }
    
    # Semaphore (Alternative)
    $semaphoreGroupId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_SEMAPHORE_GROUP_ID" -Description "Semaphore Group ID" -Url "https://semaphore.appliedzkp.org/" -IsRequired $false
    if ($semaphoreGroupId) { $envVars += $semaphoreGroupId }
    
    $semaphoreContract = Prompt-ApiKey -KeyName "NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS" -Description "Semaphore Contract Address" -IsRequired $false
    if ($semaphoreContract) { $envVars += $semaphoreContract }
    
    return $envVars
}

# Function to setup storage APIs
function Setup-StorageApis {
    Write-Host "📁 Decentralized Storage APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Pinata (Primary)
    $pinataKey = Prompt-ApiKey -KeyName "NEXT_PUBLIC_PINATA_API_KEY" -Description "Pinata API Key" -Url "https://www.pinata.cloud/" -IsRequired $false
    if ($pinataKey) { $envVars += $pinataKey }
    
    $pinataSecret = Prompt-ApiKey -KeyName "NEXT_PUBLIC_PINATA_SECRET_KEY" -Description "Pinata Secret Key" -IsRequired $false
    if ($pinataSecret) { $envVars += $pinataSecret }
    
    # Web3.Storage (Alternative)
    $web3StorageToken = Prompt-ApiKey -KeyName "NEXT_PUBLIC_WEB3_STORAGE_TOKEN" -Description "Web3.Storage Token" -Url "https://web3.storage/" -IsRequired $false
    if ($web3StorageToken) { $envVars += $web3StorageToken }
    
    return $envVars
}

# Function to setup analytics APIs
function Setup-AnalyticsApis {
    Write-Host "📊 Analytics & Monitoring APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Mixpanel
    $mixpanelToken = Prompt-ApiKey -KeyName "NEXT_PUBLIC_MIXPANEL_TOKEN" -Description "Mixpanel Token" -Url "https://mixpanel.com/" -IsRequired $false
    if ($mixpanelToken) { $envVars += $mixpanelToken }
    
    # PostHog (Alternative)
    $posthogKey = Prompt-ApiKey -KeyName "NEXT_PUBLIC_POSTHOG_KEY" -Description "PostHog Key" -Url "https://posthog.com/" -IsRequired $false
    if ($posthogKey) { $envVars += $posthogKey }
    
    # Google Analytics
    $gaId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID" -Description "Google Analytics ID" -Url "https://analytics.google.com/" -IsRequired $false
    if ($gaId) { $envVars += $gaId }
    
    return $envVars
}

# Function to setup security APIs
function Setup-SecurityApis {
    Write-Host "🔒 Security & Authentication APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Auth0
    $auth0Domain = Prompt-ApiKey -KeyName "NEXT_PUBLIC_AUTH0_DOMAIN" -Description "Auth0 Domain" -Url "https://auth0.com/" -IsRequired $false
    if ($auth0Domain) { $envVars += $auth0Domain }
    
    $auth0ClientId = Prompt-ApiKey -KeyName "NEXT_PUBLIC_AUTH0_CLIENT_ID" -Description "Auth0 Client ID" -IsRequired $false
    if ($auth0ClientId) { $envVars += $auth0ClientId }
    
    $auth0Audience = Prompt-ApiKey -KeyName "NEXT_PUBLIC_AUTH0_AUDIENCE" -Description "Auth0 Audience" -IsRequired $false
    if ($auth0Audience) { $envVars += $auth0Audience }
    
    return $envVars
}

# Function to setup backend APIs
function Setup-BackendApis {
    Write-Host "🖥️  Backend Configuration" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Database
    $mongodbUri = Prompt-ApiKey -KeyName "MONGODB_URI" -Description "MongoDB Connection String" -Url "https://www.mongodb.com/" -IsRequired $false
    if ($mongodbUri) { $envVars += $mongodbUri }
    
    $redisUrl = Prompt-ApiKey -KeyName "REDIS_URL" -Description "Redis Connection String" -Url "https://redis.io/" -IsRequired $false
    if ($redisUrl) { $envVars += $redisUrl }
    
    # Email Services
    $sendgridKey = Prompt-ApiKey -KeyName "SENDGRID_API_KEY" -Description "SendGrid API Key" -Url "https://sendgrid.com/" -IsRequired $false
    if ($sendgridKey) { $envVars += $sendgridKey }
    
    $mailgunKey = Prompt-ApiKey -KeyName "MAILGUN_API_KEY" -Description "Mailgun API Key" -Url "https://www.mailgun.com/" -IsRequired $false
    if ($mailgunKey) { $envVars += $mailgunKey }
    
    # Monitoring
    $sentryDsn = Prompt-ApiKey -KeyName "SENTRY_DSN" -Description "Sentry DSN" -Url "https://sentry.io/" -IsRequired $false
    if ($sentryDsn) { $envVars += $sentryDsn }
    
    return $envVars
}

# Function to setup contract APIs
function Setup-ContractApis {
    Write-Host "📜 Smart Contract APIs" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    $envVars = @()
    
    # Block Explorer APIs
    $polygonscanKey = Prompt-ApiKey -KeyName "POLYGONSCAN_API_KEY" -Description "Polygonscan API Key" -Url "https://polygonscan.com/" -IsRequired $false
    if ($polygonscanKey) { $envVars += $polygonscanKey }
    
    $etherscanKey = Prompt-ApiKey -KeyName "ETHERSCAN_API_KEY" -Description "Etherscan API Key" -Url "https://etherscan.io/" -IsRequired $false
    if ($etherscanKey) { $envVars += $etherscanKey }
    
    $arbiscanKey = Prompt-ApiKey -KeyName "ARBISCAN_API_KEY" -Description "Arbiscan API Key" -Url "https://arbiscan.io/" -IsRequired $false
    if ($arbiscanKey) { $envVars += $arbiscanKey }
    
    return $envVars
}

# Main setup function
function Main {
    Write-Host "🚀 Starting API Keys Setup..." -ForegroundColor Green
    Write-Host ""
    
    # Create environment files
    Create-EnvFiles
    
    # Setup different categories of APIs
    $allEnvVars = @()
    $allEnvVars += Setup-BlockchainApis
    $allEnvVars += Setup-GovernanceApis
    $allEnvVars += Setup-IdentityApis
    $allEnvVars += Setup-StorageApis
    $allEnvVars += Setup-AnalyticsApis
    $allEnvVars += Setup-SecurityApis
    $allEnvVars += Setup-BackendApis
    $allEnvVars += Setup-ContractApis
    
    # Write to frontend .env.local
    if ($allEnvVars.Count -gt 0) {
        $allEnvVars | Out-File -FilePath "frontend\.env.local" -Append -Encoding UTF8
        Write-Host "✅ Updated frontend\.env.local with new API keys" -ForegroundColor Green
    }
    
    Write-Host "🎉 API Keys Setup Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Blue
    Write-Host "1. Review your environment files:"
    Write-Host "   - frontend\.env.local"
    Write-Host "   - backend\.env"
    Write-Host "   - contracts\.env"
    Write-Host ""
    Write-Host "2. Update any placeholder values with your actual API keys"
    Write-Host ""
    Write-Host "3. Test your configuration by running:"
    Write-Host "   npm run test:apis"
    Write-Host ""
    Write-Host "🏛️ Your Civic DAO is ready to go!" -ForegroundColor Green
}

# Run the main function
Main

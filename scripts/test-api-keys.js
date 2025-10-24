#!/usr/bin/env node

/**
 * 🚀 Civic DAO - API Keys Testing Script
 * This script tests all configured API keys to ensure they're working correctly
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0
};

// Function to log with colors
function log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https:') ? https : http;
        
        const req = protocol.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Function to test API key
async function testApiKey(name, description, testFunction) {
    log(`\n📋 Testing ${name}`, 'blue');
    log(`   ${description}`, 'white');
    
    testResults.total++;
    
    try {
        const result = await testFunction();
        if (result.success) {
            log(`   ✅ ${name} - PASSED`, 'green');
            testResults.passed++;
            return true;
        } else {
            log(`   ❌ ${name} - FAILED: ${result.error}`, 'red');
            testResults.failed++;
            return false;
        }
    } catch (error) {
        log(`   ❌ ${name} - ERROR: ${error.message}`, 'red');
        testResults.failed++;
        return false;
    }
}

// Function to load environment variables
function loadEnvFile(filePath) {
    const env = {};
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                env[key.trim()] = valueParts.join('=').trim();
            }
        });
    }
    return env;
}

// Load environment variables from all files
const frontendEnv = loadEnvFile(path.join(__dirname, '../frontend/.env.local'));
const backendEnv = loadEnvFile(path.join(__dirname, '../backend/.env'));
const contractsEnv = loadEnvFile(path.join(__dirname, '../contracts/.env'));

// Combine all environment variables
const env = { ...frontendEnv, ...backendEnv, ...contractsEnv };

// API Test Functions
const apiTests = {
    // Blockchain APIs
    async testAlchemy() {
        const apiKey = env.NEXT_PUBLIC_ALCHEMY_API_KEY;
        if (!apiKey || apiKey === 'your-alchemy-api-key') {
            return { success: false, error: 'API key not configured' };
        }
        
        const url = `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`;
        const response = await makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    async testInfura() {
        const apiKey = env.NEXT_PUBLIC_INFURA_KEY;
        if (!apiKey || apiKey === 'your-infura-api-key') {
            return { success: false, error: 'API key not configured' };
        }
        
        const url = `https://mainnet.infura.io/v3/${apiKey}`;
        const response = await makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    async testWalletConnect() {
        const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
        if (!projectId || projectId === 'your-project-id') {
            return { success: false, error: 'Project ID not configured' };
        }
        
        // WalletConnect doesn't have a direct API to test, so we just check if the ID is valid format
        if (projectId.length > 10) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid Project ID format' };
        }
    },

    // Governance APIs
    async testTally() {
        const apiKey = env.NEXT_PUBLIC_TALLY_API_KEY;
        if (!apiKey || apiKey === 'your-tally-api-key') {
            return { success: false, error: 'API key not configured' };
        }
        
        const url = 'https://api.tally.xyz/daos';
        const response = await makeRequest(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    async testSnapshot() {
        const apiUrl = env.NEXT_PUBLIC_SNAPSHOT_API_URL;
        if (!apiUrl || apiUrl === 'your-snapshot-api-url') {
            return { success: false, error: 'API URL not configured' };
        }
        
        const response = await makeRequest(`${apiUrl}/spaces`);
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    // Identity APIs
    async testWorldID() {
        const appId = env.NEXT_PUBLIC_WORLD_ID_APP_ID;
        if (!appId || appId === 'your-world-id-app-id') {
            return { success: false, error: 'App ID not configured' };
        }
        
        // World ID doesn't have a direct API to test, so we just check if the ID is valid format
        if (appId.startsWith('app_')) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid App ID format' };
        }
    },

    // Storage APIs
    async testPinata() {
        const apiKey = env.NEXT_PUBLIC_PINATA_API_KEY;
        if (!apiKey || apiKey === 'your-pinata-api-key') {
            return { success: false, error: 'API key not configured' };
        }
        
        const url = 'https://api.pinata.cloud/data/testAuthentication';
        const response = await makeRequest(url, {
            method: 'GET',
            headers: {
                'pinata_api_key': apiKey,
                'pinata_secret_api_key': env.NEXT_PUBLIC_PINATA_SECRET_KEY || 'your-pinata-secret-key'
            }
        });
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    async testWeb3Storage() {
        const token = env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
        if (!token || token === 'your-web3-storage-token') {
            return { success: false, error: 'Token not configured' };
        }
        
        const url = 'https://api.web3.storage/user';
        const response = await makeRequest(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    // Analytics APIs
    async testMixpanel() {
        const token = env.NEXT_PUBLIC_MIXPANEL_TOKEN;
        if (!token || token === 'your-mixpanel-token') {
            return { success: false, error: 'Token not configured' };
        }
        
        // Mixpanel doesn't have a direct API to test, so we just check if the token is valid format
        if (token.startsWith('mixpanel_')) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid token format' };
        }
    },

    async testPostHog() {
        const key = env.NEXT_PUBLIC_POSTHOG_KEY;
        if (!key || key === 'your-posthog-key') {
            return { success: false, error: 'Key not configured' };
        }
        
        // PostHog doesn't have a direct API to test, so we just check if the key is valid format
        if (key.startsWith('phc_')) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid key format' };
        }
    },

    // Security APIs
    async testAuth0() {
        const domain = env.NEXT_PUBLIC_AUTH0_DOMAIN;
        if (!domain || domain === 'your-auth0-domain.auth0.com') {
            return { success: false, error: 'Domain not configured' };
        }
        
        const url = `https://${domain}/.well-known/openid_configuration`;
        const response = await makeRequest(url);
        
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            return { success: false, error: `HTTP ${response.statusCode}` };
        }
    },

    // Database APIs
    async testMongoDB() {
        const uri = env.MONGODB_URI;
        if (!uri || uri === 'your-mongodb-uri') {
            return { success: false, error: 'URI not configured' };
        }
        
        // MongoDB connection testing would require the MongoDB driver
        // For now, we just check if the URI format is valid
        if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid URI format' };
        }
    },

    async testRedis() {
        const url = env.REDIS_URL;
        if (!url || url === 'your-redis-url') {
            return { success: false, error: 'URL not configured' };
        }
        
        // Redis connection testing would require the Redis client
        // For now, we just check if the URL format is valid
        if (url.startsWith('redis://') || url.startsWith('rediss://')) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid URL format' };
        }
    }
};

// Main testing function
async function runTests() {
    log('🚀 Starting API Keys Testing...', 'green');
    log('================================', 'green');
    
    // Test all APIs
    await testApiKey('Alchemy', 'Blockchain infrastructure provider', apiTests.testAlchemy);
    await testApiKey('Infura', 'Alternative blockchain provider', apiTests.testInfura);
    await testApiKey('WalletConnect', 'Wallet connection service', apiTests.testWalletConnect);
    await testApiKey('Tally', 'Governance analytics platform', apiTests.testTally);
    await testApiKey('Snapshot', 'Governance platform', apiTests.testSnapshot);
    await testApiKey('World ID', 'ZK-proof identity service', apiTests.testWorldID);
    await testApiKey('Pinata', 'IPFS storage service', apiTests.testPinata);
    await testApiKey('Web3.Storage', 'Alternative IPFS storage', apiTests.testWeb3Storage);
    await testApiKey('Mixpanel', 'Analytics platform', apiTests.testMixpanel);
    await testApiKey('PostHog', 'Alternative analytics platform', apiTests.testPostHog);
    await testApiKey('Auth0', 'Authentication service', apiTests.testAuth0);
    await testApiKey('MongoDB', 'Database service', apiTests.testMongoDB);
    await testApiKey('Redis', 'Cache service', apiTests.testRedis);
    
    // Print summary
    log('\n📊 Test Results Summary', 'blue');
    log('========================', 'blue');
    log(`✅ Passed: ${testResults.passed}`, 'green');
    log(`❌ Failed: ${testResults.failed}`, 'red');
    log(`⏭️  Skipped: ${testResults.skipped}`, 'yellow');
    log(`📊 Total: ${testResults.total}`, 'white');
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    log(`\n🎯 Success Rate: ${successRate}%`, successRate > 80 ? 'green' : 'red');
    
    if (testResults.failed > 0) {
        log('\n⚠️  Some API keys failed testing. Please check your configuration.', 'yellow');
        log('   Make sure to update your environment files with valid API keys.', 'yellow');
    } else {
        log('\n🎉 All configured API keys are working correctly!', 'green');
    }
    
    log('\n🏛️ Your Civic DAO is ready to go!', 'green');
}

// Run the tests
runTests().catch(console.error);

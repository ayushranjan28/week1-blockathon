const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Civic DAO contracts to testnet...");

  // Get the contract factories
  const CivicToken = await ethers.getContractFactory("CivicToken");
  const TimelockController = await ethers.getContractFactory("TimelockController");
  const Treasury = await ethers.getContractFactory("Treasury");
  const ZKIdentity = await ethers.getContractFactory("ZKIdentity");
  const CivicDAO = await ethers.getContractFactory("CivicDAO");

  // Deploy CivicToken
  console.log("📝 Deploying CivicToken...");
  const civicToken = await CivicToken.deploy();
  await civicToken.waitForDeployment();
  const tokenAddress = await civicToken.getAddress();
  console.log("✅ CivicToken deployed to:", tokenAddress);

  // Deploy TimelockController
  console.log("⏰ Deploying TimelockController...");
  const timelock = await TimelockController.deploy(
    2 * 24 * 60 * 60, // 2 days delay
    [], // proposers (empty for now)
    [], // executors (empty for now)
    ethers.ZeroAddress // admin (zero address for now)
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ TimelockController deployed to:", timelockAddress);

  // Deploy Treasury
  console.log("💰 Deploying Treasury...");
  const treasury = await Treasury.deploy();
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("✅ Treasury deployed to:", treasuryAddress);

  // Deploy ZKIdentity
  console.log("🔐 Deploying ZKIdentity...");
  const zkIdentity = await ZKIdentity.deploy();
  await zkIdentity.waitForDeployment();
  const zkIdentityAddress = await zkIdentity.getAddress();
  console.log("✅ ZKIdentity deployed to:", zkIdentityAddress);

  // Deploy CivicDAO
  console.log("🏛️ Deploying CivicDAO...");
  const civicDAO = await CivicDAO.deploy(
    tokenAddress, // voting token
    timelockAddress, // timelock
    4, // 4% quorum
    1, // 1 block voting delay
    40320, // 1 week voting period (assuming 12s block time)
    ethers.parseEther("1000") // 1000 tokens proposal threshold
  );
  await civicDAO.waitForDeployment();
  const daoAddress = await civicDAO.getAddress();
  console.log("✅ CivicDAO deployed to:", daoAddress);

  // Set up roles
  console.log("🔐 Setting up roles...");
  
  // Grant proposer role to DAO
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  await timelock.grantRole(PROPOSER_ROLE, daoAddress);
  console.log("✅ Granted proposer role to DAO");

  // Grant executor role to DAO
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  await timelock.grantRole(EXECUTOR_ROLE, daoAddress);
  console.log("✅ Granted executor role to DAO");

  // Renounce admin role
  const ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE();
  await timelock.renounceRole(ADMIN_ROLE, await timelock.owner());
  console.log("✅ Renounced admin role");

  // Set up Treasury
  console.log("💰 Setting up Treasury...");
  await treasury.addSupportedToken(tokenAddress);
  console.log("✅ Added CivicToken to Treasury supported tokens");

  // Transfer ownership of Treasury to DAO (through timelock)
  await treasury.transferOwnership(timelockAddress);
  console.log("✅ Transferred Treasury ownership to Timelock");

  // Transfer ownership of ZKIdentity to DAO (through timelock)
  await zkIdentity.transferOwnership(timelockAddress);
  console.log("✅ Transferred ZKIdentity ownership to Timelock");

  // Get network info
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId.toString();

  // Create deployment info
  const deploymentInfo = {
    network: {
      name: network.name,
      chainId: chainId,
      rpcUrl: process.env.RPC_URL || "https://rpc-amoy.polygon.technology"
    },
    contracts: {
      civicToken: tokenAddress,
      timelock: timelockAddress,
      civicDAO: daoAddress,
      treasury: treasuryAddress,
      zkIdentity: zkIdentityAddress
    },
    deployment: {
      timestamp: new Date().toISOString(),
      deployer: await timelock.owner(),
      blockNumber: await ethers.provider.getBlockNumber()
    },
    governance: {
      proposalThreshold: ethers.formatEther(await civicDAO.proposalThreshold()),
      votingDelay: await civicDAO.votingDelay(),
      votingPeriod: await civicDAO.votingPeriod(),
      quorum: await civicDAO.quorum(await ethers.provider.getBlockNumber())
    }
  };

  // Save deployment info
  const deploymentPath = path.join(__dirname, "..", "deployments", `${chainId}.json`);
  const deploymentsDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentPath);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract Addresses:");
  console.log("CivicToken:", tokenAddress);
  console.log("TimelockController:", timelockAddress);
  console.log("CivicDAO:", daoAddress);
  console.log("Treasury:", treasuryAddress);
  console.log("ZKIdentity:", zkIdentityAddress);

  console.log("\n📝 Next steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update frontend configuration with contract addresses");
  console.log("3. Distribute tokens to community members");
  console.log("4. Start creating proposals!");

  console.log("\n🔗 Block Explorer URLs:");
  if (chainId === "80002") {
    console.log(`CivicToken: https://amoy.polygonscan.com/address/${tokenAddress}`);
    console.log(`TimelockController: https://amoy.polygonscan.com/address/${timelockAddress}`);
    console.log(`CivicDAO: https://amoy.polygonscan.com/address/${daoAddress}`);
    console.log(`Treasury: https://amoy.polygonscan.com/address/${treasuryAddress}`);
    console.log(`ZKIdentity: https://amoy.polygonscan.com/address/${zkIdentityAddress}`);
  } else if (chainId === "11155111") {
    console.log(`CivicToken: https://sepolia.etherscan.io/address/${tokenAddress}`);
    console.log(`TimelockController: https://sepolia.etherscan.io/address/${timelockAddress}`);
    console.log(`CivicDAO: https://sepolia.etherscan.io/address/${daoAddress}`);
    console.log(`Treasury: https://sepolia.etherscan.io/address/${treasuryAddress}`);
    console.log(`ZKIdentity: https://sepolia.etherscan.io/address/${zkIdentityAddress}`);
  }

  return deploymentInfo;
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Civic DAO", function () {
  let civicToken, timelock, civicDAO, treasury, zkIdentity;
  let owner, citizen1, citizen2, citizen3;
  let proposalThreshold, votingDelay, votingPeriod, quorumPercentage;

  beforeEach(async function () {
    [owner, citizen1, citizen2, citizen3] = await ethers.getSigners();

    // Deploy contracts
    const CivicToken = await ethers.getContractFactory("CivicToken");
    civicToken = await CivicToken.deploy();
    await civicToken.waitForDeployment();

    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelock = await TimelockController.deploy(
      2 * 24 * 60 * 60, // 2 days delay
      [], // proposers
      [], // executors
      ethers.ZeroAddress // admin
    );
    await timelock.waitForDeployment();

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy();
    await treasury.waitForDeployment();

    const ZKIdentity = await ethers.getContractFactory("ZKIdentity");
    zkIdentity = await ZKIdentity.deploy();
    await zkIdentity.waitForDeployment();

    const CivicDAO = await ethers.getContractFactory("CivicDAO");
    civicDAO = await CivicDAO.deploy(
      await civicToken.getAddress(),
      await timelock.getAddress(),
      4, // 4% quorum
      1, // 1 block voting delay
      40320, // 1 week voting period
      ethers.parseEther("1000") // 1000 tokens proposal threshold
    );
    await civicDAO.waitForDeployment();

    // Set up roles
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
    const ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE();

    await timelock.grantRole(PROPOSER_ROLE, await civicDAO.getAddress());
    await timelock.grantRole(EXECUTOR_ROLE, await civicDAO.getAddress());
    await timelock.renounceRole(ADMIN_ROLE, owner.address);

    // Set up Treasury
    await treasury.addSupportedToken(await civicToken.getAddress());
    await treasury.transferOwnership(await timelock.getAddress());

    // Set up ZKIdentity
    await zkIdentity.transferOwnership(await timelock.getAddress());

    // Distribute tokens
    await civicToken.mint(citizen1.address, ethers.parseEther("10000"));
    await civicToken.mint(citizen2.address, ethers.parseEther("10000"));
    await civicToken.mint(citizen3.address, ethers.parseEther("10000"));

    // Delegate voting power
    await civicToken.connect(citizen1).delegate(citizen1.address);
    await civicToken.connect(citizen2).delegate(citizen2.address);
    await civicToken.connect(citizen3).delegate(citizen3.address);

    proposalThreshold = ethers.parseEther("1000");
    votingDelay = 1;
    votingPeriod = 40320;
    quorumPercentage = 4;
  });

  describe("Deployment", function () {
    it("Should deploy all contracts successfully", async function () {
      expect(await civicToken.getAddress()).to.not.equal(ethers.ZeroAddress);
      expect(await timelock.getAddress()).to.not.equal(ethers.ZeroAddress);
      expect(await civicDAO.getAddress()).to.not.equal(ethers.ZeroAddress);
      expect(await treasury.getAddress()).to.not.equal(ethers.ZeroAddress);
      expect(await zkIdentity.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set correct initial parameters", async function () {
      expect(await civicDAO.votingDelay()).to.equal(votingDelay);
      expect(await civicDAO.votingPeriod()).to.equal(votingPeriod);
      expect(await civicDAO.proposalThreshold()).to.equal(proposalThreshold);
    });

    it("Should have correct token supply", async function () {
      const totalSupply = await civicToken.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("10000000")); // 10M initial supply
    });
  });

  describe("ZK Identity Verification", function () {
    it("Should allow users to submit proofs", async function () {
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.toUtf8Bytes("test-proof");
      const metadata = "QmTestMetadata";

      await expect(zkIdentity.connect(citizen1).submitProof(identityHash, proof, metadata))
        .to.emit(zkIdentity, "ProofSubmitted");
    });

    it("Should verify identity after threshold is met", async function () {
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.toUtf8Bytes("test-proof");
      const metadata = "QmTestMetadata";

      await zkIdentity.connect(citizen1).submitProof(identityHash, proof, metadata);
      
      expect(await zkIdentity.isVerified(citizen1.address)).to.be.true;
    });

    it("Should prevent duplicate identity hashes", async function () {
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.toUtf8Bytes("test-proof");
      const metadata = "QmTestMetadata";

      await zkIdentity.connect(citizen1).submitProof(identityHash, proof, metadata);
      
      await expect(zkIdentity.connect(citizen2).submitProof(identityHash, proof, metadata))
        .to.be.revertedWith("ZKIdentity: Identity hash already used");
    });
  });

  describe("Proposal Creation", function () {
    beforeEach(async function () {
      // Verify citizen1's identity
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.toUtf8Bytes("test-proof");
      const metadata = "QmTestMetadata";
      await zkIdentity.connect(citizen1).submitProof(identityHash, proof, metadata);
    });

    it("Should create proposal with budget", async function () {
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "uint256", "string"],
        [1, await civicToken.getAddress(), citizen1.address, ethers.parseEther("1000"), "Test proposal"]
      )];
      const description = "Test proposal description";
      const title = "Test Proposal";
      const budget = ethers.parseEther("1000");
      const category = "Infrastructure";

      await expect(civicDAO.connect(citizen1).proposeWithBudget(
        targets, values, calldatas, description, title, budget, category
      )).to.emit(civicDAO, "ProposalCreatedWithBudget");
    });

    it("Should reject proposal from unverified user", async function () {
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "uint256", "string"],
        [1, await civicToken.getAddress(), citizen2.address, ethers.parseEther("1000"), "Test proposal"]
      )];
      const description = "Test proposal description";
      const title = "Test Proposal";
      const budget = ethers.parseEther("1000");
      const category = "Infrastructure";

      await expect(civicDAO.connect(citizen2).proposeWithBudget(
        targets, values, calldatas, description, title, budget, category
      )).to.be.revertedWith("CivicDAO: Identity not verified");
    });

    it("Should reject proposal with invalid budget", async function () {
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "uint256", "string"],
        [1, await civicToken.getAddress(), citizen1.address, ethers.parseEther("100"), "Test proposal"]
      )];
      const description = "Test proposal description";
      const title = "Test Proposal";
      const budget = ethers.parseEther("100"); // Below minimum
      const category = "Infrastructure";

      await expect(civicDAO.connect(citizen1).proposeWithBudget(
        targets, values, calldatas, description, title, budget, category
      )).to.be.revertedWith("CivicDAO: Budget too low");
    });
  });

  describe("Voting", function () {
    let proposalId;

    beforeEach(async function () {
      // Verify citizen1's identity
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.toUtf8Bytes("test-proof");
      const metadata = "QmTestMetadata";
      await zkIdentity.connect(citizen1).submitProof(identityHash, proof, metadata);

      // Create proposal
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "uint256", "string"],
        [1, await civicToken.getAddress(), citizen1.address, ethers.parseEther("1000"), "Test proposal"]
      )];
      const description = "Test proposal description";
      const title = "Test Proposal";
      const budget = ethers.parseEther("1000");
      const category = "Infrastructure";

      const tx = await civicDAO.connect(citizen1).proposeWithBudget(
        targets, values, calldatas, description, title, budget, category
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const decoded = civicDAO.interface.parseLog(log);
          return decoded.name === "ProposalCreatedWithBudget";
        } catch {
          return false;
        }
      });
      proposalId = event.args.proposalId;
    });

    it("Should allow voting on proposals", async function () {
      // Wait for voting delay
      await ethers.provider.send("evm_mine", [votingDelay]);

      await expect(civicDAO.connect(citizen1).castVote(proposalId, 1))
        .to.emit(civicDAO, "VoteCast");
    });

    it("Should calculate quorum correctly", async function () {
      // Wait for voting delay
      await ethers.provider.send("evm_mine", [votingDelay]);

      // Vote with enough tokens to meet quorum
      await civicDAO.connect(citizen1).castVote(proposalId, 1);
      await civicDAO.connect(citizen2).castVote(proposalId, 1);

      const proposal = await civicDAO.proposals(proposalId);
      expect(proposal.forVotes).to.be.gt(0);
    });
  });

  describe("Treasury Management", function () {
    it("Should allow depositing funds", async function () {
      const amount = ethers.parseEther("1000");
      
      await civicToken.connect(citizen1).approve(await treasury.getAddress(), amount);
      await expect(treasury.connect(citizen1).depositFunds(await civicToken.getAddress(), amount))
        .to.emit(treasury, "FundsDeposited");
    });

    it("Should track token balances", async function () {
      const amount = ethers.parseEther("1000");
      
      await civicToken.connect(citizen1).approve(await treasury.getAddress(), amount);
      await treasury.connect(citizen1).depositFunds(await civicToken.getAddress(), amount);
      
      const balance = await treasury.getTokenBalance(await civicToken.getAddress());
      expect(balance).to.equal(amount);
    });

    it("Should prevent unauthorized withdrawals", async function () {
      const amount = ethers.parseEther("1000");
      
      await civicToken.connect(citizen1).approve(await treasury.getAddress(), amount);
      await treasury.connect(citizen1).depositFunds(await civicToken.getAddress(), amount);
      
      await expect(treasury.connect(citizen1).withdrawFunds(
        await civicToken.getAddress(),
        citizen1.address,
        amount,
        "Test withdrawal"
      )).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full proposal lifecycle", async function () {
      // 1. Verify identity
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.toUtf8Bytes("test-proof");
      const metadata = "QmTestMetadata";
      await zkIdentity.connect(citizen1).submitProof(identityHash, proof, metadata);

      // 2. Deposit funds to treasury
      const amount = ethers.parseEther("5000");
      await civicToken.connect(citizen1).approve(await treasury.getAddress(), amount);
      await treasury.connect(citizen1).depositFunds(await civicToken.getAddress(), amount);

      // 3. Create proposal
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "uint256", "string"],
        [1, await civicToken.getAddress(), citizen2.address, ethers.parseEther("1000"), "Test proposal"]
      )];
      const description = "Test proposal description";
      const title = "Test Proposal";
      const budget = ethers.parseEther("1000");
      const category = "Infrastructure";

      const tx = await civicDAO.connect(citizen1).proposeWithBudget(
        targets, values, calldatas, description, title, budget, category
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const decoded = civicDAO.interface.parseLog(log);
          return decoded.name === "ProposalCreatedWithBudget";
        } catch {
          return false;
        }
      });
      const proposalId = event.args.proposalId;

      // 4. Vote on proposal
      await ethers.provider.send("evm_mine", [votingDelay]);
      await civicDAO.connect(citizen1).castVote(proposalId, 1);
      await civicDAO.connect(citizen2).castVote(proposalId, 1);

      // 5. Wait for voting period to end
      await ethers.provider.send("evm_mine", [votingPeriod]);

      // 6. Check proposal state
      const state = await civicDAO.state(proposalId);
      expect(state).to.equal(4); // Succeeded state
    });
  });
});

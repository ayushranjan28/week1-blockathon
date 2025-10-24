const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Civic DAO Complete System", function () {
  let civicToken, timelock, treasury, zkIdentity, civicDAO;
  let owner, proposer, voter1, voter2, voter3;
  let proposalThreshold, votingDelay, votingPeriod, quorum;

  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3] = await ethers.getSigners();

    // Deploy CivicToken
    const CivicToken = await ethers.getContractFactory("CivicToken");
    civicToken = await CivicToken.deploy();
    await civicToken.waitForDeployment();

    // Deploy TimelockController
    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelock = await TimelockController.deploy(
      2 * 24 * 60 * 60, // 2 days delay
      [], // proposers (empty for now)
      [], // executors (empty for now)
      ethers.ZeroAddress // admin (zero address for now)
    );
    await timelock.waitForDeployment();

    // Deploy Treasury
    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy();
    await treasury.waitForDeployment();

    // Deploy ZKIdentity
    const ZKIdentity = await ethers.getContractFactory("ZKIdentity");
    zkIdentity = await ZKIdentity.deploy();
    await zkIdentity.waitForDeployment();

    // Deploy CivicDAO
    const CivicDAO = await ethers.getContractFactory("CivicDAO");
    civicDAO = await CivicDAO.deploy(
      await civicToken.getAddress(), // voting token
      await timelock.getAddress(), // timelock
      4, // 4% quorum
      1, // 1 block voting delay
      40320, // 1 week voting period (assuming 12s block time)
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

    // Get governance parameters
    proposalThreshold = await civicDAO.proposalThreshold();
    votingDelay = await civicDAO.votingDelay();
    votingPeriod = await civicDAO.votingPeriod();
    quorum = await civicDAO.quorum(await ethers.provider.getBlockNumber());
  });

  describe("Token Distribution and Delegation", function () {
    it("Should distribute tokens to voters", async function () {
      const amount = ethers.parseEther("10000");
      
      // Mint tokens to voters
      await civicToken.mint(voter1.address, amount);
      await civicToken.mint(voter2.address, amount);
      await civicToken.mint(voter3.address, amount);

      expect(await civicToken.balanceOf(voter1.address)).to.equal(amount);
      expect(await civicToken.balanceOf(voter2.address)).to.equal(amount);
      expect(await civicToken.balanceOf(voter3.address)).to.equal(amount);
    });

    it("Should allow token delegation", async function () {
      const amount = ethers.parseEther("10000");
      await civicToken.mint(voter1.address, amount);
      
      // Delegate to self
      await civicToken.connect(voter1).delegate(voter1.address);
      
      expect(await civicToken.getVotes(voter1.address)).to.equal(amount);
    });

    it("Should allow cross-delegation", async function () {
      const amount = ethers.parseEther("10000");
      await civicToken.mint(voter1.address, amount);
      
      // Delegate to voter2
      await civicToken.connect(voter1).delegate(voter2.address);
      
      expect(await civicToken.getVotes(voter2.address)).to.equal(amount);
      expect(await civicToken.getVotes(voter1.address)).to.equal(0);
    });
  });

  describe("Proposal Creation", function () {
    beforeEach(async function () {
      // Mint tokens to proposer
      await civicToken.mint(proposer.address, proposalThreshold);
      await civicToken.connect(proposer).delegate(proposer.address);
    });

    it("Should create a proposal with budget", async function () {
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [treasury.interface.encodeFunctionData("executeProposal", [
        1, // proposalId
        await civicToken.getAddress(), // token
        voter1.address, // recipient
        ethers.parseEther("1000"), // amount
        "Test proposal execution"
      ])];
      const description = "Test proposal for community garden";
      const title = "Community Garden Initiative";
      const budget = ethers.parseEther("25000");
      const category = "Environment";

      const tx = await civicDAO.connect(proposer).proposeWithBudget(
        targets,
        values,
        calldatas,
        description,
        title,
        budget,
        category
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = civicDAO.interface.parseLog(log);
          return parsed.name === "ProposalCreatedWithBudget";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      
      const parsedEvent = civicDAO.interface.parseLog(event);
      expect(parsedEvent.args.title).to.equal(title);
      expect(parsedEvent.args.budget).to.equal(budget);
    });

    it("Should fail to create proposal without sufficient voting power", async function () {
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = ["0x"];
      const description = "Test proposal";
      const title = "Test Proposal";
      const budget = ethers.parseEther("1000");
      const category = "Test";

      await expect(
        civicDAO.connect(voter1).proposeWithBudget(
          targets,
          values,
          calldatas,
          description,
          title,
          budget,
          category
        )
      ).to.be.revertedWith("Governor: proposer votes below proposal threshold");
    });
  });

  describe("Voting", function () {
    let proposalId;

    beforeEach(async function () {
      // Mint tokens to proposer and voters
      await civicToken.mint(proposer.address, proposalThreshold);
      await civicToken.connect(proposer).delegate(proposer.address);
      
      await civicToken.mint(voter1.address, ethers.parseEther("5000"));
      await civicToken.connect(voter1).delegate(voter1.address);
      
      await civicToken.mint(voter2.address, ethers.parseEther("3000"));
      await civicToken.connect(voter2).delegate(voter2.address);
      
      await civicToken.mint(voter3.address, ethers.parseEther("2000"));
      await civicToken.connect(voter3).delegate(voter3.address);

      // Create a proposal
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [treasury.interface.encodeFunctionData("executeProposal", [
        1,
        await civicToken.getAddress(),
        voter1.address,
        ethers.parseEther("1000"),
        "Test proposal execution"
      ])];
      const description = "Test proposal for community garden";
      const title = "Community Garden Initiative";
      const budget = ethers.parseEther("25000");
      const category = "Environment";

      const tx = await civicDAO.connect(proposer).proposeWithBudget(
        targets,
        values,
        calldatas,
        description,
        title,
        budget,
        category
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = civicDAO.interface.parseLog(log);
          return parsed.name === "ProposalCreatedWithBudget";
        } catch {
          return false;
        }
      });

      proposalId = parsedEvent.args.proposalId;

      // Move to voting period
      await ethers.provider.send("evm_mine", []);
    });

    it("Should allow voting on proposals", async function () {
      // Vote for the proposal
      await civicDAO.connect(voter1).castVote(proposalId, 1); // For
      await civicDAO.connect(voter2).castVote(proposalId, 0); // Against
      await civicDAO.connect(voter3).castVote(proposalId, 2); // Abstain

      // Check vote counts
      const proposal = await civicDAO.getProposalData(proposalId);
      expect(proposal.title).to.equal("Community Garden Initiative");
      expect(proposal.budget).to.equal(ethers.parseEther("25000"));
    });

    it("Should allow voting with reason", async function () {
      const reason = "This proposal will benefit the community";
      
      const tx = await civicDAO.connect(voter1).castVoteWithReason(proposalId, 1, reason);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(log => {
        try {
          const parsed = civicDAO.interface.parseLog(log);
          return parsed.name === "VoteCast";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
      const parsedEvent = civicDAO.interface.parseLog(event);
      expect(parsedEvent.args.reason).to.equal(reason);
    });
  });

  describe("Treasury Management", function () {
    it("Should allow depositing funds", async function () {
      const amount = ethers.parseEther("100000");
      
      // Mint tokens to treasury
      await civicToken.mint(await treasury.getAddress(), amount);
      
      // Check balance
      const balance = await treasury.getTokenBalance(await civicToken.getAddress());
      expect(balance).to.equal(amount);
    });

    it("Should allow adding supported tokens", async function () {
      const supportedTokens = await treasury.getSupportedTokens();
      expect(supportedTokens).to.include(await civicToken.getAddress());
    });

    it("Should allow removing supported tokens", async function () {
      await treasury.removeSupportedToken(await civicToken.getAddress());
      const supportedTokens = await treasury.getSupportedTokens();
      expect(supportedTokens).to.not.include(await civicToken.getAddress());
    });
  });

  describe("ZK Identity Verification", function () {
    it("Should allow submitting ZK proofs", async function () {
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const proof = ethers.keccak256(ethers.toUtf8Bytes("test-proof"));
      const metadata = "Test metadata";

      const tx = await zkIdentity.submitProof(identityHash, proof, metadata);
      const receipt = await tx.wait();

      const event = receipt.logs.find(log => {
        try {
          const parsed = zkIdentity.interface.parseLog(log);
          return parsed.name === "ProofSubmitted";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
    });

    it("Should allow admin to verify identity", async function () {
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const metadata = "Test metadata";

      // Submit proof first
      await zkIdentity.submitProof(identityHash, "0x", metadata);

      // Verify identity (only owner can do this)
      const tx = await zkIdentity.verifyIdentity(owner.address, identityHash, metadata);
      const receipt = await tx.wait();

      const event = receipt.logs.find(log => {
        try {
          const parsed = zkIdentity.interface.parseLog(log);
          return parsed.name === "IdentityVerified";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;

      // Check if user is verified
      const isVerified = await zkIdentity.isVerified(owner.address);
      expect(isVerified).to.be.true;
    });

    it("Should allow admin to revoke identity", async function () {
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("test-identity"));
      const metadata = "Test metadata";

      // Submit and verify identity first
      await zkIdentity.submitProof(identityHash, "0x", metadata);
      await zkIdentity.verifyIdentity(owner.address, identityHash, metadata);

      // Revoke identity
      await zkIdentity.revokeIdentity(owner.address);

      // Check if user is no longer verified
      const isVerified = await zkIdentity.isVerified(owner.address);
      expect(isVerified).to.be.false;
    });
  });

  describe("Proposal Execution", function () {
    let proposalId;

    beforeEach(async function () {
      // Mint tokens to proposer and voters
      await civicToken.mint(proposer.address, proposalThreshold);
      await civicToken.connect(proposer).delegate(proposer.address);
      
      await civicToken.mint(voter1.address, ethers.parseEther("5000"));
      await civicToken.connect(voter1).delegate(voter1.address);
      
      await civicToken.mint(voter2.address, ethers.parseEther("3000"));
      await civicToken.connect(voter2).delegate(voter2.address);

      // Create a proposal
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = [treasury.interface.encodeFunctionData("executeProposal", [
        1,
        await civicToken.getAddress(),
        voter1.address,
        ethers.parseEther("1000"),
        "Test proposal execution"
      ])];
      const description = "Test proposal for community garden";
      const title = "Community Garden Initiative";
      const budget = ethers.parseEther("25000");
      const category = "Environment";

      const tx = await civicDAO.connect(proposer).proposeWithBudget(
        targets,
        values,
        calldatas,
        description,
        title,
        budget,
        category
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = civicDAO.interface.parseLog(log);
          return parsed.name === "ProposalCreatedWithBudget";
        } catch {
          return false;
        }
      });

      proposalId = parsedEvent.args.proposalId;

      // Move to voting period and vote
      await ethers.provider.send("evm_mine", []);
      await civicDAO.connect(voter1).castVote(proposalId, 1);
      await civicDAO.connect(voter2).castVote(proposalId, 1);

      // Move to execution period
      await ethers.provider.send("evm_mine", []);
      await ethers.provider.send("evm_mine", []);
    });

    it("Should execute proposal after voting period", async function () {
      // Check proposal state
      const state = await civicDAO.state(proposalId);
      expect(state).to.equal(4); // Succeeded

      // Execute proposal
      await civicDAO.execute(proposalId);

      // Check proposal state after execution
      const finalState = await civicDAO.state(proposalId);
      expect(finalState).to.equal(7); // Executed
    });
  });

  describe("Governance Parameters", function () {
    it("Should have correct governance parameters", async function () {
      expect(await civicDAO.proposalThreshold()).to.equal(ethers.parseEther("1000"));
      expect(await civicDAO.votingDelay()).to.equal(1);
      expect(await civicDAO.votingPeriod()).to.equal(40320);
      expect(await civicDAO.quorum(await ethers.provider.getBlockNumber())).to.equal(4);
    });

    it("Should get proposal data correctly", async function () {
      // Mint tokens to proposer
      await civicToken.mint(proposer.address, proposalThreshold);
      await civicToken.connect(proposer).delegate(proposer.address);

      // Create a proposal
      const targets = [await treasury.getAddress()];
      const values = [0];
      const calldatas = ["0x"];
      const description = "Test proposal";
      const title = "Test Proposal";
      const budget = ethers.parseEther("1000");
      const category = "Test";

      await civicDAO.connect(proposer).proposeWithBudget(
        targets,
        values,
        calldatas,
        description,
        title,
        budget,
        category
      );

      // Get proposal data
      const proposalData = await civicDAO.getProposalData(1);
      expect(proposalData.title).to.equal(title);
      expect(proposalData.description).to.equal(description);
      expect(proposalData.budget).to.equal(budget);
      expect(proposalData.category).to.equal(category);
      expect(proposalData.proposer).to.equal(proposer.address);
    });
  });

  describe("Security Features", function () {
    it("Should prevent unauthorized access to treasury", async function () {
      await expect(
        treasury.connect(voter1).withdrawFunds(
          await civicToken.getAddress(),
          voter1.address,
          ethers.parseEther("1000")
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent unauthorized access to ZK identity", async function () {
      await expect(
        zkIdentity.connect(voter1).verifyIdentity(
          voter1.address,
          ethers.keccak256(ethers.toUtf8Bytes("test")),
          "test"
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow pausing and unpausing contracts", async function () {
      // Pause treasury
      await treasury.pause();
      expect(await treasury.paused()).to.be.true;

      // Unpause treasury
      await treasury.unpause();
      expect(await treasury.paused()).to.be.false;
    });
  });
});

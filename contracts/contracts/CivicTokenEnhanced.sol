// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CivicToken
 * @dev ERC20 token with voting capabilities for Civic DAO governance
 * @notice This token represents voting power in the Civic DAO ecosystem
 */
contract CivicToken is ERC20Votes, Ownable, Pausable, ReentrancyGuard {
    // Events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount, string reason);
    event IdentityVerified(address indexed user, bool verified);
    event TreasuryDeposit(address indexed from, uint256 amount);
    event TreasuryWithdrawal(address indexed to, uint256 amount, string reason);

    // State variables
    mapping(address => bool) public verifiedCitizens;
    mapping(address => uint256) public citizenRegistrationTime;
    mapping(address => string) public citizenMetadata; // IPFS hash for citizen data
    
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * 10**18; // 10M tokens
    uint256 public constant CITIZEN_REWARD = 100 * 10**18; // 100 tokens for verification
    uint256 public constant MIN_VOTING_POWER = 1 * 10**18; // 1 token minimum to vote
    
    uint256 public treasuryBalance;
    uint256 public totalDistributed;
    uint256 public totalBurned;
    
    bool public mintingEnabled = true;
    bool public burningEnabled = true;

    // Modifiers
    modifier onlyVerifiedCitizen() {
        require(verifiedCitizens[msg.sender], "CivicToken: Not a verified citizen");
        _;
    }

    modifier whenMintingEnabled() {
        require(mintingEnabled, "CivicToken: Minting is disabled");
        _;
    }

    modifier whenBurningEnabled() {
        require(burningEnabled, "CivicToken: Burning is disabled");
        _;
    }

    constructor() ERC20("Civic Token", "CIVIC") EIP712("CivicToken", "1") Ownable(msg.sender) {
        // Mint initial supply to deployer (treasury)
        _mint(msg.sender, INITIAL_SUPPLY);
        treasuryBalance = INITIAL_SUPPLY;
    }

    /**
     * @dev Verify citizen identity and mint tokens
     * @param citizen Address of the citizen to verify
     * @param metadata IPFS hash containing citizen metadata
     * @param zkProof ZK-proof of identity (placeholder)
     */
    function verifyCitizen(
        address citizen,
        string memory metadata,
        bytes calldata zkProof
    ) external onlyOwner whenMintingEnabled nonReentrant {
        require(!verifiedCitizens[citizen], "CivicToken: Already verified");
        require(bytes(metadata).length > 0, "CivicToken: Invalid metadata");
        require(zkProof.length > 0, "CivicToken: Invalid ZK proof");
        
        verifiedCitizens[citizen] = true;
        citizenRegistrationTime[citizen] = block.timestamp;
        citizenMetadata[citizen] = metadata;
        
        // Mint tokens as reward for verification
        _mint(citizen, CITIZEN_REWARD);
        totalDistributed += CITIZEN_REWARD;
        
        emit IdentityVerified(citizen, true);
        emit TokensMinted(citizen, CITIZEN_REWARD, "Citizen verification reward");
    }

    /**
     * @dev Revoke citizen verification
     * @param citizen Address of the citizen to revoke
     */
    function revokeCitizen(address citizen) external onlyOwner {
        require(verifiedCitizens[citizen], "CivicToken: Not verified");
        
        verifiedCitizens[citizen] = false;
        citizenRegistrationTime[citizen] = 0;
        citizenMetadata[citizen] = "";
        
        emit IdentityVerified(citizen, false);
    }

    /**
     * @dev Mint additional tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting
     */
    function mint(
        address to,
        uint256 amount,
        string memory reason
    ) external onlyOwner whenMintingEnabled nonReentrant {
        require(to != address(0), "CivicToken: Cannot mint to zero address");
        require(amount > 0, "CivicToken: Amount must be positive");
        
        _mint(to, amount);
        totalDistributed += amount;
        
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Burn tokens from treasury
     * @param amount Amount of tokens to burn
     * @param reason Reason for burning
     */
    function burnFromTreasury(
        uint256 amount,
        string memory reason
    ) external onlyOwner whenBurningEnabled nonReentrant {
        require(amount > 0, "CivicToken: Amount must be positive");
        require(balanceOf(address(this)) >= amount, "CivicToken: Insufficient treasury balance");
        
        _burn(address(this), amount);
        treasuryBalance -= amount;
        totalBurned += amount;
        
        emit TokensBurned(address(this), amount, reason);
    }

    /**
     * @dev Deposit tokens to treasury
     * @param amount Amount of tokens to deposit
     */
    function depositToTreasury(uint256 amount) external nonReentrant {
        require(amount > 0, "CivicToken: Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "CivicToken: Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        treasuryBalance += amount;
        
        emit TreasuryDeposit(msg.sender, amount);
    }

    /**
     * @dev Withdraw tokens from treasury (only owner)
     * @param to Address to withdraw tokens to
     * @param amount Amount of tokens to withdraw
     * @param reason Reason for withdrawal
     */
    function withdrawFromTreasury(
        address to,
        uint256 amount,
        string memory reason
    ) external onlyOwner nonReentrant {
        require(to != address(0), "CivicToken: Cannot withdraw to zero address");
        require(amount > 0, "CivicToken: Amount must be positive");
        require(treasuryBalance >= amount, "CivicToken: Insufficient treasury balance");
        
        _transfer(address(this), to, amount);
        treasuryBalance -= amount;
        
        emit TreasuryWithdrawal(to, amount, reason);
    }

    /**
     * @dev Check if address has minimum voting power
     * @param account Address to check
     * @return True if has minimum voting power
     */
    function hasVotingPower(address account) external view returns (bool) {
        return balanceOf(account) >= MIN_VOTING_POWER;
    }

    /**
     * @dev Get citizen information
     * @param citizen Address of the citizen
     * @return verified Whether citizen is verified
     * @return registrationTime When citizen was registered
     * @return metadata Citizen metadata IPFS hash
     * @return votingPower Current voting power
     */
    function getCitizenInfo(address citizen) external view returns (
        bool verified,
        uint256 registrationTime,
        string memory metadata,
        uint256 votingPower
    ) {
        return (
            verifiedCitizens[citizen],
            citizenRegistrationTime[citizen],
            citizenMetadata[citizen],
            balanceOf(citizen)
        );
    }

    /**
     * @dev Get treasury information
     * @return balance Current treasury balance
     * @return totalDistributed Total tokens distributed
     * @return totalBurned Total tokens burned
     */
    function getTreasuryInfo() external view returns (
        uint256 balance,
        uint256 totalDistributed,
        uint256 totalBurned
    ) {
        return (treasuryBalance, totalDistributed, totalBurned);
    }

    /**
     * @dev Override transfer to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Enable/disable minting
     * @param enabled Whether minting should be enabled
     */
    function setMintingEnabled(bool enabled) external onlyOwner {
        mintingEnabled = enabled;
    }

    /**
     * @dev Enable/disable burning
     * @param enabled Whether burning should be enabled
     */
    function setBurningEnabled(bool enabled) external onlyOwner {
        burningEnabled = enabled;
    }

    /**
     * @dev Emergency function to recover tokens sent to contract
     * @param token Address of the token to recover
     * @param amount Amount to recover
     */
    function emergencyRecover(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "CivicToken: Cannot recover own tokens");
        IERC20(token).transfer(msg.sender, amount);
    }
}

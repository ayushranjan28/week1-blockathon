// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Treasury
 * @dev Manages DAO funds and executes approved proposals
 * @notice This contract handles treasury operations and fund management
 */
contract Treasury is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event FundsDeposited(address indexed token, address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed token, address indexed to, uint256 amount, string reason);
    event ProposalExecuted(uint256 indexed proposalId, address indexed token, uint256 amount, address indexed recipient);
    event EmergencyWithdrawal(address indexed token, address indexed to, uint256 amount);
    event TreasuryPaused(address indexed account);
    event TreasuryUnpaused(address indexed account);

    // State variables
    mapping(address => uint256) public tokenBalances;
    mapping(address => bool) public approvedTokens;
    mapping(uint256 => bool) public executedProposals;
    
    address[] public supportedTokens;
    uint256 public totalProposalsExecuted;
    uint256 public totalFundsManaged;

    // Modifiers
    modifier onlyApprovedToken(address token) {
        require(approvedTokens[token], "Treasury: Token not approved");
        _;
    }

    modifier proposalNotExecuted(uint256 proposalId) {
        require(!executedProposals[proposalId], "Treasury: Proposal already executed");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Add a supported token
     * @param token Address of the token to add
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Treasury: Invalid token address");
        require(!approvedTokens[token], "Treasury: Token already approved");
        
        approvedTokens[token] = true;
        supportedTokens.push(token);
    }

    /**
     * @dev Remove a supported token
     * @param token Address of the token to remove
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(approvedTokens[token], "Treasury: Token not approved");
        
        approvedTokens[token] = false;
        
        // Remove from supportedTokens array
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == token) {
                supportedTokens[i] = supportedTokens[supportedTokens.length - 1];
                supportedTokens.pop();
                break;
            }
        }
    }

    /**
     * @dev Deposit funds to treasury
     * @param token Address of the token to deposit
     * @param amount Amount of tokens to deposit
     */
    function depositFunds(address token, uint256 amount) external onlyApprovedToken(token) nonReentrant {
        require(amount > 0, "Treasury: Amount must be positive");
        require(IERC20(token).balanceOf(msg.sender) >= amount, "Treasury: Insufficient balance");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        tokenBalances[token] += amount;
        totalFundsManaged += amount;
        
        emit FundsDeposited(token, msg.sender, amount);
    }

    /**
     * @dev Withdraw funds from treasury (only owner)
     * @param token Address of the token to withdraw
     * @param to Address to withdraw tokens to
     * @param amount Amount of tokens to withdraw
     * @param reason Reason for withdrawal
     */
    function withdrawFunds(
        address token,
        address to,
        uint256 amount,
        string memory reason
    ) external onlyOwner onlyApprovedToken(token) nonReentrant {
        require(to != address(0), "Treasury: Invalid recipient address");
        require(amount > 0, "Treasury: Amount must be positive");
        require(tokenBalances[token] >= amount, "Treasury: Insufficient treasury balance");
        
        tokenBalances[token] -= amount;
        IERC20(token).safeTransfer(to, amount);
        
        emit FundsWithdrawn(token, to, amount, reason);
    }

    /**
     * @dev Execute approved proposal
     * @param proposalId ID of the proposal
     * @param token Address of the token to transfer
     * @param recipient Address to send tokens to
     * @param amount Amount of tokens to transfer
     * @param description Description of the proposal execution
     */
    function executeProposal(
        uint256 proposalId,
        address token,
        address recipient,
        uint256 amount,
        string memory description
    ) external onlyOwner onlyApprovedToken(token) proposalNotExecuted(proposalId) nonReentrant {
        require(recipient != address(0), "Treasury: Invalid recipient address");
        require(amount > 0, "Treasury: Amount must be positive");
        require(tokenBalances[token] >= amount, "Treasury: Insufficient treasury balance");
        require(bytes(description).length > 0, "Treasury: Description required");
        
        executedProposals[proposalId] = true;
        tokenBalances[token] -= amount;
        totalProposalsExecuted++;
        
        IERC20(token).safeTransfer(recipient, amount);
        
        emit ProposalExecuted(proposalId, token, amount, recipient);
    }

    /**
     * @dev Emergency withdrawal (only owner)
     * @param token Address of the token to withdraw
     * @param to Address to withdraw tokens to
     * @param amount Amount of tokens to withdraw
     */
    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner onlyApprovedToken(token) nonReentrant {
        require(to != address(0), "Treasury: Invalid recipient address");
        require(amount > 0, "Treasury: Amount must be positive");
        
        IERC20(token).safeTransfer(to, amount);
        
        emit EmergencyWithdrawal(token, to, amount);
    }

    /**
     * @dev Get treasury balance for a specific token
     * @param token Address of the token
     * @return Balance of the token in treasury
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return tokenBalances[token];
    }

    /**
     * @dev Get all supported tokens
     * @return Array of supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /**
     * @dev Get treasury statistics
     * @return totalProposalsExecuted Total number of proposals executed
     * @return totalFundsManaged Total funds managed by treasury
     * @return supportedTokensCount Number of supported tokens
     */
    function getTreasuryStats() external view returns (
        uint256 totalProposalsExecuted,
        uint256 totalFundsManaged,
        uint256 supportedTokensCount
    ) {
        return (totalProposalsExecuted, totalFundsManaged, supportedTokens.length);
    }

    /**
     * @dev Check if a proposal has been executed
     * @param proposalId ID of the proposal
     * @return True if proposal has been executed
     */
    function isProposalExecuted(uint256 proposalId) external view returns (bool) {
        return executedProposals[proposalId];
    }

    /**
     * @dev Pause treasury operations
     */
    function pause() external onlyOwner {
        _pause();
        emit TreasuryPaused(msg.sender);
    }

    /**
     * @dev Unpause treasury operations
     */
    function unpause() external onlyOwner {
        _unpause();
        emit TreasuryUnpaused(msg.sender);
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {
        // ETH is automatically added to contract balance
    }

    /**
     * @dev Withdraw ETH (only owner)
     * @param to Address to send ETH to
     * @param amount Amount of ETH to withdraw
     */
    function withdrawETH(address payable to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Treasury: Invalid recipient address");
        require(amount > 0, "Treasury: Amount must be positive");
        require(address(this).balance >= amount, "Treasury: Insufficient ETH balance");
        
        to.transfer(amount);
        
        emit FundsWithdrawn(address(0), to, amount, "ETH withdrawal");
    }
}

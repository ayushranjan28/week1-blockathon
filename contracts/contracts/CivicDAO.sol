// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CivicDAO
 * @dev A governance contract for civic decision-making with ZK-proof identity support
 * @notice This contract enables transparent, on-chain voting for city governance
 */
contract CivicDAO is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    // Events
    event ProposalCreatedWithBudget(
        uint256 proposalId,
        address proposer,
        string title,
        uint256 budget,
        uint256 deadline
    );
    
    event ZKIdentityVerified(address indexed user, bytes32 identityHash);
    event ProposalExecutedWithBudget(uint256 proposalId, uint256 budget);

    // Structs
    struct ProposalData {
        string title;
        string description;
        uint256 budget;
        string category;
        address proposer;
        uint256 createdAt;
    }

    // State variables
    mapping(uint256 => ProposalData) public proposalData;
    mapping(address => bool) public verifiedIdentities;
    mapping(address => bytes32) public identityHashes;
    
    uint256 public constant MIN_PROPOSAL_BUDGET = 1000 * 10**18; // 1000 tokens minimum
    uint256 public constant MAX_PROPOSAL_BUDGET = 1000000 * 10**18; // 1M tokens maximum
    
    string[] public categories = [
        "Infrastructure",
        "Environment",
        "Education",
        "Healthcare",
        "Transportation",
        "Safety",
        "Culture",
        "Technology",
        "Other"
    ];

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercentage,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold
    )
        Governor("CivicDAO")
        GovernorSettings(
            _votingDelay,     // 1 block
            _votingPeriod,    // 1 week
            _proposalThreshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    /**
     * @dev Create a new proposal with budget and category
     * @param targets Contract addresses to call
     * @param values ETH values for each call
     * @param calldatas Encoded function calls
     * @param description Human readable description
     * @param title Proposal title
     * @param budget Proposed budget allocation
     * @param category Proposal category
     */
    function proposeWithBudget(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        string memory title,
        uint256 budget,
        string memory category
    ) public returns (uint256) {
        require(verifiedIdentities[msg.sender], "CivicDAO: Identity not verified");
        require(budget >= MIN_PROPOSAL_BUDGET, "CivicDAO: Budget too low");
        require(budget <= MAX_PROPOSAL_BUDGET, "CivicDAO: Budget too high");
        require(_isValidCategory(category), "CivicDAO: Invalid category");

        uint256 proposalId = propose(targets, values, calldatas, description);
        
        proposalData[proposalId] = ProposalData({
            title: title,
            description: description,
            budget: budget,
            category: category,
            proposer: msg.sender,
            createdAt: block.timestamp
        });

        emit ProposalCreatedWithBudget(proposalId, msg.sender, title, budget, block.timestamp + votingPeriod());
        
        return proposalId;
    }

    /**
     * @dev Verify ZK-proof identity (placeholder implementation)
     * @param identityHash Hash of the ZK-proof identity
     * @param proof ZK-proof (placeholder)
     */
    function verifyZKIdentity(bytes32 identityHash, bytes calldata proof) external {
        // Placeholder for ZK-proof verification
        // In a real implementation, this would verify the ZK-proof
        require(proof.length > 0, "CivicDAO: Invalid proof");
        
        verifiedIdentities[msg.sender] = true;
        identityHashes[msg.sender] = identityHash;
        
        emit ZKIdentityVerified(msg.sender, identityHash);
    }

    /**
     * @dev Get proposal data
     * @param proposalId The proposal ID
     * @return ProposalData struct containing proposal information
     */
    function getProposalData(uint256 proposalId) external view returns (ProposalData memory) {
        return proposalData[proposalId];
    }

    /**
     * @dev Get all available categories
     * @return Array of category strings
     */
    function getCategories() external view returns (string[] memory) {
        return categories;
    }

    /**
     * @dev Check if a category is valid
     * @param category The category to check
     * @return True if valid, false otherwise
     */
    function _isValidCategory(string memory category) internal view returns (bool) {
        for (uint256 i = 0; i < categories.length; i++) {
            if (keccak256(bytes(category)) == keccak256(bytes(categories[i]))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Override to add budget execution logic
     */
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
        
        // Emit budget execution event
        emit ProposalExecutedWithBudget(proposalId, proposalData[proposalId].budget);
    }

    // Required overrides
    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

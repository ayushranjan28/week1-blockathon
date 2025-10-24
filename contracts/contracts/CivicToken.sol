// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CivicToken
 * @dev ERC20 token with voting capabilities for Civic DAO
 * @notice This token represents voting power in the civic governance system
 */
contract CivicToken is ERC20Votes, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000000 * 10**18; // 10M tokens
    uint256 public constant MAX_SUPPLY = 100000000 * 10**18; // 100M tokens max
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor() ERC20("Civic Token", "CIVIC") ERC20Permit("Civic Token") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint tokens to a specific address (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "CivicToken: Max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens from a specific address (only owner)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev Get the current total supply
     * @return Current total supply of tokens
     */
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }
    
    /**
     * @dev Get the maximum supply
     * @return Maximum supply of tokens
     */
    function getMaxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }
}

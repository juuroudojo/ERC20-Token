// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./ERC20.sol";
import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BepaBenTen is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor() ERC20("BepaBenTen", "BBT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    function mint(address recipient, uint256 amount)
        public
        onlyRole(MINTER_ROLE)
    {
        balances[recipient] += amount;
        _totalTokens += amount;

        emit Transfer(address(0), recipient, amount);
    }

    function burn(address _from, uint256 _amount) public onlyRole(BURNER_ROLE) {
        balances[_from] -= _amount;
        _totalTokens -= _amount;

        emit Transfer(_from, address(0), _amount);
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./interfaces/IERC20.sol";

contract ERC20 is IERC20 {
    address owner;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;

    uint _totalTokens;
    string _name;
    string _symbol;

    modifier enoughTokens(address _from, uint _amount) {
        require(balanceOf(_from) >= _amount, "Insufficient balance!");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function decimals() external pure returns (uint) {
        return 18;
    }

    function totalSupply() public view returns (uint256) {
        return _totalTokens;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return allowances[_owner][_spender];
    }

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance!");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount) external {
        _approve(msg.sender, spender, amount);
    }

    function _approve(
        address sender,
        address spender,
        uint256 amount
    ) internal virtual {
        allowances[sender][spender] += amount;

        emit Approve(sender, spender, amount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public enoughTokens(sender, amount) {
        require(
            allowances[sender][msg.sender] >= amount,
            "Allowance declined!"
        );

        allowances[sender][msg.sender] -= amount;
        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }
}

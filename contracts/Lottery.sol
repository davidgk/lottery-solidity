// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    // it's a pseudo random number , as we can see is easy to predict each params
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty * block.timestamp * players.length)));
    }

    function pickWinner() public returns (address){
        uint randomValue = random();
        uint winnerIndex = randomValue % players.length;
        return players[winnerIndex];
    }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;
    address payable public winner;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    // it's a pseudo random number , as we can see is easy to predict each params
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function balance() public view returns (uint){
        return address(this).balance;
    }

    function pickWinner() public restrictedManager{
        uint randomValue = random();
        uint winnerIndex = randomValue % players.length;
        winner = payable(players[winnerIndex]);
        winner.transfer(address(this).balance);
        players = new address[](0);
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }

    modifier restrictedManager(){
        require(msg.sender == manager);
        _;
    }
}
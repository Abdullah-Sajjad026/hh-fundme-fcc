// SPDX-License-Identifier: MIT

// 1. Pragma
pragma solidity ^0.8.8;

// 2. Imports
// importing AggregatorV3Interface of ChainLink Data Feeds.
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./PriceConverter.sol";

// 3. Interfaces, Libraries, Contracts
error FundMe__NotOwner();

/**
 * @title A sample Funding Contract
 * @author Abdullah Sajjad
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    address private immutable i_owner;
    AggregatorV3Interface private immutable i_priceFeed;

    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;

    // Events (we have none!)

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    /* 
    Functions Order:
        constructor
        receive
        fallback
        external
        public
        internal
        private
        view / pure
    */
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(
            msg.value.convertEthToUSD(i_priceFeed) >= MINIMUM_USD,
            "Didn't send enough!"
        );

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset array
        s_funders = new address[](0);

        /*
            Withdraw Funds: 
                1. transfer
                2. send
                3. call
            solidity by example
        */
        // transfer
        payable(msg.sender).transfer(address(this).balance); // throws error if failed

        // send
        bool sendStatus = payable(msg.sender).send(address(this).balance); // returns boolean
        require(sendStatus, "Send Failed");

        // call
        (bool callStatus, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callStatus, "Call Failed");
    }

    // Getters
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }
}

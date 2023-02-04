// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// importing AggregatorV3Interface of ChainLink Data Feeds.
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getEthPriceInUSD(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        /* since we are interacting with a smart contract outside of ours,
        we need its ABI and Adderss. */

        /* 
            Network: Eth Goerli Testnet
            Aggregator: ETH/USD
            Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        */

        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000);
    }

    function convertEthToUSD(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPriceInUSD = getEthPriceInUSD(priceFeed);
        uint256 calculatedUSD = (ethAmount * ethPriceInUSD) /
            1000000000000000000;
        return calculatedUSD;
    }
}

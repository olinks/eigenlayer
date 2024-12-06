const ethers = require('ethers');
const dotenv = require("dotenv")
dotenv.config();
const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
];

const strategyManagerAbi = require('./abi/strategyManagerABI.json');
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const provider = new ethers.AlchemyProvider('mainnet', ALCHEMY_API_KEY);

const strategyManagerContractAddress = "0x858646372CC42E1A627fcE94aa7A7033e7CF075A";
const strategyManagerContract = new ethers.Contract(strategyManagerContractAddress, strategyManagerAbi, provider);
const stETHStrategyAddress = "0x93c4b944D05dfe6df7645A86cd2206016c51564D";
const eigeinStrategyAddress = "0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7";

async function getApproval(address, tokencontractAddress) {
    try {
        const tokenContract = new ethers.Contract(tokencontractAddress, erc20Abi, provider);
        const isApproved = await tokenContract.approve(strategyManagerContractAddress, ethers.constants.MaxUint256);
        return isApproved;
    } catch (error) {
        console.log("getApproval error", error);
        return false;
    }
}

async function restake(strategyManagerContract, tokenContractAddress, amount) {
    try {
        const isApproved = await getApproval(strategyManagerContractAddress, tokenContractAddress);
        if (!isApproved) {
        }
        const tx = await strategyManagerContract.depositIntoStrategy(strategycontract, tokenContractAddress, amount);
        return tx;
    } catch (error) {
        console.error("restake error", error);
        return false;
    }
}
async function createRestakeTransaction(strategycontract, tokenContractAddress, amount) {
    try {
        // Get the contract interface
        const strategyManagerInterface = strategyManagerContract.interface;

        // Create the transaction data
        const txData = strategyManagerInterface.encodeFunctionData(
            "depositIntoStrategy",
            [strategycontract, tokenContractAddress, amount]
        );

        // Return transaction object
        return {
            to: strategyManagerContractAddress,
            data: txData,
            value: "0x00" // No ETH being sent
        };
    } catch (error) {
        console.error("createRestakeTransaction error", error);
        return null;
    }
}
module.exports = {
    restake,
    createRestakeTransaction
};
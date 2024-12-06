const ethers = require('ethers');
const dotenv = require("dotenv")
dotenv.config();
const erc20Abi = ethers.getAddress
const strategyManagerAbi = require('./abi/strategyManagerABI.json');
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const provider = new ethers.AlchemyProvider('mainnet', ALCHEMY_API_KEY);

const strategyManagerContractAddress = "0x858646372CC42E1A627fcE94aa7A7033e7CF075A";
const strategyManagerContract = new ethers.Contract(strategyManagerContractAddress, strategyManagerAbi, provider);

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

async function restake(strategycontract, tokenContractAddress, userAddress, amount) {
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
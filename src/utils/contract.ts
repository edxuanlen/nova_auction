import { ethers } from 'ethers'
import { Controller, Controller__factory } from '../api'

import {
    useReadContract,
    useWriteContract,
    useSimulateContract,
    useWatchContractEvent,
    useAccount
} from 'wagmi'

import { config } from '../config'
export const auctionContractAddress = '0x1291Be112d480055DaFd8a610b7d1e203891C274'
export const ezETHContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

import { ethers } from 'ethers';
import { EventInfo } from '../types';

import { formatEther, erc20Abi, maxUint256, etherUnits, maxUint8, Address } from 'viem'
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'


export const provider = new ethers.JsonRpcProvider('http://10.227.60.68:8545/');
export const signer = await provider.getSigner();
export const contract = Controller__factory.connect(auctionContractAddress, signer);

const abi = Controller__factory.abi;
export const auctionABI = abi;

// const topicCharged = ethers.id("Charge(address,uint8,uint256,uint256)");
// console.log("topicCharged", topicCharged.toString());
// provider.getLogs({
//     fromBlock: 0,
//     toBlock: 'latest',
//     address: auctionContractAddress,
//     topics: [topicCharged, address],
// }).then(logs => {
//     console.log(logs);
// });

// provider.getTransaction('0x4408f1316fc22349ba680df59da58c7bbd2d9ea6c04de585c44b786ce0a16cb1').then(tx => {
//     console.log("TRX:", tx)
// });

const topicCharged = ethers.id("Charge(address,uint8,uint256,uint256)");
const topicDeal = ethers.id("Deal(address,uint8,uint256,uint256)");
const topicRefund = ethers.id("Refund(address,uint8,uint256,uint256)");

export const getLogerWithWalletAddress = (walletAddress: string) => {

    let datas: (EventInfo)[] = [];

    provider.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: auctionContractAddress,
        topics: [topicCharged],
    }).then(logs => {
        for (let log of logs) {
            const data = ethers.AbiCoder.defaultAbiCoder().decode(["address", "uint8", "uint256", "uint256"], log.data);
            if (data[0] == walletAddress) {
                const eventInfo = {
                    eventType: "Charge",
                    address: data[0],
                    pointType: data[1],
                    bidAmount: data[2],
                    bidPoints: data[3]
                };
                datas.push(eventInfo);
            }
        }
    });

    provider.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: auctionContractAddress,
        topics: [topicDeal],
    }).then(logs => {
        for (let log of logs) {
            const data = ethers.AbiCoder.defaultAbiCoder().decode(["address", "uint8", "uint256", "uint256"], log.data);
            if (data[0] == walletAddress) {
                const eventInfo = {
                    eventType: "Deal",
                    address: data[0],
                    pointType: data[1],
                    bidAmount: data[2],
                    bidPoints: data[3]
                };
                datas.push(eventInfo);
            }
        }
    });

    provider.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: auctionContractAddress,
        topics: [topicRefund],
    }).then(logs => {
        for (let log of logs) {
            const data = ethers.AbiCoder.defaultAbiCoder().decode(["address", "uint8", "uint256", "uint256"], log.data);
            if (data[0] == walletAddress) {
                const eventInfo = {
                    eventType: "Refund",
                    address: data[0],
                    pointType: data[1],
                    bidAmount: data[2],
                    bidPoints: data[3]
                };
                datas.push(eventInfo);
            }
        }
    });

    console.debug("datas:", datas);
    return datas;
}


// console.log(config);
// export const result = await readContract(config, {
//     abi,
//     address: auctionContractAddress,
//     functionName: 'version',

// })

// 自定义钩子：读取合约数据
export function readAuctionContract(methodName, args) {
    return useReadContract({
        abi,
        address: auctionContractAddress,
        functionName: methodName,
        config: config,
        args: args,
    });
}


// 自定义钩子：写入合约数据
export function useWriteAuctionContract() {
    const writeAuctionContract = (methodName, args) => {
        const { writeContract } = useWriteContract();
        writeContract({
            abi,
            address: auctionContractAddress,
            functionName: methodName,
            args: [args]
        });
    }

    return { writeAuctionContract };
}

export function useSimulateAuctionContract() {

    const simulateAuctionContract = (methodName, args) => {
        useSimulateContract({
            abi,
            address: auctionContractAddress,
            functionName: methodName,
            args: [args],
            // gas: 100000n,
        });
    }

    return { simulateAuctionContract };
}

// utils/contractUtils.js

export async function approveToken(address: string) {
    if (address) {
        const { request } = await simulateContract(config, {
            abi: erc20Abi,
            address: ezETHContractAddress,
            functionName: 'approve',
            args: [auctionContractAddress, maxUint256],

        });

        const hash = await writeContract(config, request);
        console.log("Transaction hash: ", hash);

        const transactionReceipt = await waitForTransactionReceipt(config, { hash });
        console.log("Transaction receipt: ", transactionReceipt);
    }
}

export async function getAllowance(address: Address) {
    if (!address) return '0';
    const result = await readContract(config, {
        abi: erc20Abi,
        address: ezETHContractAddress,
        functionName: 'allowance',
        args: [address, auctionContractAddress],
    });

    return ethers.formatEther(result);
}


// export const




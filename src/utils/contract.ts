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
export const auctionContractAddress = '0x86A2EE8FAf9A840F7a2c64CA3d51209F9A02081D'
export const ezETHContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

import { EventInfo, EarningInfo } from '../types';
import { convertSecTsToDate } from '../utils/time';
import { fastPow } from './math'

import { formatEther, erc20Abi, maxUint256, etherUnits, maxUint8, Address, walletActions } from 'viem'
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'


export const provider = new ethers.JsonRpcProvider('http://10.227.60.68:8545/');
export const signer = await provider.getSigner();
export const contract = Controller__factory.connect(auctionContractAddress, signer);

const abi = Controller__factory.abi;
export const auctionABI = abi;

const topicCharged = ethers.id("Charge(address,uint8,uint256,uint256)");
const topicDeal = ethers.id("Deal(address,uint8,uint256,uint256)");
const topicRefund = ethers.id("Refund(address,uint8,uint256,uint256)");
const topicDividend = ethers.id("Dividend(uint256,uint256)");

export const getBlockTime = async (blockNumber: number) => {
    const block = await provider.getBlock(blockNumber);
    console.log("block +++++++++++:", block?.timestamp);
    if (!block) {
        return undefined;
    }
    return convertSecTsToDate(block.timestamp);
}

export const getApyHistory = async (walletAddress: Address) => {
    const logs = await provider.getLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: auctionContractAddress,
        topics: [topicDividend],
    });

    let datas: EarningInfo[] = [];
    let totalInterest = 0;

    for (let log of logs) {

        // const
        // walletAddress
        const balance = await getEzETHBalance(walletAddress, BigInt(log.blockNumber));
        const data = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], log.data);
        let apy = 0;
        let daylyInterest = 0;
        if (data[0] != 0) {
            //  计算利息
            const interest = Number(ethers.formatEther(data[0]));
            const totalAmount = Number(ethers.formatEther(data[1]));

            apy = fastPow((1 + interest / totalAmount), 365) - 1
            daylyInterest = balance * interest / totalAmount;
            totalInterest += daylyInterest;

            const date = await getBlockTime(log.blockNumber);
            if (date) {
                datas.push({ EarnAmount: daylyInterest, EarnTime: date });
            }
        }
    }
    return { totalInterest, datas }
}

export const getEzETHBalance = async (walletAddress: Address, blockNumber?: bigint) => {
    const tokenAddress = await readContract(config, {
        abi: auctionABI,
        address: auctionContractAddress,
        functionName: 'getLpToken',
    });

    const result = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'balanceOf',
        args: [walletAddress],
        blockNumber: blockNumber ?? undefined,
    });

    const convertRes = await readContract(config, {
        abi: auctionABI,
        address: auctionContractAddress,
        functionName: 'toMainToken',
        blockNumber: blockNumber ?? undefined,
        args: [result]
    });
    return Number(ethers.formatEther(convertRes));
}

export const getLogerWithWalletAddress = async (walletAddress: Address) => {
    let datas: (EventInfo)[] = [];

    const [chargedLogs, dealLogs, refundLogs] = await Promise.all([
        provider.getLogs({
            fromBlock: 0,
            toBlock: 'latest',
            address: auctionContractAddress,
            topics: [topicCharged],
        }),
        provider.getLogs({
            fromBlock: 0,
            toBlock: 'latest',
            address: auctionContractAddress,
            topics: [topicDeal],
        }),
        provider.getLogs({
            fromBlock: 0,
            toBlock: 'latest',
            address: auctionContractAddress,
            topics: [topicRefund],
        }),
    ]);

    for (let log of chargedLogs) {
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

    for (let log of dealLogs) {
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

    for (let log of refundLogs) {
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




import { ethers } from 'ethers'
import { Controller, Controller__factory, LPToken__factory } from '../api'

import {
    useReadContract,
    useWriteContract,
    useSimulateContract,
    useWatchContractEvent,
    useAccount
} from 'wagmi'

import {
    config, RpcProviderURL, AuctionContractAddress,
    EzETHContractAddress, TokenContractAddress
} from '../config'


import { EventInfo, EarningInfo, AuctionInfo } from '../types';
import { convertSecTsToDate } from '../utils/time';
import { fastPow, calculateAverage } from './math'

import { formatEther, erc20Abi, maxUint256, etherUnits, maxUint8, Address, walletActions, transactionType } from 'viem'
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'
import { getBlock } from 'viem/actions'
import { Result } from 'antd'
import { Profiler } from 'react'

import { IndexedDBHelper, BlockData } from '../utils/indexedDB';


const auctionContractAddress = AuctionContractAddress;
const ezETHContractAddress = EzETHContractAddress;
const tokenContractAddress = TokenContractAddress;

// export const provider = new ethers.JsonRpcProvider('http://10.227.60.68:8545/');
export const provider = new ethers.JsonRpcProvider(RpcProviderURL);

// init state
// const initialState = false;

// export function init() {
//     // initialState = true;
// }

// const accounts = await provider.listAccounts();
// console.log("accounts:", accounts);
// export const signer = new ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', provider);
// export const signer = await provider.getSigner("0x0519412438e900431c4260058726b25a56252883");
// export const contract = Controller__factory.connect(auctionContractAddress, signer);

const ctrl_abi = Controller__factory.abi;
export const auctionABI = ctrl_abi;

const lpt_abi = LPToken__factory.abi;
export const LPTokenABI = lpt_abi;

export const contract = new ethers.Contract(auctionContractAddress, ctrl_abi, provider);
export const ezContract = new ethers.Contract(ezETHContractAddress, erc20Abi, provider);
export const tokenContract = new ethers.Contract(tokenContractAddress, lpt_abi, provider);

const topicCharged = ethers.id("Charge(address,uint8,uint256,uint256)");
const topicDeal = ethers.id("Deal(address,uint8,uint256,uint256)");
const topicRefund = ethers.id("Refund(address,uint8,uint256,uint256)");
const topicDividend = ethers.id("Dividend(uint256,uint256)");

export const getBlockTime = async (blockNumber: number) => {
    const block = await provider.getBlock(blockNumber);
    if (!block) {
        return undefined;
    }
    return convertSecTsToDate(block.timestamp);
}

export const clearDB = async () => {
    const dbHelper = new IndexedDBHelper("BlockchainData", IndexedDBHelper.ApyHistory);

    dbHelper.open().then(() => {
        return dbHelper.clear();
    });
    const dbHelper1 = new IndexedDBHelper("BlockchainData", IndexedDBHelper.BidHistory);

    dbHelper1.open().then(() => {
        return dbHelper1.clear();
    });

    const dbHelper2 = new IndexedDBHelper("BlockchainData", IndexedDBHelper.DividendHistory);

    dbHelper2.open().then(() => {
        return dbHelper2.clear();
    });
}

const MinBlanace: number = 1e-6;

export const getApyHistory = async (walletAddress: Address) => {
    const dbHelper = new IndexedDBHelper("BlockchainData", IndexedDBHelper.ApyHistory);
    let lastDividendBlock = 0;
    let earningInfos: EarningInfo[] = [];

    try {
        await dbHelper.open();
        const datas: BlockData[] = await dbHelper.getAllData();
        if (datas.length !== 0) {
            lastDividendBlock = datas[datas.length - 1].blockNumber;
            for (const data of datas) {
                earningInfos.push({ EarnAmount: data.data[0] as number, EarnTime: data.data[1] as Date });
            }
        }
    } catch (error) {
        console.error("An error occurred during database operations:", error);
    }

    const logs = await provider.getLogs({
        fromBlock: lastDividendBlock + 1,
        toBlock: 'latest',
        address: auctionContractAddress,
        topics: [topicDividend],
    });

    let totalInterest = 0;

    for (let earningInfo of earningInfos) {
        totalInterest += earningInfo.EarnAmount;
    }

    for (let log of logs) {
        // const
        // walletAddress
        const balance = await getEzETHBalance(walletAddress, BigInt(log.blockNumber));
        if (balance <= MinBlanace) {
            continue;
        }
        const data = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], log.data);

        let daylyInterest = 0;
        if (data[0] != 0) {
            //  计算利息
            const interest = Number(ethers.formatEther(data[0]));
            const totalAmount = Number(ethers.formatEther(data[1]));

            daylyInterest = balance * interest / totalAmount;
            totalInterest += daylyInterest;

            const blockNumber = log.blockNumber;
            const date = await getBlockTime(blockNumber);
            if (!date) {
                console.error("getBlockTime error:", blockNumber);
                continue;
            }

            earningInfos.push({ EarnAmount: daylyInterest, EarnTime: date });
            try {
                await dbHelper.addData({ blockNumber, unionKeyPath: log.transactionHash, data: [daylyInterest, date] });
            } catch (error) {
                console.error("dbHelper addData error:", error, blockNumber, daylyInterest, date);
            }
        }
    }

    return { totalInterest, earningInfos }
}

export const getApr = async () => {
    const dbHelper = new IndexedDBHelper("BlockchainData", IndexedDBHelper.DividendHistory);
    let lastDividendBlock = 0;
    let rates: number[] = [];

    try {
        await dbHelper.open();
        const datas: BlockData[] = await dbHelper.getAllData();
        if (datas.length !== 0) {
            lastDividendBlock = datas[datas.length - 1].blockNumber;
            rates = datas[0].data as number[];
        }
    } catch (error) {
        console.error("An error occurred during database operations:", error);
    }

    // TODO(edxuanlen): To store the last pull index in the browser localstorage.
    const logs = await provider.getLogs({
        fromBlock: lastDividendBlock + 1,
        toBlock: 'latest',
        address: auctionContractAddress,
        topics: [topicDividend],
    });

    if (logs.length == 0) {
        return calculateAverage(rates) * 365
    }

    let i = logs.length - 7 >= 0 ? logs.length - 7 : 0;
    let lastBlockNumber = 0;
    for (; i < logs.length; i++) {
        const log = logs[i];
        const balance = await getContractEzETHBalance(BigInt(log.blockNumber));
        if (balance === 0n) {
            continue;
        }
        const data = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], log.data);
        if (data[0] != 0) {
            const interest = Number(ethers.formatEther(data[0]));
            const totalAmount = Number(ethers.formatEther(data[1]));
            rates.push(interest / totalAmount);
        }

        if (rates.length > 7) {
            rates.shift();
        }
        lastBlockNumber = log.blockNumber;
    }
    try {
        await dbHelper.clear();
        await dbHelper.addData({ blockNumber: lastBlockNumber, unionKeyPath: '', data: rates });
    } catch (error) {
        console.error("An error occurred during database operations:", error);
    }

    return calculateAverage(rates) * 365
}

export const getContractEzETHBalance = async (blockNumber: bigint) => {
    try {
        const Result = await ezContract.balanceOf(auctionContractAddress, { blockTag: blockNumber });

        return Result;
    } catch (error) {
        console.error(error);
        return 0n;
    }
}


export const getEzETHBalance = async (walletAddress: Address, blockNumber?: bigint) => {
    const balance = await tokenContract.balanceOf(walletAddress, { blockTag: blockNumber });

    const convertRes = await contract.toMainToken(balance, { blockTag: blockNumber });
    return Number(ethers.formatEther(convertRes));
}

export const getFreeEzETHBalance = async (walletAddress: Address) => {
    const balance = await tokenContract.freeBalanceOf(walletAddress);
    const convertRes = await contract.toMainToken(balance);
    return Number(ethers.formatEther(convertRes));
};

export const getLogerWithWalletAddress = async (walletAddress: Address) => {
    let bidHistory: (EventInfo)[] = [];
    const dbHelper = new IndexedDBHelper("BlockchainData", IndexedDBHelper.BidHistory);
    let lastDividendBlock = 0;
    try {
        await dbHelper.open();
        const datas: BlockData[] = await dbHelper.getAllData();
        if (datas.length !== 0) {
            lastDividendBlock = datas[datas.length - 1].blockNumber;
            for (const data of datas) {
                bidHistory.push(data.data[0] as EventInfo);
            }
        }
    } catch (error) {
        console.error("An error occurred during database operations:", error);
    }

    // TODO(edxuanlen): To store the logs in the browser localstorage.
    const [chargedLogs, dealLogs, refundLogs] = await Promise.all([
        provider.getLogs({
            fromBlock: lastDividendBlock + 1,
            toBlock: 'latest',
            address: auctionContractAddress,
            topics: [topicCharged],
        }),
        provider.getLogs({
            fromBlock: lastDividendBlock + 1,
            toBlock: 'latest',
            address: auctionContractAddress,
            topics: [topicDeal],
        }),
        provider.getLogs({
            fromBlock: lastDividendBlock + 1,
            toBlock: 'latest',
            address: auctionContractAddress,
            topics: [topicRefund],
        }),
    ]);

    for (let log of chargedLogs) {
        const data = ethers.AbiCoder.defaultAbiCoder().decode(["address", "uint8", "uint256", "uint256"], log.data);
        if (data[0] == walletAddress) {
            const blockTime = await getBlockTime(log.blockNumber);
            const eventInfo = {
                eventType: "Charge",
                address: data[0],
                pointType: data[1],
                bidPrice: data[2],
                bidPoints: data[3],
                transactionTime: blockTime
            };
            bidHistory.push(eventInfo);
            dbHelper.addData({ blockNumber: log.blockNumber, unionKeyPath: log.index + (log.transactionIndex.toString()), data: [eventInfo] });
        }

    }

    for (let log of dealLogs) {
        const data = ethers.AbiCoder.defaultAbiCoder().decode(["address", "uint8", "uint256", "uint256"], log.data);
        if (data[0] == walletAddress) {
            const blockTime = await getBlockTime(log.blockNumber);
            const eventInfo = {
                eventType: "Deal",
                address: data[0],
                pointType: data[1],
                bidPrice: data[2],
                bidPoints: data[3],
                transactionTime: blockTime
            };
            bidHistory.push(eventInfo);
            dbHelper.addData({ blockNumber: log.blockNumber, unionKeyPath: log.index + (log.transactionIndex.toString()), data: [eventInfo] });
        }
    }

    for (let log of refundLogs) {
        const data = ethers.AbiCoder.defaultAbiCoder().decode(["address", "uint8", "uint256", "uint256"], log.data);
        if (data[0] == walletAddress) {
            const blockTime = await getBlockTime(log.blockNumber);
            const eventInfo = {
                eventType: "Refund",
                address: data[0],
                pointType: data[1],
                bidPrice: data[2],
                bidPoints: data[3],
                transactionTime: blockTime
            };
            bidHistory.push(eventInfo);
            dbHelper.addData({ blockNumber: log.blockNumber, unionKeyPath: log.index + (log.transactionIndex.toString()), data: [eventInfo] });
        }
    }

    bidHistory.sort((a, b) => {
        const timeA = a.transactionTime ?? 0;
        const timeB = b.transactionTime ?? 0;
        return timeA < timeB ? -1 : timeA > timeB ? 1 : 0;
    });

    return bidHistory;
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
        abi: ctrl_abi,
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
            abi: ctrl_abi,
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
            abi: ctrl_abi,
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

export async function createAuction(auction: AuctionInfo) {

    const p_current = await readContract(config, {
        abi: auctionABI,
        address: auctionContractAddress,
        functionName: 'getCurrentPoints',
        args: [auction.pointsType],
    });
    const p_sold = await readContract(config, {
        abi: auctionABI,
        address: auctionContractAddress,
        functionName: 'getSoldPoints',
        args: [auction.pointsType],
    });
    const points = p_current - p_sold;
    const ts = BigInt(Math.floor(auction.startTime.getTime() / 1000));
    const duration = BigInt(Math.floor(auction.endTime.getTime() / 1000)) - ts;
    const { request } = await simulateContract(config, {
        abi: auctionABI,
        address: auctionContractAddress,
        functionName: 'createAuction',
        args: [[auction.pointsType], [
            {
                startTime: ts,
                duration: duration,
                targetPoints: points,
                pointsToSell: points,
                startingPrice: ethers.parseEther(auction.startingBid.toString()),
                state: 1
            }
        ]],

    });

    const hash = await writeContract(config, request);
    console.log("Transaction hash: ", hash);

    const transactionReceipt = await waitForTransactionReceipt(config, { hash });
    console.log("Transaction receipt: ", transactionReceipt);

    return transactionReceipt
}

export async function getTVL() {
    const tvl = await readContract(config, {
        abi: erc20Abi,
        address: ezETHContractAddress,
        functionName: 'balanceOf',
        args: [auctionContractAddress],
    });
    return Number(ethers.formatEther(tvl));
}

// export const




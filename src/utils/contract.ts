import { ethers } from 'ethers'
import { Controller, Controller__factory } from '../api'

import {
    useReadContract,
    useWriteContract,
    useSimulateContract
} from 'wagmi'
import { readContract } from '@wagmi/core'

import { config } from '../config'
export const auctionContractAddress = '0x4826533B4897376654Bb4d4AD88B7faFD0C98528'
export const ezETHContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// export const controller = Controller
// const contract = useContract({
//     addressOrName: auctionContractAddress,
//     contractInterface: Controller__factory.abi,
//     signerOrProvider: Controller__factory. || provider,
// })
import { ethers } from 'ethers';
import { ControllerInterface } from '../api/Controller';


export const provider = new ethers.JsonRpcProvider('http://10.227.60.68:8545/');
export const signer = await provider.getSigner();
export const contract = Controller__factory.connect(auctionContractAddress, signer);

const abi = Controller__factory.abi;
export const auctionABI = abi;
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


// export const




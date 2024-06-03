import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useBalance } from 'wagmi';
import { BigNumber } from 'ethers';
import { formatEther, erc20Abi, maxUint256, etherUnits, maxUint8, Address } from 'viem'

import { ethers } from 'ethers';
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'

import { EzETHContractAddress, config } from '../config';


// 自定义钩子，返回余额
export const getezETHBalance = (): {
    balance: {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
    } | undefined;
    isFetching: boolean;
    error: Error | null;
} => {
    const { address } = useAccount();
    const { data: balance, isLoading, isPending, isError } = useBalance({
        address: address,
        // chainId: mainnet.id,
        token: EzETHContractAddress,
    });

    // console.log("balance", balance);

    const error = isError ? new Error('Error fetching balance') : null;

    return {
        balance,
        isFetching: isLoading,
        error,
    };
};


export async function getWalletBalance(address: Address) {
    if (address == undefined) {
        return 0;
    }
    const result = await readContract(config, {
        abi: erc20Abi,
        address: EzETHContractAddress,
        functionName: 'balanceOf',
        args: [address]
    });

    return Number(ethers.formatEther(result))
}

export const flushWalletBalance = async (address: Address,
    setezETHBalance: (balance: number) => void) => {
    if (address == undefined) {
        return;
    } else {
        const result = await getWalletBalance(address);

        setezETHBalance(result);
    }
};

import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useBalance } from 'wagmi';
import { BigNumber } from 'ethers';
import { ezETHContractAddress } from './contract';

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
        token: ezETHContractAddress,
    });

    // console.log("balance", balance);

    const error = isError ? new Error('Error fetching balance') : null;

    return {
        balance,
        isFetching: isLoading,
        error,
    };
};

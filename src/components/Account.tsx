import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useBalance } from 'wagmi';
import { BigNumber } from 'ethers';
import { EzETHContractAddress } from '../config';


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

export function Account() {
    const { address, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
    const { data: balance, isLoading, isPending, error } = useBalance({
        address: address,
    });

    const formattedAddress = formatAddress(address);

    return (
        <div className="row">
            <div className="inline">
                {ensAvatar ? (
                    <img alt="ENS Avatar" className="avatar" src={ensAvatar} />
                ) : (
                    <div className="avatar" />
                )}
                <div className="stack">
                    {address && (
                        <div className="text">
                            {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
                        </div>
                    )}
                    <div className="subtext">
                        Connected to {connector?.name} Connector
                    </div>
                </div>
            </div>
            <button className="button" onClick={() => disconnect()} type="button">
                Disconnect
            </button>
            <div>
                <h2>Wallet Assets</h2>
                <p>Address: {address}</p>
                <p>Balance: {balance?.formatted} {balance?.symbol}</p>
            </div>
        </div>
    );
}

function formatAddress(address?: string) {
    if (!address) return null;
    return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}

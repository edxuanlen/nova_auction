// import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

const WalletDisplay = () => {
    const { address, isConnected } = useAccount();
    const { data: balance, isLoading } = useBalance({
        // addressOrName: address,
    });

    return (
        <div>
            {isConnected ? (
                <div>
                    <p>Connected Wallet: {address}</p>
                    {isLoading ? (
                        <p>Loading balance...</p>
                    ) : (
                        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
                    )}
                </div>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
};

export default WalletDisplay;


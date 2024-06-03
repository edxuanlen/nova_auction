import { ConnectButton, Connector } from '@ant-design/web3';
import { EthereumCircleColorful } from '@ant-design/web3-icons';
import {
    // Localhost,
    MetaMask,
    WagmiWeb3ConfigProvider,
    WalletConnect,
    UniversalWallet,
    TokenPocket,
    OkxWallet,
    CoinbaseWallet,
    SafeheronWallet
} from '@ant-design/web3-wagmi';

import { config } from '../config';
import { foundry, polygon, mainnet, localhost, arbitrumSepolia, arbitrum } from 'wagmi/chains';
import { QueryClient } from '@tanstack/react-query';


const App: React.FC = () => {
    const queryClient = new QueryClient();
    return (
        <WagmiWeb3ConfigProvider
            // eip6963={{
            //     autoAddInjectedWallets: true,
            // }}
            queryClient={queryClient}
            wallets={[
                TokenPocket({
                    group: 'More',
                }),
                MetaMask({
                    group: 'Popular',
                }),
                OkxWallet({
                    group: 'Popular',
                }),
                WalletConnect({
                    group: 'More'
                }),
                // CoinbaseWallet({
                //     group: 'Popular'
                // }),
            ]}
            chains={import.meta.env.VITE_ENVIRONMENT === 'sepolia' ? [arbitrumSepolia] : [arbitrum]}
            config={config}

        >
            <Connector>
                <ConnectButton style={{ marginRight: '12%', color: '#000000', background: '#4caf50' }} />
            </Connector>
        </WagmiWeb3ConfigProvider>
    );
};

export default App;

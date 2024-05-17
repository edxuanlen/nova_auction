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


const App: React.FC = () => {
    return (
        <WagmiWeb3ConfigProvider
            eip6963={{
                autoAddInjectedWallets: true,
            }}
            wallets={[
                // new UniversalWallet({
                //     name: 'TestWallet',
                //     remark: 'My TestWallet',
                //     icon: <EthereumCircleColorful />,
                //     extensions: [],
                //     group: 'More',
                // }),
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
                    group: 'More',
                }),
                CoinbaseWallet({
                    group: 'Popular',
                }),
                SafeheronWallet({
                    group: 'More',
                }),
            ]}
            chains={import.meta.env.VITE_ENVIRONMENT === 'depolia' ? [arbitrumSepolia] : [arbitrum]}
            config={config}
        >
            <Connector>
                <ConnectButton style={{ marginRight: '12%', color: '#000000', background: '#4caf50' }} />
            </Connector>
        </WagmiWeb3ConfigProvider>
    );
};

export default App;

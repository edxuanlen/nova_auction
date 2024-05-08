import { ConnectButton, Connector } from '@ant-design/web3';
import { EthereumCircleColorful } from '@ant-design/web3-icons';
import {
    // Localhost,
    MetaMask,
    Polygon,
    WagmiWeb3ConfigProvider,
    WalletConnect,
    UniversalWallet,
    TokenPocket,
    OkxWallet,
    X1Testnet,
} from '@ant-design/web3-wagmi';

import { config } from '../config';
import { foundry, polygon, mainnet, localhost } from 'wagmi/chains';


const App: React.FC = () => {
    return (
        <WagmiWeb3ConfigProvider
            eip6963={{
                autoAddInjectedWallets: true,
            }}
            wallets={[
                new UniversalWallet({
                    name: 'TestWallet',
                    remark: 'My TestWallet',
                    icon: <EthereumCircleColorful />,
                    extensions: [],
                    group: 'More',
                }),
                TokenPocket({
                    group: 'More',
                }),
                MetaMask({
                    group: 'Popular',
                }),
                OkxWallet({
                    group: 'Popular',
                }),
            ]}
            chains={[foundry]}
            config={config}
        // // 打开可以选择链，但目前自动给切链了，先关了
        >
            <Connector>
                <ConnectButton style={{ marginRight: '12%', color: '#000000', background: '#4caf50' }} />
            </Connector>
        </WagmiWeb3ConfigProvider>
    );
};

export default App;

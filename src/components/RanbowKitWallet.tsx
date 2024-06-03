import '@rainbow-me/rainbowkit/styles.css';
import {
    ConnectButton,
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { config } from '../config';


const queryClient = new QueryClient();
const App = () => {
    return (
        <ConnectButton
            label="Connect Wallet"
            showBalance={false}
            accountStatus="address"
            chainStatus="name"

        />
    );
};

export default App;

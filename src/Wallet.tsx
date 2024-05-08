import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config';

import { ConnectWallet } from './components/ConnectWallet';
import { SendTransaction } from './components/SendTransaction';
import { NetworkSwitcher } from './components/SwitchChain';
import { Connect, WalletOptions } from './components/Connect';
import AntWallet from './components/AntConnect';

const queryClient = new QueryClient();

export const Wallet = () => {

  return (
    // <WagmiProvider config={config}>
    //   <QueryClientProvider client={queryClient}>
    <ConnectWallet />
    //   </QueryClientProvider>
    // </WagmiProvider>
  );

}


export const WalletOptionsButton = () => {
  return (
    <AntWallet />
  );
}

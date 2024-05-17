import { ConnectWallet } from './components/ConnectWallet';
import AntWallet from './components/AntConnect';

export const Wallet = () => {
  return (
    <ConnectWallet />
  );
}

export const WalletOptionsButton = () => {
  return (
    <AntWallet />
  );
}

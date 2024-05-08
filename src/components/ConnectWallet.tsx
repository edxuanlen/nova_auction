import { useAccount } from 'wagmi';

import { Account } from './Account';
import { Connect, WalletOptions } from './Connect';

export function ConnectWallet() {
  const { isConnected } = useAccount();


  return (
    console.log(isConnected),
    <div className="container" > {isConnected ? <Account /> : <WalletOptions />}</div >
  );
}

import { useNetwork } from 'wagmi';
import { contractNetwork } from 'path/to/your/contractInfo';

const CheckNetwork = () => {
    const { chain } = useNetwork();

    const isNetworkMatch = chain?.id === contractNetwork.chainId;

    if (!isNetworkMatch) {
        console.error('Wallet network does not match the contract network.');
    }

    return (
        <div>
            {isNetworkMatch
                ? 'Wallet network and contract network are the same.'
                : 'Wallet network and contract network do not match.'}
        </div>
    );
};

export default CheckNetwork;
``

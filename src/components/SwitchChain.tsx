import { useSwitchChain, useChains, useChainId } from 'wagmi';

export const NetworkSwitcher = () => {
    // const chains = useChains();
    // const chainId = useChainId()

    // console.log(chains);
    // console.log(chainId);

    const { chains, switchChain } = useSwitchChain()

    // console.log(chains);
    // console.log(switchChain);


    return (
        <div>
            {chains.map((chain) => (
                <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
                    {chain.name}
                </button>
            ))}
        </div>
    );
};

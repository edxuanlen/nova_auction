import { useNetwork } from 'wagmi';
import { contractNetwork } from 'path/to/your/contractInfo'; // 假设这是你的合约网络信息

const CheckNetwork = () => {
    const { chain } = useNetwork();

    // 检查用户钱包网络和合约网络是否一致
    const isNetworkMatch = chain?.id === contractNetwork.chainId;

    if (!isNetworkMatch) {
        // 如果网络不一致，可以执行相应的逻辑，例如显示错误信息等
        console.error('Wallet network does not match the contract network.');
    }

    // 根据 isNetworkMatch 的值来渲染不同的 UI 或执行其他逻辑
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

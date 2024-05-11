import { http, createConfig } from 'wagmi'
import { hardhat, localhost, mainnet, polygon, foundry, type Chain, x1Testnet } from 'wagmi/chains';
import { injected, safe, walletConnect, coinbaseWallet } from 'wagmi/connectors'
// import { MetaMaskConnector } from 'wagmi/connectors';
// import { X1Testnet } from '@ant-design/web3-wagmi';
const projectId = 'bccf3efae40ada68c973e1623e1b448a'


// export const x1Testnet: Chain = {
//     id: X1Testnet.id,
//     name: X1Testnet.name,
//     nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
//     rpcUrls: {
//         default: {
//             http: ['https://testrpc.x1.tech'],
//         },
//     },
//     blockExplorers: {
//         default: {
//             name: 'X1TestnetScan',
//             url: 'https://www.okx.com/explorer/x1-test',
//         },
//     },
// };

export const ADMIN_ADDRESS = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase(),
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'.toLowerCase(),
]; // 配置的管理员地址

export const config = createConfig({
    chains: [foundry],
    transports: {
        // [mainnet.id]: http(),
        // [polygon.id]: http(),
        // [x1Testnet.id]: http(),
        // [foundry.id]: http('http://127.0.0.1:8545/'),
        [foundry.id]: http('http://10.227.60.68:8545/'),
        // [hardhat.id]: http(),
        // [localhost.id]: http(),
        // []
    },
    connectors: [
        injected({
            target: 'metaMask',
        }),
        walletConnect({
            showQrModal: false,
            projectId: projectId,
        }),
        injected({
            target: 'tokenPocket',
        }),
        injected({
            target() {
                return {
                    id: 'testWallet',
                    name: 'TestWallet',
                    provider: window.ethereum,
                };
            },
        }),
    ],
});

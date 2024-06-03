import { QRCode } from 'antd';
import { http, createConfig } from 'wagmi'
import { hardhat, localhost, mainnet, polygon, foundry, type Chain, arbitrumSepolia, arbitrum } from 'wagmi/chains';
// import { injected, safe, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import {
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    okxWallet
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const adminAddresses = import.meta.env.VITE_ADMIN_ADDRESS;
export const ADMIN_ADDRESS = adminAddresses.split(',').map((address: string) => address.toLowerCase());

export const RpcProviderURL = import.meta.env.VITE_RPC_PROVIDER;

export const AuctionContractAddress = import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS;
export const EzETHContractAddress = import.meta.env.VITE_EZETH_CONTRACT_ADDRESS;
export const TokenContractAddress = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;

const connectors = connectorsForWallets(
    [
        // { groupName: 'Installed', wallets: [] },
        {
            groupName: 'Popular',
            wallets: [
                metaMaskWallet,
                okxWallet,
                coinbaseWallet,
            ],
        }, {
            groupName: 'More',
            wallets: [
                rainbowWallet,
                metaMaskWallet,
                coinbaseWallet,
                walletConnectWallet,
            ],
        }
    ],
    {
        appName: 'Nova Auction',
        projectId: projectId,
        walletConnectParameters: {

        },
    },
);


export const config = createConfig({
    connectors,
    chains: import.meta.env.VITE_ENVIRONMENT === 'sepolia' ? [arbitrumSepolia] : [arbitrum],
    transports:
    {
        // [mainnet.id]: http(),
        [arbitrumSepolia.id]: http(),
        [arbitrum.id]: http(),
        // [foundry.id]: http('http://10.227.60.68:8545/'),
    },
    // connectors: [
    //     injected({
    //         target: 'metaMask',
    //     }),
    //     injected({
    //         target: 'tokenPocket',
    //     }),
    //     // injected({
    //     //     target: 'coinbaseWallet',
    //     // }),
    //     injected({
    //         target: 'okxWallet',
    //     }),
    //     walletConnect({
    //         showQrModal: false,
    //         projectId: projectId,
    //     }),
    //     coinbaseWallet({
    //         appName: 'NovaAuction',
    //         jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/2585adc3-9dc4-468a-badf-0b305676cbfa`,
    //     }),
    // ],
});

import { defineChain } from '../../utils/chain/defineChain.js'

export const testChain = /*#__PURE__*/ defineChain({
    id: 31_337,
    name: 'Foundry',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['http://10.227.60.68:8545'],
            webSocket: ['ws://10.227.60.68:8545'],
        },
    },
})

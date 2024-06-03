import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import { config } from './config.ts'

import './css/index.css'
import NovaPage from './Nova.tsx'
import BackendPage from './pages/BackendPage.tsx'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

import { BrowserRouter as Router } from 'react-router-dom';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { arbitrum, arbitrumSepolia } from 'viem/chains'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <WagmiProvider config={config}  >
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider

            // coolMode
            locale='en'
            initialChain={
              import.meta.env.VITE_ENVIRONMENT === 'sepolia' ? arbitrumSepolia : arbitrum}
          >
            <NovaPage />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  </React.StrictMode>,
)

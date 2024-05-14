import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import { config } from './config.ts'

import './css/index.css'
import AuctionPage from './Auction.tsx'
import BackendPage from './pages/BackendPage.tsx'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuctionPage />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>,
  },
  {
    path: "/admin",
    element: <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <BackendPage />
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>,
  },
]);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuctionPage />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)

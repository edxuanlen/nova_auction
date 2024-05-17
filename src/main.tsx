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

import { BrowserRouter as Router, Route, Link, Routes, Navigate, useNavigate } from 'react-router-dom';

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
          <NovaPage />
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
    <Router>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <NovaPage />
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  </React.StrictMode>,
)

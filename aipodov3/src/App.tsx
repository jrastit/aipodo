import './App.css'

import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react'

import {WagmiConfig} from 'wagmi'
import {goerli, mainnet, polygon, polygonMumbai, scrollSepolia, scrollTestnet} from 'wagmi/chains'
import ConnectButton from "./ConnectButton";
import Dataset from "./dataset/Dataset";

// 1. Get projectId
const projectId = 'adad6ddb068edeb3c80dccb1bf3e4673'

// 2. Create wagmiConfig
const chains = [mainnet, goerli, polygon, polygonMumbai, scrollSepolia, scrollTestnet]
const wagmiConfig = defaultWagmiConfig({chains, projectId, appName: 'Web3Modal'})

// 3. Create modal
createWeb3Modal({wagmiConfig, projectId, chains})

function App() {
    return (
        <WagmiConfig config={wagmiConfig}>
            <img src="/logo.jpg"/>
            <ConnectButton/>
            <Dataset/>
        </WagmiConfig>
    )
}

export default App

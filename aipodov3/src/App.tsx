import './App.css'

import {createWeb3Modal} from '@web3modal/wagmi/react'
import {walletConnectProvider} from '@web3modal/wagmi'
import {publicProvider} from 'wagmi/providers/public'

import {configureChains, createConfig, WagmiConfig} from 'wagmi'
import {goerli, mainnet, polygon, polygonMumbai, scrollSepolia, scrollTestnet} from 'wagmi/chains'
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet'
import {InjectedConnector} from 'wagmi/connectors/injected'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'
import ConnectButton from "./ConnectButton";
import Dataset from "./dataset/Dataset";

// 1. Get projectId
const projectId = 'adad6ddb068edeb3c80dccb1bf3e4673'

// 2. Create wagmiConfig
const {chains, publicClient} = configureChains(
    [mainnet, goerli, polygon, polygonMumbai, scrollSepolia, scrollTestnet],
    [walletConnectProvider({projectId}), publicProvider()]
)

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({options: {projectId, showQrModal: false}}),
        new InjectedConnector({options: {shimDisconnect: true}}),
        new CoinbaseWalletConnector({options: {appName: 'Web3Modal'}})
    ],
    publicClient
})

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

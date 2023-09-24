import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react'
import {WagmiConfig} from 'wagmi'
import {goerli, mainnet, polygon, polygonMumbai, scrollSepolia, scrollTestnet} from 'wagmi/chains'
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
            <div style={{
                display: "flex",
                flexDirection: 'column',
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: "space-between",
                }}>
                    <img src="/logo.jpg"/>
                    <span style={{
                        padding: '20px 10px'
                    }}>
                            <w3m-button/>
                        </span>
                </div>
                <div>
                    <Dataset/>
                </div>
            </div>

        </WagmiConfig>
    )
}

export default App

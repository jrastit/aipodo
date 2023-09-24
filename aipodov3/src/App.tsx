import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react'
import {WagmiConfig} from 'wagmi'
import {goerli, mainnet, polygon, polygonMumbai, scrollSepolia, scrollTestnet, celoAlfajores} from 'wagmi/chains'
import DatasetCreate from "./dataset/DatasetCreate.tsx";
import GateFi from './gatefi/Gatefi'
import Worldcoin from './service/Wordcoin';
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from "@apollo/client";
import DatasetList from "./dataset/DatasetList.tsx";


// 1. Get projectId
const projectId = 'adad6ddb068edeb3c80dccb1bf3e4673'

// 2. Create wagmiConfig
const chains = [mainnet, goerli, polygon, polygonMumbai, scrollSepolia, scrollTestnet, celoAlfajores]
const wagmiConfig = defaultWagmiConfig({chains, projectId, appName: 'Web3Modal'})

// 3. Create modal
createWeb3Modal({wagmiConfig, projectId, chains})

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: (operation) => operation.variables['__chainUrl'],
    }),
});

function App() {
    return (
        <ApolloProvider client={apolloClient}>
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
                             <GateFi/>
                            
                        </span>
                        <span style={{
                            padding: '20px 10px'
                        }}>
                            <w3m-button/>
                        </span>

                    </div>
                    <div>
                        <DatasetList/>
                        <p/>
                        <DatasetCreate/>
                        <Worldcoin/>
                    </div>
                </div>
            </WagmiConfig>
        </ApolloProvider>
    )
}

export default App

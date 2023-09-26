import {createWeb3Modal, defaultWagmiConfig} from '@web3modal/wagmi/react'
import {WagmiConfig} from 'wagmi'
import {goerli, mainnet, scrollSepolia, celoAlfajores} from 'wagmi/chains'
import DatasetCreate from "./dataset/DatasetCreate.tsx";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from "@apollo/client";
import DatasetList from "./dataset/DatasetList.tsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

// 1. Get projectId
const projectId = 'adad6ddb068edeb3c80dccb1bf3e4673'

// 2. Create wagmiConfig
const chains = [mainnet, goerli, scrollSepolia, celoAlfajores]
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
    <Container>
        
        <ApolloProvider client={apolloClient}>
            <WagmiConfig config={wagmiConfig}>
            <Navbar bg="light" className="justify-content-end">
                <Container>
                    <Navbar.Brand href="#home"><img src="/logo.jpg"/></Navbar.Brand>
                    <Navbar.Text className='justify-content-end'><w3m-button/></Navbar.Text>        
                </Container>            
            </Navbar>    
            
            <Row>
            <Col xs='6'>
                
            </Col>
            </Row>
            <Row>
                <Col>
                    <DatasetList/>
                </Col>
                <Col>
                    <DatasetCreate/>
                </Col>
            </Row>
            </WagmiConfig>
        </ApolloProvider>
    </Container>
    )
}

export default App

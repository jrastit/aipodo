import {FunctionComponent, useEffect} from "react";
import gql from 'graphql-tag';
import Loader from "./components/Loader.tsx";
import {useQuery} from "@apollo/client";
import {SAccountsContainer, SContent} from "./components/app";
import styled from "styled-components";
import {useAccount, useNetwork} from "wagmi";
import Address from "./components/Address.tsx";
import Hash from "./components/Hash.tsx";
import {Table} from "react-bootstrap"

const SBorder = styled.div`
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  border: 2px solid #00ff99;
  box-shadow: 0 0 8px #00ff99;
`;

const datasetQuery = gql`
{
    itemCreateds(first: 100) {
        id
        hash
        full_price
        parents
        owner
    }
}
`;

interface ItemCreated {
    id: string,
    hash: string,
    parents: string[],
    full_price: string,
    owner: string,
}

const urlPerChain: Record<string, string> = {
    '5': 'https://api.studio.thegraph.com/query/53641/aipodo-goerli-2/version/latest', // goerli
    '534351': 'https://api.studio.thegraph.com/query/53641/aipodo-scroll-sepolia/version/latest', // Scroll Sepolia
    '44787': 'https://api.studio.thegraph.com/query/53641/aipodo-cello-alfajores/version/latest', // Cello Alfaro
};

const formatHash = (h: string) => BigInt(h).toString(16).padStart(40, '0');

const DatasetList: FunctionComponent = () => {
    const {address} = useAccount();
    const {chain} = useNetwork();

    const {data, loading, error, refetch, networkStatus} = useQuery<{ itemCreateds: ItemCreated[] }>(datasetQuery, {
        variables: {
            __chainUrl: urlPerChain[chain?.id ?? 'pouet'],
        },
        skip: !chain?.id,
        notifyOnNetworkStatusChange: true,
    });
    useEffect(() => {
            if (chain?.id) {
                refetch()
            }
        },
        [chain?.id]
    )

    const innerContent = () => {
        if (!chain?.id) {
            return 'Not connected';
        } else if (loading || networkStatus !== 7) {
            return <Loader/>;
        } else if (data) {
            return (
                <>
                    <Table striped bordered hover align="right">
                      <thead>
                        <tr>
                            <th>Git commit hash</th>
                            <th>Parents</th>
                            <th>Price</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.itemCreateds.map(({id, hash, parents, full_price, owner}) => {
                            console.log({owner, address});
                            return (
                                <tr key={id}>
                                    <td><Hash hash={formatHash(hash)}/></td>
                                    <td>{parents.map((p) => (<><Hash hash={formatHash(p)}/><br/></>))}</td>
                                    <td>{full_price}</td>
                                    <td>{owner?.toLowerCase() === address?.toLowerCase() ? 'You' : <Address address={owner}/>} </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                    <br/>
                    <button onClick={() => refetch()}>Refresh</button>
                </>
            );
        } else {
            return <div>{`Error occurred: ${error}`}</div>;
        }
    }

    return (
        <SContent>
            <SBorder>
                <SAccountsContainer>
                    <h3>Available dataset</h3>
                    {innerContent()}
                </SAccountsContainer>
            </SBorder>
        </SContent>
    );

};

export default DatasetList;

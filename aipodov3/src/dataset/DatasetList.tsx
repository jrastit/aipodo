import {FunctionComponent, useEffect} from "react";
import gql from 'graphql-tag';
import Loader from "./components/Loader.tsx";
import {useQuery} from "@apollo/client";
import {SAccountsContainer, SContent} from "./components/app";
import styled from "styled-components";
import {useAccount, useNetwork} from "wagmi";

const SBorder = styled.div`
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  border: 2px solid red;
  box-shadow: 0 0 8px red;
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
    '80001': 'xxx', // Polygon Mumbai
    '5': 'https://api.studio.thegraph.com/query/53641/aipodo-goerli-2/version/latest', // goerli
    '534351': 'https://api.studio.thegraph.com/query/53641/aipodo-scroll-sepolia/version/latest', // Scroll Sepolia
    '44787': 'https://api.studio.thegraph.com/query/53641/aipodo-cello-alfajores/version/latest', // Cello Alfaro
};

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
                    <table border={1}>
                        <tbody>
                        <tr>
                            <th>Git commit hash</th>
                            <th>Parents</th>
                            <th>Price</th>
                            <th>Owner</th>
                        </tr>
                        {data.itemCreateds.map(({id, hash, parents, full_price, owner}) => (
                            <tr key={id}>
                                <td>{hash}</td>
                                <td>{parents.map((p) => (<>{p}<br/></>))}</td>
                                <td>{full_price}</td>
                                <td>{owner === address ? 'You' : owner}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={() => refetch()}>Refresh</button>
                </>
            );
        } else {
            return <div>{`Error occurred: ${error}`}</div>;
        }
    }

    return (
        <SContent>
            <SAccountsContainer>
                <h3>Available dataset</h3>
                <SBorder>
                    {innerContent()}
                </SBorder>
            </SAccountsContainer>
        </SContent>
    );

};

export default DatasetList;

import React, {FunctionComponent, useState} from "react";
import Button from "../components/Button";
import {SAccountsContainer, SContent} from "../components/app";
import styled from "styled-components";
import Loader from "../components/Loader";
import {useJsonRpc} from "../contexts/JsonRpcContext";
import {useChainData} from "../contexts/ChainDataContext";
import {add_item} from "../contract/AipodoContract";

const SBorder = styled.div`
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  border: 2px solid red;
  box-shadow: 0 0 8px red;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: black;
`

export const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 23rem;
`

enum Steps {
    hashInput = 'hashInput',
    descriptorFetching = 'descriptorFetching',
    descriptorFetched = 'descriptorFetched',
}

const Dataset: FunctionComponent = () => {
    const [step, setStep] = useState(Steps.hashInput);

    const [commitHash, setCommitHash] = useState('');
    const [descriptor, setDescriptor] = useState('');
    const [price, setPrice] = useState('');

    const chainData = useChainData();

    const handleHashSubmit = async () => {
        if (step === Steps.hashInput) {
            const starting = Date.now();
            setStep(Steps.descriptorFetching);
            const result = await fetch(`https://api.github.com/search/commits?q=${commitHash}`);
            if (result.ok) {
                const parsedResult = await result.json();
                const repository = parsedResult.items[0].repository.full_name;
                const result2 = await fetch(`https://raw.githubusercontent.com/${repository}/${commitHash}/dapp/package.json`);
                if (result2.ok) {
                    const descriptor = await result2.json();
                    await new Promise((resolve) => setTimeout(resolve, Math.max(0, 500 + Date.now() - starting)));
                    setDescriptor(descriptor.name);
                    setStep(Steps.descriptorFetched);
                }
            }
        }
    };

    const handlePublish = async () => {
        if (step === Steps.descriptorFetched) {
            const rpcUrl = chainData.chainData['eip155']['80001'].rpc[0]; // Polygon Mumbai
            await add_item(rpcUrl, '0.0001', commitHash, Number.parseFloat(price), []);
        }
    };

    return (
        <SContent>
            <SAccountsContainer>
                <h3>Dataset</h3>
                <SBorder>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <StyledLabel>Dataset Git hash</StyledLabel>
                            </td>
                            <td>
                                <StyledInput type="text" value={commitHash}
                                             readOnly={step !== Steps.hashInput}
                                             onChange={e => setCommitHash(e.target.value)}
                                             onKeyUp={(e) => {
                                                 if (e.key === 'Enter') {
                                                     handleHashSubmit();
                                                 }
                                             }}/>
                            </td>
                        </tr>
                        {step === Steps.descriptorFetching && (
                            <tr>
                                <td colSpan={2}>
                                    <Loader/>
                                </td>
                            </tr>
                        )}
                        {step === Steps.descriptorFetched && (
                            <>
                                <tr>
                                    <td>
                                        <StyledLabel>Dataset descriptor</StyledLabel>
                                    </td>
                                    <td>
                                        {descriptor}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <StyledLabel>Dataset price</StyledLabel>
                                    </td>
                                    <td>
                                        <StyledInput type="text" value={price}
                                                     onChange={e => setPrice(e.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <Button onClick={handlePublish}>Publish dataset ownership</Button>
                                    </td>
                                </tr>
                            </>
                        )}
                        </tbody>
                    </table>
                </SBorder>
            </SAccountsContainer>
        </SContent>
    );
};

export default Dataset;
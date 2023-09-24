import {FunctionComponent, useState} from "react";
import Button from "./components/Button";
import {SAccountsContainer, SContent} from "./components/app";
import styled from "styled-components";
import Loader from "./components/Loader";
import {useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import AipodoContract from '../../../smartcontract/artifacts/Aipodo.json';


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
    publishing = 'publishing',
}

const Dataset: FunctionComponent = () => {
    const {isConnected} = useAccount();

    const [step, setStep] = useState<Steps>(Steps.hashInput);

    const [commitHash, setCommitHash] = useState('');
    const [descriptor, setDescriptor] = useState('');
    const [price, setPrice] = useState('');

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
        isLoading: isPrepareLoading,
    } = usePrepareContractWrite({
        address: '0x64B0d1d58947eAC33Ec6FC95A49c76408047043C',
        abi: AipodoContract.abi,
        functionName: 'add_item',
        args: [`0x${commitHash}`, price, []],
        enabled: step === Steps.descriptorFetched,
    })
    const {
        data,
        error,
        isLoading,
        isError,
        write,

    } = useContractWrite(config)

    const {
        isLoading: isWaitTxLoading,
        isSuccess,
    } = useWaitForTransaction({
        hash: data?.hash,
    });

    const handleHashSubmit = async () => {
        if (step === Steps.hashInput) {
            const starting = Date.now();
            setStep(Steps.descriptorFetching);
            const fakeHash = 'f7b0081d6bd0e009fd6f0a6a333fb2e7db30357a';
            const result = await fetch(`https://api.github.com/search/commits?q=${fakeHash ?? commitHash}`);
            if (result.ok) {
                const parsedResult = await result.json();
                const repository = parsedResult.items[0].repository.full_name;
                const result2 = await fetch(`https://raw.githubusercontent.com/${repository}/${fakeHash ?? commitHash}/dapp/package.json`);
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
            // TODO
            if (write) {
                console.log('publish');
                write();
                setStep(Steps.publishing);
            } else {
                console.log('cannot publish, write is undefined');
            }
        }
    };

    console.log({
        isPrepareLoading,
        isPrepareError,
        prepareError,
        data,
        isError,
        error,
        isLoading,
        isWaitTxLoading
    });

    return isConnected && (
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
                        {(step === Steps.descriptorFetched || step === Steps.publishing) && (
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
                                        {step !== Steps.publishing &&
                                            <Button onClick={handlePublish}>Publish dataset ownership</Button>}
                                        {(step === Steps.publishing && isLoading) && (
                                            <>
                                                <Loader/>
                                                <div>Publishing...</div>
                                            </>
                                        )}
                                        {(step === Steps.publishing && !isLoading && (isPrepareError || isError)) && (
                                            <div>Error: {prepareError ? prepareError.shortMessage : error?.message}</div>
                                        )}
                                        {(step === Steps.publishing && !isLoading && !(isPrepareError || isError)) && (
                                            <div>Dataset ownership published</div>
                                        )}
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
import {FunctionComponent, useState} from "react";
import Button from "./components/Button";
import {SAccountsContainer, SContent} from "./components/app";
import styled from "styled-components";
import Loader from "./components/Loader";
import {useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import AipodoContract from '../../../smartcontract/artifacts/Aipodo.json';


const SBorder = styled.div`
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  border: 2px solid #0066ff;
  box-shadow: 0 0 8px #0066ff;
`;

// ffcc00

const contractAddressPerChain: Record<string, `0x${string}`> = {
    '80001': '0xe68DD1328396bcf2A457C12c51eF2a977B828b83', // Polygon Mumbai
    '5': '0xE50b034766E1475E2FF586dA35381F1C2C9aB8EE', // goerli
    '534351': '0x92604A186DE35D9c1331596eE8d32c59f64A168F', // Scroll Sepolia
    '44787': '0xFD240b2a6Eb348F131Fb5C4d893eB5c8426B042c', // Cello Alfaro
};

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

const DatasetCreate: FunctionComponent = () => {
    const {isConnected} = useAccount();
    const {chain} = useNetwork();

    const [step, setStep] = useState<Steps>(Steps.hashInput);

    const [commitHash, setCommitHash] = useState('');
    const [parents, setParents] = useState<string[]>([]);
    const [price, setPrice] = useState('');

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
        isLoading: isPrepareLoading,
    } = usePrepareContractWrite({
        address: contractAddressPerChain[`${chain?.id}`],
        abi: AipodoContract.abi,
        functionName: 'add_item',
        args: [`0x${commitHash}`, price, []],
        enabled: step === Steps.descriptorFetched || step === Steps.publishing,
    })
    const {
        data,
        error,
        isLoading,
        isError,
        write,

    } = useContractWrite(config)

    const {
        isSuccess,
    } = useWaitForTransaction({
        hash: data?.hash,
    });

    const handleHashSubmit = async () => {
        if (step === Steps.hashInput) {
            const starting = Date.now();
            setStep(Steps.descriptorFetching);
            const fakeHash = undefined; // 7b0081d6bd0e009fd6f0a6a333fb2e7db30357a';
            const result = await fetch(`https://api.github.com/search/commits?q=${fakeHash ?? commitHash}`);
            if (result.ok) {
                const parsedResult = await result.json();
                const repository = parsedResult.items[0].repository.full_name;
                const result2 = await fetch(`https://raw.githubusercontent.com/${repository}/${fakeHash ?? commitHash}/aipodo.json`);
                if (result2.ok) {
                    const descriptor = await result2.json();
                    await new Promise((resolve) => setTimeout(resolve, Math.max(0, 500 + Date.now() - starting)));
                    setParents(descriptor.parents);
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

    return isConnected && (
        <SContent>
            <SBorder>
                <SAccountsContainer>
                    <h3>Publish Dataset ownership</h3>
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
                                        <StyledLabel>Dataset parents</StyledLabel>
                                    </td>
                                    <td>
                                        {parents.map((parent) => <>{parent}<br/></>)}
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
                                                <div>Publishing dataset ownership transaction...</div>
                                            </>
                                        )}
                                        {(step === Steps.publishing && !isLoading && (isPrepareError || isError)) && (
                                            <div>Error: {prepareError ? prepareError.shortMessage : error?.message}</div>
                                        )}
                                        {(step === Steps.publishing && !isLoading && !(isPrepareError || isError || isSuccess)) && (
                                            <>
                                                <Loader/>
                                                <div>Dataset ownership transaction validation...</div>
                                            </>
                                        )}
                                        {(step === Steps.publishing && !isLoading && isSuccess) && (
                                            <div>Dataset ownership transaction validated!</div>
                                        )}
                                    </td>
                                </tr>
                            </>
                        )}
                        </tbody>
                    </table>
                    <br/>
                    <button onClick={() => {
                        setStep(Steps.hashInput);
                        setCommitHash('');
                        setParents([]);
                        setPrice('');
                    }}>Reset
                    </button>
                </SAccountsContainer>
            </SBorder>
        </SContent>
    );
};

export default DatasetCreate;
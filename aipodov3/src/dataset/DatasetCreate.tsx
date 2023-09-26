import {FunctionComponent, useState} from "react";
import Button from "./components/Button";
import {SAccountsContainer, SContent} from "./components/app";
import styled from "styled-components";
import Loader from "./components/Loader";
import {useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import AipodoContract from '../../../smartcontract/artifacts/Aipodo.json';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';


const SBorder = styled.div`
  border-radius: 8px;
  padding: 8px;
  margin: 5px 0;
  border: 2px solid #0066ff;
  box-shadow: 0 0 8px #0066ff;
`;

// ffcc00

export const contractAddressPerChain: Record<string, `0x${string}`> = {
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

export enum Steps {
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
        isLoading: _isPrepareLoading,
    } = usePrepareContractWrite({
        address: contractAddressPerChain[`${chain?.id}`],
        abi: AipodoContract.abi,
        functionName: 'add_item',
        args: [`0x${commitHash}`, price, parents.map((p) => `0x${p}`)],
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
                    <Form>
                    <h3>Publish Dataset ownership</h3>
                    <Form.Group controlId="hash">
                        <Form.Label>Dataset Git hash</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Paste git full hash" 
                            value={commitHash}
                            readOnly={step !== Steps.hashInput}
                            onChange={e => setCommitHash(e.target.value)}
                            />
                        <Form.Text className="text-muted">
                            copy and paste the full git hash of the dataset you want to publish
                        </Form.Text>
                    </Form.Group>
                    <br/>
                    { step === Steps.hashInput && commitHash && (
                        <>
                        <Stack gap={2} className="col-md-5 mx-auto">
                            <Button onClick={handleHashSubmit}>Fetch github</Button>
                        </Stack>
                        <br/>
                        </>
                        )
                        }   
                    {step === Steps.descriptorFetching && (
                            <Loader/>
                        )}
                    {(step === Steps.descriptorFetched || step === Steps.publishing) && (
                            <>
                                <Form.Group controlId="parents">
                                    <Form.Label>Dataset parents Git hash</Form.Label>
                                        {parents.map((parent) => <>
                                            <Form.Control 
                                                type="text" 
                                                value={parent}
                                                readOnly={true}
                                            />
                                        </>)}
                                    <Form.Text className="text-muted">
                                        Parents loaded from github project aipodo.json
                                    </Form.Text>
                                </Form.Group>
                                <br/>
                                <Form.Group controlId="price">
                                    <Form.Label>Dataset price</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Give your dataset a price for your work" 
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                    <Form.Text className="text-muted">
                                        copy and paste the full git hash of the dataset you want to publish
                                    </Form.Text>
                                </Form.Group>
                                <br/>
                                <Stack gap={2} className="mx-auto">
                                        {step !== Steps.publishing &&
                                            <Button onClick={handlePublish}>Publish dataset ownership</Button>}
                                        {(step === Steps.publishing && isLoading) && (
                                            <>
                                                <Loader/>
                                                <div>Publishing dataset ownership transaction...</div>
                                            </>
                                        )}
                                        {(step === Steps.publishing && !isLoading && (isPrepareError || isError)) && (
                                            <div>Error: {prepareError ? (prepareError as any).shortMessage : error?.message}</div>
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
                                </Stack>
                            </>
                        )}
                    <br/>
                    <Stack gap={2} className="col-md-5 mx-auto">
                    <Button onClick={() => {
                        setStep(Steps.hashInput);
                        setCommitHash('');
                        setParents([]);
                        setPrice('');
                    }}>Reset</Button>
                    </Stack>
                    </Form>
                </SAccountsContainer>
            </SBorder>
        </SContent>
    );
};

export default DatasetCreate;
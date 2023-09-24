import { useState } from "react";
import { IDKitWidget, ISuccessResult, CredentialType } from "@worldcoin/idkit";
import {FunctionComponent} from "react";
import Button from "../dataset/components/Button";
import {useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import AipodoContract from '../../../smartcontract/artifacts/Aipodo.json';


enum Steps {
  hashProof = 'hashProof',
  descriptorFetching = 'descriptorFetching',
  descriptorFetched = 'descriptorFetched',
  publishing = 'publishing',
}

const contractAddressPerChain: Record<string, `0x${string}`> = {
  '80001': '0xe68DD1328396bcf2A457C12c51eF2a977B828b83', // Polygon Mumbai
  '5': '0xE50b034766E1475E2FF586dA35381F1C2C9aB8EE', // goerli
  '534351': '0x92604A186DE35D9c1331596eE8d32c59f64A168F', // Scroll Sepolia
  '44787': '0xFD240b2a6Eb348F131Fb5C4d893eB5c8426B042c', // Cello Alfaro
};

const Worldcoin: FunctionComponent = () => {

  const {chain} = useNetwork();

  const [proof, setProof] = useState<any | null>(null);

  const [step, setStep] = useState<Steps>(Steps.hashProof);


  const account = useAccount()

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPrepareLoading,
  } = usePrepareContractWrite({
    address: contractAddressPerChain[`${chain?.id}`],
    abi: AipodoContract.abi,
    functionName: 'add_proof',
    args: [proof],
    enabled: true
  })
  const {
    data,
    error,
    isLoading,
    isError,
    write,

  } = useContractWrite(config)

  const handlePublish = async () => {
    
        if (write) {
            console.log('publish');
            write();
            setStep(Steps.publishing);
        } else {
            console.log('cannot publish, write is undefined');
        }
    
};
      
  const handleProof = (result: ISuccessResult) => {
    console.log(result)
    const _proof = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action: "proof-of-humanity", // or get this from environment variables,
      signal: account.address ?? "", // if we don't have a signal, use the empty string
    };
    setProof(_proof);
    
    
    /*
    const post_data = JSON.stringify(reqBody);
    return new Promise<void>((resolve, reject) => {
      const fetchAddress = async () => {
          try {
              const response = await fetch(
                'https://developer.worldcoin.org/api/v1/verify/app_65e1167735bc368bbe3d4b7742b04ff2', 
              {
                method:'POST',
                body:post_data,
                / * mode: 'no-cors', * /
                headers: {
                  'Content-Type' : 'application/json',
                  / * 'Access-Control-Allow-Origin': '*', * /
                },
              });
              if (response.status === 200) {
                  resolve()
              }
              reject()
          } catch (e) {
              console.error(e);
              reject()
          }
      };
      fetchAddress();
		});
    */
	};

  const onSuccess = (result: ISuccessResult) => {
		console.log(result);
	};

  const urlParams = new URLSearchParams(window.location.search);
	const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
		CredentialType.Orb,
		CredentialType.Phone,
	];

  return (
    <div>
      <h1>Worldcoin</h1>
      {proof && (
        <div>
            
            <h2>Proof of humanity</h2>
            <p>Merkle Root: {proof.merkle_root}</p>
            <p>Nullifier Hash: {proof.nullifier_hash}</p>
            <p>Proof: {proof.proof}</p>
            <p>Credential Type: {proof.credential_type}</p>
            <p>Action: {proof.action}</p>
            <p>Signal {proof.signal}</p>
            {step !== Steps.publishing &&
                                            <Button onClick={handlePublish}>Publish dataset ownership</Button>}
        </div>
      )}
      {!proof && (
      <>  
      <p>Get a signature</p>
      <div
			className="App"
			style={{
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
	   <IDKitWidget
		   app_id="app_65e1167735bc368bbe3d4b7742b04ff2" // obtain this from developer.worldcoin.org
		   action="proof-of-humanity"
       signal={account.address ?? ""}
       credential_types={credential_types}
		   onSuccess={onSuccess} // pass the proof to the API or your smart contract
       handleVerify={handleProof}
	   >
     {({ open } : { open : any }) => <button onClick={open}>Sign with worldcoin</button>}
     </IDKitWidget>
     </div>
     </>
      )}
     </div>

  )
}

export default Worldcoin
import { IDKitWidget, ISuccessResult, CredentialType } from "@worldcoin/idkit";
import {FunctionComponent} from "react";

const Worldcoin: FunctionComponent = () => {

  const handleProof = (result: ISuccessResult) => {
    console.log(result)
    const data = result as any;
    data.action = "proof-of-humanity";
    data.signal = "random_signal";
    return new Promise<void>((resolve, reject) => {
      const fetchAddress = async () => {
          try {
              const response = await fetch(
                'https://developer.worldcoin.org/api/v1/verify/app_65e1167735bc368bbe3d4b7742b04ff2', 
              {
                method:'POST',
                body:JSON.stringify(result),
                /* mode: 'no-cors', */
                headers: {
                  'Content-Type' : 'application/json',
                  /* 'Access-Control-Allow-Origin': '*', */
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
       signal="random_signal"
       credential_types={credential_types}
		   onSuccess={onSuccess} // pass the proof to the API or your smart contract
       handleVerify={handleProof}
	   >
     {({ open } : { open : any }) => <button onClick={open}>Sign with worldcoin</button>}
     </IDKitWidget>
     </div>
     </>

  )
}

export default Worldcoin
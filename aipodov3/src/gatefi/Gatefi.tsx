import { useState } from 'react'
import {GateFiSDK, GateFiDisplayModeEnum} from "@gatefi/js-sdk";
import { useAccount } from 'wagmi'



function GateFi () {
    const [overley, setOverlay] = useState(false)
    const account = useAccount()
    if (overley) {
        if (account.isConnected){
            new GateFiSDK({
                merchantId: "dc4f2d7f-c125-4594-aed2-fcfae3ba331d",
                displayMode: GateFiDisplayModeEnum.Overlay,
                isSandbox: true,
                walletAddress: account.address,
                walletLock: true,
                availableCrypto: ["ETH"],
            })
        }
        
    }

    return (
        <div><button id="overlay-button" onClick={() => {console.log("Hello!");setOverlay(!overley)}}>Buy tokens</button></div>
    )
}

export default GateFi
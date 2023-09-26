import {FunctionComponent, useState} from "react";
import {useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import AipodoContract from "../../../smartcontract/artifacts/Aipodo.json";
import {contractAddressPerChain} from "./DatasetCreate.tsx";
import Button from "./components/Button.tsx";
import Loader from "./components/Loader.tsx";
import {ItemBuy} from "./DatasetList.tsx";

interface BuyButtonProps {
    commitHash: string,
    price: string,
    itemBuys: ItemBuy[],
}

const BuyButton: FunctionComponent<BuyButtonProps> = ({commitHash, price, itemBuys}) => {
    const {address} = useAccount();
    const {chain} = useNetwork();

    const [buying, setBuying] = useState(false);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
        isLoading: _isPrepareLoading,
    } = usePrepareContractWrite({
        address: contractAddressPerChain[`${chain?.id}`],
        abi: AipodoContract.abi,
        functionName: 'buy_item',
        value: BigInt(price),
        args: [commitHash],
        enabled: true,
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

    const handleBuy = () => {
        if (!buying) {
            // TODO
            if (write) {
                console.log('buying');
                write();
                setBuying(true);
            } else {
                console.log('cannot buy, write is undefined');
            }
        }
    };

    const hasBuyed = (itemBuys ?? []).filter(({hash, buyer}) => {
        return hash === commitHash && buyer?.toLowerCase() === address?.toLowerCase()
    }).length > 0;

    if (hasBuyed) {
        return (<div>Dataset buyed!</div>);
    } else {
        return (
            <>
                {!buying &&
                    <Button onClick={handleBuy}>Buy dataset</Button>}
                {(buying && isLoading) && (
                    <>
                        <Loader/>
                        <div>Publishing dataset ownership transaction...</div>
                    </>
                )}
                {(buying && !isLoading && (isPrepareError || isError)) && (
                    <div>Error: {prepareError ? (prepareError as any).shortMessage : error?.message}</div>
                )}
                {(buying && !isLoading && !(isPrepareError || isError || isSuccess)) && (
                    <>
                        <Loader/>
                        <div>Dataset buy transaction validation...</div>
                    </>
                )}
                {(buying && !isLoading && isSuccess) && (
                    <div>Dataset buyed!</div>
                )}
            </>
        );

    }
}

export default BuyButton;

import {FunctionComponent, useState} from "react";
import {useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import AipodoContract from "../../../smartcontract/artifacts/Aipodo.json";
import {contractAddressPerChain} from "./DatasetCreate.tsx";
import Button from "./components/Button.tsx";
import Loader from "./components/Loader.tsx";

interface BuyButtonProps {
    commitHash: string,
    price: string,
}

const BuyButton: FunctionComponent<BuyButtonProps> = ({commitHash, price}) => {
    const {chain} = useNetwork();

    const [buying, setBuying] = useState(false);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
        isLoading: isPrepareLoading,
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
                <div>Error: {prepareError ? prepareError.shortMessage : error?.message}</div>
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

export default BuyButton;

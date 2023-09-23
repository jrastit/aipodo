import {ethers} from 'ethers'
import {Interface} from "@ethersproject/abi";
import AipodoContract from '../../../smartcontract/artifacts/Aipodo.json';

const aipodoInterface = new Interface(AipodoContract.abi);

export const add_item = async (rpcUrl: string, gweiAmount: string, hash: string, price: number, parents: string[]) => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    //creating a signer
    const signer = provider.getSigner();

    //creating contract instance and invoking contract function
    const contractInstance = new ethers.Contract(
        '0xe68DD1328396bcf2A457C12c51eF2a977B828b83',
        aipodoInterface,
        signer
    );
    const transactionHash = await contractInstance.add_item(hash, price, parents, {value: gweiAmount});
}


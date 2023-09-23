import * as encoding from "@walletconnect/encoding";

import ethers from 'ethers';

import { apiGetAccountNonce, apiGetGasPrice } from "./api";

import AipodoContract from '../../../smartcontract/artifacts/Aipodo.json';

const abi=AipodoContract.abi

export async function formatAipodoAddItem(account: string, item_hash: string, item_price: string) {
  const [namespace, reference, address] = account.split(":");
  const chainId = `${namespace}:${reference}`;

  let _nonce;
  try {
    _nonce = await apiGetAccountNonce(address, chainId);
  } catch (error) {
    throw new Error(
      `Failed to fetch nonce for address ${address} on chain ${chainId}`
    );
  }

  const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

  // gasPrice
  const _gasPrice = await apiGetGasPrice(chainId);
  const gasPrice = encoding.sanitizeHex(_gasPrice);

  // gasLimit
  const _gasLimit = 21000;
  const gasLimit = encoding.sanitizeHex(encoding.numberToHex(_gasLimit));

  // value
  const _value = 0;
  const value = encoding.sanitizeHex(encoding.numberToHex(_value));

  const contract_address = '0xe68DD1328396bcf2A457C12c51eF2a977B828b83';

  const aipodo = new ethers.Contract('0xe68DD1328396bcf2A457C12c51eF2a977B828b83', abi);

  const data = aipodo.encodeFunctionData("add_item", item_hash, item_price, []);

  const tx = {
    from: address,
    to: contract_address,
    data: data,
    nonce,
    gasPrice,
    gasLimit,
    value,
  };

  return tx;
}
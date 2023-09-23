import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { ItemBuy, ItemCreated, ItemPay } from "../generated/Aipodo/Aipodo"

export function createItemBuyEvent(
  hash: BigInt,
  price: BigInt,
  buyer: Address
): ItemBuy {
  let itemBuyEvent = changetype<ItemBuy>(newMockEvent())

  itemBuyEvent.parameters = new Array()

  itemBuyEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromUnsignedBigInt(hash))
  )
  itemBuyEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  itemBuyEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return itemBuyEvent
}

export function createItemCreatedEvent(
  hash: BigInt,
  full_price: BigInt,
  parents: Array<BigInt>
): ItemCreated {
  let itemCreatedEvent = changetype<ItemCreated>(newMockEvent())

  itemCreatedEvent.parameters = new Array()

  itemCreatedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromUnsignedBigInt(hash))
  )
  itemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "full_price",
      ethereum.Value.fromUnsignedBigInt(full_price)
    )
  )
  itemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "parents",
      ethereum.Value.fromUnsignedBigIntArray(parents)
    )
  )

  return itemCreatedEvent
}

export function createItemPayEvent(hash: BigInt, amount: BigInt): ItemPay {
  let itemPayEvent = changetype<ItemPay>(newMockEvent())

  itemPayEvent.parameters = new Array()

  itemPayEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromUnsignedBigInt(hash))
  )
  itemPayEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return itemPayEvent
}

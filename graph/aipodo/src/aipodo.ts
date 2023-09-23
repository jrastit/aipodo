import {
  ItemBuy as ItemBuyEvent,
  ItemCreated as ItemCreatedEvent,
  ItemPay as ItemPayEvent
} from "../generated/Aipodo/Aipodo"
import { ItemBuy, ItemCreated, ItemPay } from "../generated/schema"

export function handleItemBuy(event: ItemBuyEvent): void {
  let entity = new ItemBuy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.hash = event.params.hash
  entity.price = event.params.price
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemCreated(event: ItemCreatedEvent): void {
  let entity = new ItemCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.hash = event.params.hash
  entity.full_price = event.params.full_price
  entity.parents = event.params.parents

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemPay(event: ItemPayEvent): void {
  let entity = new ItemPay(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.hash = event.params.hash
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

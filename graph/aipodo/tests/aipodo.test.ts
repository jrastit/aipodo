import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ItemBuy } from "../generated/schema"
import { ItemBuy as ItemBuyEvent } from "../generated/Aipodo/Aipodo"
import { handleItemBuy } from "../src/aipodo"
import { createItemBuyEvent } from "./aipodo-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let hash = BigInt.fromI32(234)
    let price = BigInt.fromI32(234)
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let newItemBuyEvent = createItemBuyEvent(hash, price, buyer)
    handleItemBuy(newItemBuyEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ItemBuy created and stored", () => {
    assert.entityCount("ItemBuy", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ItemBuy",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hash",
      "234"
    )
    assert.fieldEquals(
      "ItemBuy",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "price",
      "234"
    )
    assert.fieldEquals(
      "ItemBuy",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

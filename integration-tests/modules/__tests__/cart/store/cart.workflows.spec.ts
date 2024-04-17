import {
  addShippingMethodToWorkflow,
  addToCartWorkflow,
  createCartWorkflow,
  createPaymentCollectionForCartWorkflow,
  deleteLineItemsStepId,
  deleteLineItemsWorkflow,
  findOrCreateCustomerStepId,
  linkCartAndPaymentCollectionsStepId,
  listShippingOptionsForCartWorkflow,
  refreshPaymentCollectionForCartWorkflow,
  updateLineItemInCartWorkflow,
  updateLineItemsStepId,
  updatePaymentCollectionStepId,
} from "@medusajs/core-flows"
import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IFulfillmentModuleService,
  IInventoryServiceNext,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationServiceNext,
} from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import adminSeeder from "../../../../helpers/admin-seeder"

jest.setTimeout(200000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Carts workflows", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let regionModuleService: IRegionModuleService
      let scModuleService: ISalesChannelModuleService
      let customerModule: ICustomerModuleService
      let productModule: IProductModuleService
      let pricingModule: IPricingModuleService
      let paymentModule: IPaymentModuleService
      let inventoryModule: IInventoryServiceNext
      let stockLocationModule: IStockLocationServiceNext
      let fulfillmentModule: IFulfillmentModuleService
      let locationModule: IStockLocationServiceNext
      let remoteLink, remoteQuery

      let defaultRegion

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
        regionModuleService = appContainer.resolve(
          ModuleRegistrationName.REGION
        )
        scModuleService = appContainer.resolve(
          ModuleRegistrationName.SALES_CHANNEL
        )
        customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        paymentModule = appContainer.resolve(ModuleRegistrationName.PAYMENT)
        inventoryModule = appContainer.resolve(ModuleRegistrationName.INVENTORY)
        stockLocationModule = appContainer.resolve(
          ModuleRegistrationName.STOCK_LOCATION
        )
        fulfillmentModule = appContainer.resolve(
          ModuleRegistrationName.FULFILLMENT
        )
        locationModule = appContainer.resolve(
          ModuleRegistrationName.STOCK_LOCATION
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
      })

      beforeEach(async () => {
        await adminSeeder(dbConnection)

        // Here, so we don't have to create a region for each test
        defaultRegion = await regionModuleService.create({
          name: "Default Region",
          currency_code: "dkk",
        })
      })

      describe("CreateCartWorkflow", () => {
        it("should create a cart", async () => {
          const region = await regionModuleService.create({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await stockLocationModule.create({
            name: "Warehouse",
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  title: "Test variant",
                },
              ],
            },
          ])

          const inventoryItem = await inventoryModule.create({
            sku: "inv-1234",
          })

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location.id,
              stocked_quantity: 2,
              reserved_quantity: 0,
            },
          ])

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.INVENTORY]: {
                inventory_item_id: inventoryItem.id,
              },
            },
          ])

          const { result } = await createCartWorkflow(appContainer).run({
            input: {
              email: "tony@stark.com",
              currency_code: "usd",
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
          })

          const cart = await cartModuleService.retrieve(result.id, {
            relations: ["items"],
          })

          expect(cart).toEqual(
            expect.objectContaining({
              currency_code: "usd",
              email: "tony@stark.com",
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              customer_id: expect.any(String),
              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 1,
                  unit_price: 3000,
                }),
              ]),
            })
          )
        })

        it("should revert if the cart creation fails", async () => {
          const region = await regionModuleService.create({
            name: "US",
            currency_code: "usd",
          })

          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await stockLocationModule.create({
            name: "Warehouse",
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  title: "Test variant",
                },
              ],
            },
          ])

          const inventoryItem = await inventoryModule.create({
            sku: "inv-1234",
          })

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location.id,
              stocked_quantity: 2,
              reserved_quantity: 0,
            },
          ])

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.INVENTORY]: {
                inventory_item_id: inventoryItem.id,
              },
            },
          ])

          const workflow = createCartWorkflow(appContainer)

          workflow.addAction(
            "throw",
            {
              invoke: async function failStep() {
                throw new Error(`Failed to create cart`)
              },
            },
            {
              noCompensation: true,
            }
          )

          const { transaction } = await workflow.run({
            throwOnError: false,
            input: {
              email: "tony@stark.com",
              currency_code: "usd",
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
          })

          expect(transaction.flow.state).toEqual("reverted")
        })

        it("should throw when no regions exist", async () => {
          await regionModuleService.delete(defaultRegion.id)

          const { errors } = await createCartWorkflow(appContainer).run({
            input: {
              email: "tony@stark.com",
              currency_code: "usd",
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "find-one-or-any-region",
              handlerType: "invoke",
              error: expect.objectContaining({ message: "No regions found" }),
            },
          ])
        })

        it("should throw if variants are out of stock", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await stockLocationModule.create({
            name: "Warehouse",
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  title: "Test variant",
                },
              ],
            },
          ])

          const inventoryItem = await inventoryModule.create({
            sku: "inv-1234",
          })

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location.id,
              stocked_quantity: 2,
              reserved_quantity: 2,
            },
          ])

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.INVENTORY]: {
                inventory_item_id: inventoryItem.id,
              },
            },
          ])

          const { errors } = await createCartWorkflow(appContainer).run({
            input: {
              sales_channel_id: salesChannel.id,
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "confirm-inventory-step",
              handlerType: "invoke",
              error: expect.objectContaining({
                message: "Some variant does not have the required inventory",
              }),
            },
          ])
        })

        it("should throw if sales channel is disabled", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
            is_disabled: true,
          })

          const { errors } = await createCartWorkflow(appContainer).run({
            input: {
              sales_channel_id: salesChannel.id,
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "find-sales-channel",
              handlerType: "invoke",
              error: expect.objectContaining({
                message: `Unable to assign cart to disabled Sales Channel: Webshop`,
              }),
            },
          ])
        })

        describe("compensation", () => {
          it("should delete created customer if cart-creation fails", async () => {
            expect.assertions(2)
            const workflow = createCartWorkflow(appContainer)

            workflow.appendAction("throw", findOrCreateCustomerStepId, {
              invoke: async function failStep() {
                throw new Error(`Failed to create cart`)
              },
            })

            const { errors } = await workflow.run({
              input: {
                currency_code: "usd",
                email: "tony@stark-industries.com",
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to create cart`,
                }),
              },
            ])

            const customers = await customerModule.list({
              email: "tony@stark-industries.com",
            })

            expect(customers).toHaveLength(0)
          })

          it("should not delete existing customer if cart-creation fails", async () => {
            expect.assertions(2)
            const workflow = createCartWorkflow(appContainer)

            workflow.appendAction("throw", findOrCreateCustomerStepId, {
              invoke: async function failStep() {
                throw new Error(`Failed to create cart`)
              },
            })

            const customer = await customerModule.create({
              email: "tony@stark-industries.com",
            })

            const { errors } = await workflow.run({
              input: {
                currency_code: "usd",
                customer_id: customer.id,
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to create cart`,
                }),
              },
            ])

            const customers = await customerModule.list({
              email: "tony@stark-industries.com",
            })

            expect(customers).toHaveLength(1)
          })
        })
      })

      describe("AddToCartWorkflow", () => {
        it("should add item to cart", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await stockLocationModule.create({
            name: "Warehouse",
          })

          let cart = await cartModuleService.create({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  title: "Test variant",
                },
              ],
            },
          ])

          const inventoryItem = await inventoryModule.create({
            sku: "inv-1234",
          })

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location.id,
              stocked_quantity: 2,
              reserved_quantity: 0,
            },
          ])

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.INVENTORY]: {
                inventory_item_id: inventoryItem.id,
              },
            },
          ])

          cart = await cartModuleService.retrieve(cart.id, {
            select: ["id", "region_id", "currency_code"],
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
              cart,
            },
          })

          cart = await cartModuleService.retrieve(cart.id, {
            relations: ["items"],
          })

          expect(cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 3000,
                  quantity: 1,
                  title: "Test variant",
                }),
              ]),
            })
          )
        })

        it("should throw if no price sets for variant exist", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await stockLocationModule.create({
            name: "Warehouse",
          })

          let cart = await cartModuleService.create({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  title: "Test variant",
                },
              ],
            },
          ])

          const inventoryItem = await inventoryModule.create({
            sku: "inv-1234",
          })

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location.id,
              stocked_quantity: 2,
              reserved_quantity: 0,
            },
          ])

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.INVENTORY]: {
                inventory_item_id: inventoryItem.id,
              },
            },
          ])

          const { errors } = await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
              cart,
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "get-variant-price-sets",
              handlerType: "invoke",
              error: expect.objectContaining({
                message: `Variants with IDs ${product.variants[0].id} do not have a price`,
              }),
            },
          ])
        })

        it("should throw if variant does not exist", async () => {
          const cart = await cartModuleService.create({
            currency_code: "usd",
          })

          const { errors } = await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: "prva_foo",
                  quantity: 1,
                },
              ],
              cart,
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "validate-variants-exist",
              handlerType: "invoke",
              error: expect.objectContaining({
                message: `Variants with IDs prva_foo do not exist`,
              }),
            },
          ])
        })
      })

      describe("updateLineItemInCartWorkflow", () => {
        it("should update item in cart", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await stockLocationModule.create({
            name: "Warehouse",
          })

          const [product] = await productModule.create([
            {
              title: "Test product",
              variants: [
                {
                  title: "Test variant",
                },
              ],
            },
          ])

          const inventoryItem = await inventoryModule.create({
            sku: "inv-1234",
          })

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location.id,
              stocked_quantity: 2,
              reserved_quantity: 0,
            },
          ])

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.INVENTORY]: {
                inventory_item_id: inventoryItem.id,
              },
            },
          ])

          let cart = await cartModuleService.create({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            items: [
              {
                variant_id: product.variants[0].id,
                quantity: 1,
                unit_price: 5000,
                title: "Test item",
              },
            ],
          })

          cart = await cartModuleService.retrieve(cart.id, {
            select: ["id", "region_id", "currency_code"],
            relations: ["items", "items.variant_id", "items.metadata"],
          })

          const item = cart.items?.[0]!

          const { errors } = await updateLineItemInCartWorkflow(
            appContainer
          ).run({
            input: {
              cart,
              item,
              update: {
                metadata: {
                  foo: "bar",
                },
                quantity: 2,
              },
            },
            throwOnError: false,
          })

          const updatedItem = await cartModuleService.retrieveLineItem(item.id)

          expect(updatedItem).toEqual(
            expect.objectContaining({
              id: item.id,
              unit_price: 3000,
              quantity: 2,
              title: "Test item",
            })
          )
        })

        describe("compensation", () => {
          it("should revert line item update to original state", async () => {
            expect.assertions(2)
            const workflow = updateLineItemInCartWorkflow(appContainer)

            workflow.appendAction("throw", updateLineItemsStepId, {
              invoke: async function failStep() {
                throw new Error(`Failed to update something after line items`)
              },
            })

            const salesChannel = await scModuleService.create({
              name: "Webshop",
            })

            const location = await stockLocationModule.create({
              name: "Warehouse",
            })

            const [product] = await productModule.create([
              {
                title: "Test product",
                variants: [
                  {
                    title: "Test variant",
                  },
                ],
              },
            ])

            const inventoryItem = await inventoryModule.create({
              sku: "inv-1234",
            })

            await inventoryModule.createInventoryLevels([
              {
                inventory_item_id: inventoryItem.id,
                location_id: location.id,
                stocked_quantity: 2,
                reserved_quantity: 0,
              },
            ])

            const priceSet = await pricingModule.create({
              prices: [
                {
                  amount: 3000,
                  currency_code: "usd",
                },
              ],
            })

            await remoteLink.create([
              {
                [Modules.PRODUCT]: {
                  variant_id: product.variants[0].id,
                },
                [Modules.PRICING]: {
                  price_set_id: priceSet.id,
                },
              },
              {
                [Modules.SALES_CHANNEL]: {
                  sales_channel_id: salesChannel.id,
                },
                [Modules.STOCK_LOCATION]: {
                  stock_location_id: location.id,
                },
              },
              {
                [Modules.PRODUCT]: {
                  variant_id: product.variants[0].id,
                },
                [Modules.INVENTORY]: {
                  inventory_item_id: inventoryItem.id,
                },
              },
            ])

            let cart = await cartModuleService.create({
              currency_code: "usd",
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                  unit_price: 3000,
                  title: "Test item",
                },
              ],
            })

            cart = await cartModuleService.retrieve(cart.id, {
              select: ["id", "region_id", "currency_code"],
              relations: ["items", "items.variant_id", "items.metadata"],
            })

            const item = cart.items?.[0]!

            const { errors } = await workflow.run({
              input: {
                cart,
                item,
                update: {
                  metadata: {
                    foo: "bar",
                  },
                  title: "Test item updated",
                  quantity: 2,
                },
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to update something after line items`,
                }),
              },
            ])

            const updatedItem = await cartModuleService.retrieveLineItem(
              item.id
            )

            expect(updatedItem).toEqual(
              expect.objectContaining({
                id: item.id,
                unit_price: 3000,
                quantity: 1,
                title: "Test item",
              })
            )
          })
        })
      })

      describe("deleteLineItems", () => {
        it("should delete items in cart", async () => {
          const cart = await cartModuleService.create({
            currency_code: "usd",
            items: [
              {
                quantity: 1,
                unit_price: 5000,
                title: "Test item",
              },
            ],
          })

          const items = await cartModuleService.listLineItems({
            cart_id: cart.id,
          })

          await deleteLineItemsWorkflow(appContainer).run({
            input: {
              ids: items.map((i) => i.id),
            },
            throwOnError: false,
          })

          const [deletedItem] = await cartModuleService.listLineItems({
            id: items.map((i) => i.id),
          })

          expect(deletedItem).toBeUndefined()
        })

        describe("compensation", () => {
          it("should restore line item if delete fails", async () => {
            const workflow = deleteLineItemsWorkflow(appContainer)

            workflow.appendAction("throw", deleteLineItemsStepId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after deleting line items`
                )
              },
            })

            const cart = await cartModuleService.create({
              currency_code: "usd",
              items: [
                {
                  quantity: 1,
                  unit_price: 3000,
                  title: "Test item",
                },
              ],
            })

            const items = await cartModuleService.listLineItems({
              cart_id: cart.id,
            })

            const { errors } = await workflow.run({
              input: {
                ids: items.map((i) => i.id),
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after deleting line items`,
                }),
              },
            ])

            const updatedItem = await cartModuleService.retrieveLineItem(
              items[0].id
            )

            expect(updatedItem).not.toBeUndefined()
          })
        })
      })

      describe("createPaymentCollectionForCart", () => {
        it("should create a payment collection and link it to cart", async () => {
          const cart = await cartModuleService.create({
            currency_code: "dkk",
            region_id: defaultRegion.id,
            items: [
              {
                quantity: 1,
                unit_price: 5000,
                title: "Test item",
              },
            ],
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
              region_id: defaultRegion.id,
              currency_code: "dkk",
              amount: 5000,
            },
            throwOnError: false,
          })

          const result = await remoteQuery(
            {
              cart: {
                fields: ["id"],
                payment_collection: {
                  fields: ["id", "amount", "currency_code"],
                },
              },
            },
            {
              cart: {
                id: cart.id,
              },
            }
          )

          expect(result).toEqual([
            expect.objectContaining({
              id: cart.id,
              payment_collection: expect.objectContaining({
                amount: 5000,
                currency_code: "dkk",
              }),
            }),
          ])
        })

        describe("compensation", () => {
          it("should dismiss cart <> payment collection link and delete created payment collection", async () => {
            const workflow =
              createPaymentCollectionForCartWorkflow(appContainer)

            workflow.appendAction(
              "throw",
              linkCartAndPaymentCollectionsStepId,
              {
                invoke: async function failStep() {
                  throw new Error(
                    `Failed to do something after linking cart and payment collection`
                  )
                },
              }
            )

            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const cart = await cartModuleService.create({
              currency_code: "usd",
              region_id: region.id,
              items: [
                {
                  quantity: 1,
                  unit_price: 5000,
                  title: "Test item",
                },
              ],
            })

            const { errors } = await workflow.run({
              input: {
                cart_id: cart.id,
                region_id: region.id,
                currency_code: "usd",
                amount: 5000,
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after linking cart and payment collection`,
                }),
              },
            ])

            const carts = await remoteQuery(
              {
                cart: {
                  fields: ["id"],
                  payment_collection: {
                    fields: ["id", "amount", "currency_code"],
                  },
                },
              },
              {
                cart: {
                  id: cart.id,
                },
              }
            )

            const payCols = await remoteQuery({
              payment_collection: {
                fields: ["id"],
              },
            })

            expect(carts).toEqual([
              expect.objectContaining({
                id: cart.id,
                payment_collection: undefined,
              }),
            ])
            expect(payCols.length).toEqual(0)
          })
        })
      })

      describe("refreshPaymentCollectionForCart", () => {
        it("should refresh a payment collection for a cart", async () => {
          const cart = await cartModuleService.create({
            currency_code: "dkk",
            region_id: defaultRegion.id,
            items: [
              {
                quantity: 1,
                unit_price: 5000,
                title: "Test item",
              },
            ],
          })

          const paymentCollection =
            await paymentModule.createPaymentCollections({
              amount: 5000,
              currency_code: "dkk",
              region_id: defaultRegion.id,
            })

          const paymentSession = await paymentModule.createPaymentSession(
            paymentCollection.id,
            {
              amount: 5000,
              currency_code: "dkk",
              data: {},
              provider_id: "pp_system_default",
            }
          )

          await remoteLink.create([
            {
              [Modules.CART]: {
                cart_id: cart.id,
              },
              [Modules.PAYMENT]: {
                payment_collection_id: paymentCollection.id,
              },
            },
          ])

          await refreshPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
            throwOnError: false,
          })

          const updatedPaymentCollection =
            await paymentModule.retrievePaymentCollection(paymentCollection.id)

          expect(updatedPaymentCollection).toEqual(
            expect.objectContaining({
              id: paymentCollection.id,
              amount: 4242,
            })
          )

          const sessionShouldNotExist = await paymentModule.listPaymentSessions(
            { id: paymentSession.id },
            { withDeleted: true }
          )

          expect(sessionShouldNotExist).toHaveLength(0)
        })

        describe("compensation", () => {
          it("should revert payment collection amount and create a new payment session", async () => {
            const region = await regionModuleService.create({
              name: "US",
              currency_code: "usd",
            })

            const testCart = await cartModuleService.create({
              currency_code: "usd",
              region_id: region.id,
              items: [
                {
                  quantity: 1,
                  unit_price: 5000,
                  title: "Test item",
                },
              ],
            })

            const paymentCollection =
              await paymentModule.createPaymentCollections({
                amount: 5000,
                currency_code: "dkk",
                region_id: defaultRegion.id,
              })

            const paymentSession = await paymentModule.createPaymentSession(
              paymentCollection.id,
              {
                amount: 5000,
                currency_code: "dkk",
                data: {},
                provider_id: "pp_system_default",
              }
            )

            await remoteLink.create([
              {
                [Modules.CART]: {
                  cart_id: testCart.id,
                },
                [Modules.PAYMENT]: {
                  payment_collection_id: paymentCollection.id,
                },
              },
            ])

            const workflow =
              refreshPaymentCollectionForCartWorkflow(appContainer)

            workflow.appendAction("throw", updatePaymentCollectionStepId, {
              invoke: async function failStep() {
                throw new Error(
                  `Failed to do something after updating payment collections`
                )
              },
            })

            const { errors } = await workflow.run({
              input: {
                cart_id: testCart.id,
              },
              throwOnError: false,
            })

            expect(errors).toEqual([
              {
                action: "throw",
                handlerType: "invoke",
                error: expect.objectContaining({
                  message: `Failed to do something after updating payment collections`,
                }),
              },
            ])

            const updatedPaymentCollection =
              await paymentModule.retrievePaymentCollection(
                paymentCollection.id,
                {
                  relations: ["payment_sessions"],
                }
              )

            const sessions = await paymentModule.listPaymentSessions({
              payment_collection_id: paymentCollection.id,
            })

            expect(sessions).toHaveLength(1)
            expect(sessions[0].id).not.toEqual(paymentSession.id)
            expect(sessions[0]).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                amount: 5000,
                currency_code: "dkk",
              })
            )
            expect(updatedPaymentCollection).toEqual(
              expect.objectContaining({
                id: paymentCollection.id,
                amount: 5000,
              })
            )
          })
        })
      })
      describe("AddShippingMethodToCartWorkflow", () => {
        it("should add shipping method to cart", async () => {
          let cart = await cartModuleService.create({
            currency_code: "usd",
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [
                  {
                    type: "country",
                    country_code: "us",
                  },
                ],
              },
            ],
          })

          const shippingOption = await fulfillmentModule.createShippingOptions({
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
          })

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.FULFILLMENT]: {
                shipping_option_id: shippingOption.id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
          ])

          cart = await cartModuleService.retrieve(cart.id, {
            select: ["id", "region_id", "currency_code"],
          })

          await addShippingMethodToWorkflow(appContainer).run({
            input: {
              options: [
                {
                  id: shippingOption.id,
                },
              ],
              cart_id: cart.id,
              currency_code: cart.currency_code,
            },
          })

          cart = await cartModuleService.retrieve(cart.id, {
            relations: ["shipping_methods"],
          })

          expect(cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  amount: 3000,
                  name: "Test shipping option",
                }),
              ]),
            })
          )
        })
      })

      describe("listShippingOptionsForCartWorkflow", () => {
        it("should list shipping options for cart", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await locationModule.create({
            name: "Europe",
          })

          let cart = await cartModuleService.create({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            shipping_address: {
              city: "CPH",
              province: "Sjaelland",
              country_code: "dk",
            },
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [
                  {
                    type: "country",
                    country_code: "dk",
                  },
                ],
              },
            ],
          })

          const shippingOption = await fulfillmentModule.createShippingOptions({
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
          })

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.FULFILLMENT]: {
                shipping_option_id: shippingOption.id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
          ])

          cart = await cartModuleService.retrieve(cart.id, {
            select: ["id"],
            relations: ["shipping_address"],
          })

          const { result } = await listShippingOptionsForCartWorkflow(
            appContainer
          ).run({
            input: {
              cart_id: cart.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              shipping_address: {
                city: cart.shipping_address?.city,
                province: cart.shipping_address?.province,
                country_code: cart.shipping_address?.country_code,
              },
            },
          })

          expect(result).toEqual([
            expect.objectContaining({
              amount: 3000,
              name: "Test shipping option",
              id: shippingOption.id,
            }),
          ])
        })

        it("should list no shipping options for cart, if sales channel is not associated with location", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await locationModule.create({
            name: "Europe",
          })

          let cart = await cartModuleService.create({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            shipping_address: {
              city: "CPH",
              province: "Sjaelland",
              country_code: "dk",
            },
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [
                  {
                    type: "country",
                    country_code: "us",
                  },
                ],
              },
            ],
          })

          const shippingOption = await fulfillmentModule.createShippingOptions({
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
          })

          const priceSet = await pricingModule.create({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await remoteLink.create([
            {
              [Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.FULFILLMENT]: {
                shipping_option_id: shippingOption.id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
              },
            },
          ])

          cart = await cartModuleService.retrieve(cart.id, {
            select: ["id"],
            relations: ["shipping_address"],
          })

          const { result } = await listShippingOptionsForCartWorkflow(
            appContainer
          ).run({
            input: {
              cart_id: cart.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              shipping_address: {
                city: cart.shipping_address?.city,
                province: cart.shipping_address?.province,
                country_code: cart.shipping_address?.country_code,
              },
            },
          })

          expect(result).toEqual([])
        })

        it("should throw when shipping options are missing prices", async () => {
          const salesChannel = await scModuleService.create({
            name: "Webshop",
          })

          const location = await locationModule.create({
            name: "Europe",
          })

          let cart = await cartModuleService.create({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            shipping_address: {
              city: "CPH",
              province: "Sjaelland",
              country_code: "dk",
            },
          })

          const shippingProfile =
            await fulfillmentModule.createShippingProfiles({
              name: "Test",
              type: "default",
            })

          const fulfillmentSet = await fulfillmentModule.create({
            name: "Test",
            type: "test-type",
            service_zones: [
              {
                name: "Test",
                geo_zones: [
                  {
                    type: "country",
                    country_code: "dk",
                  },
                ],
              },
            ],
          })

          const shippingOption = await fulfillmentModule.createShippingOptions({
            name: "Test shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
          })

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
            {
              [Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
          ])

          cart = await cartModuleService.retrieve(cart.id, {
            select: ["id"],
            relations: ["shipping_address"],
          })

          const { errors } = await listShippingOptionsForCartWorkflow(
            appContainer
          ).run({
            input: {
              cart_id: cart.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              shipping_address: {
                city: cart.shipping_address?.city,
                province: cart.shipping_address?.province,
                country_code: cart.shipping_address?.country_code,
              },
            },
            throwOnError: false,
          })

          expect(errors).toEqual([
            {
              action: "get-shipping-option-price-sets",
              error: expect.objectContaining({
                message: `Shipping options with IDs ${shippingOption.id} do not have a price`,
              }),
              handlerType: "invoke",
            },
          ])
        })
      })
    })
  },
})

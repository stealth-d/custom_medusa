import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICustomerModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  PriceListStatus,
  PriceListType,
} from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Price Lists API", () => {
      let appContainer
      let product
      let product2
      let variant
      let variant2
      let region
      let customerGroup
      let pricingModule: IPricingModuleService
      let productModule: IProductModuleService
      let customerModule: ICustomerModuleService
      let regionModule: IRegionModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        customerGroup = await customerModule.createCustomerGroup({
          name: "VIP",
        })
        region = await regionModule.create({ name: "US", currency_code: "USD" })
        ;[product] = await productModule.create([
          {
            title: "test product",
            variants: [
              {
                title: "test product variant",
              },
            ],
          },
        ])

        variant = product.variants[0]

        await pricingModule.createRuleTypes([
          { name: "Customer Group ID", rule_attribute: "customer_group_id" },
          { name: "Region ID", rule_attribute: "region_id" },
        ])
      })

      describe("GET /admin/price-lists", () => {
        it("should get all price lists and its prices with rules", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [],
          })

          await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              ends_at: new Date(),
              starts_at: new Date(),
              status: PriceListStatus.ACTIVE,
              type: PriceListType.OVERRIDE,
              prices: [
                {
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
              rules: {
                customer_group_id: [customerGroup.id],
              },
            },
          ])

          let response = await api.get(`/admin/price-lists`, adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.price_lists).toEqual([
            {
              id: expect.any(String),
              type: "override",
              description: "test",
              title: "test price list",
              status: "active",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                {
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 5000,
                  min_quantity: null,
                  max_quantity: null,
                  variant_id: variant.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            },
          ])

          response = await api.get(
            `/admin/price-lists?fields=id,created_at,rules,prices.rules,prices.amount`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.price_lists).toEqual([
            {
              id: expect.any(String),
              created_at: expect.any(String),
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                {
                  amount: 5000,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            },
          ])
        })
      })

      describe("GET /admin/price-lists/:id", () => {
        it("should retrieve a price list and its prices with rules", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [],
          })

          const [priceList] = await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              ends_at: new Date(),
              starts_at: new Date(),
              status: PriceListStatus.ACTIVE,
              type: PriceListType.OVERRIDE,
              prices: [
                {
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
              rules: {
                customer_group_id: [customerGroup.id],
              },
            },
          ])

          let response = await api.get(
            `/admin/price-lists/${priceList.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              type: "override",
              description: "test",
              title: "test price list",
              status: "active",
              starts_at: expect.any(String),
              ends_at: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                {
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 5000,
                  min_quantity: null,
                  max_quantity: null,
                  variant_id: variant.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            })
          )

          response = await api.get(
            `/admin/price-lists/${priceList.id}?fields=id,prices.id,prices.amount`,
            adminHeaders
          )

          expect(response.data.price_list).toEqual({
            id: expect.any(String),
            prices: [
              {
                id: expect.any(String),
                amount: 5000,
              },
            ],
          })
        })

        it("should throw an error when price list is not found", async () => {
          const error = await api
            .get(`/admin/price-lists/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(error.response.status).toBe(404)
          expect(error.response.data).toEqual({
            type: "not_found",
            message: "Price list with id: does-not-exist was not found",
          })
        })
      })

      describe("POST /admin/price-lists", () => {
        it("should create price list and prices successfully", async () => {
          await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
          })

          const data = {
            title: "test price list",
            description: "test",
            type: "override",
            status: "active",
            starts_at: new Date(),
            rules: {
              customer_group_id: [customerGroup.id],
            },
            prices: [
              {
                amount: 400,
                variant_id: variant.id,
                currency_code: "usd",
                rules: { region_id: region.id },
              },
            ],
          }

          const response = await api.post(
            `admin/price-lists`,
            data,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              title: "test price list",
              description: "test",
              type: "override",
              status: "active",
              starts_at: expect.any(String),
              ends_at: null,
              rules: {
                customer_group_id: [customerGroup.id],
              },
              prices: [
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 400,
                  min_quantity: null,
                  max_quantity: null,
                  variant_id: variant.id,
                  rules: {
                    region_id: region.id,
                  },
                }),
              ],
            })
          )
        })

        it("should throw error when required attributes are not provided", async () => {
          const data = {
            prices: [
              {
                amount: 400,
                currency_code: "usd",
              },
            ],
          }

          const errorResponse = await api
            .post(`admin/price-lists`, data, adminHeaders)
            .catch((e) => e)

          expect(errorResponse.response.status).toEqual(400)
          expect(errorResponse.response.data.message).toEqual(
            "title must be a string, description must be a string, type must be one of the following values: sale, override, variant_id must be a string"
          )
        })
      })

      describe("DELETE /admin/price-lists/:id", () => {
        it("should delete price list and money amounts", async () => {
          await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
          })

          const data = {
            title: "test price list",
            description: "test",
            type: "override",
            status: "active",
            starts_at: new Date(),
            prices: [
              { amount: 400, variant_id: variant.id, currency_code: "usd" },
            ],
          }

          const result = await api.post(`admin/price-lists`, data, adminHeaders)
          const priceListId = result.data.price_list.id

          let prices = await pricingModule.listPrices({
            price_list_id: [priceListId],
          })

          expect(prices.length).toEqual(1)

          const deleteRes = await api.delete(
            `/admin/price-lists/${priceListId}`,
            adminHeaders
          )

          expect(deleteRes.status).toEqual(200)

          const afterDelete = await api
            .get(`/admin/price-lists/${priceListId}`, adminHeaders)
            .catch((e) => e)

          expect(afterDelete.response.status).toEqual(404)

          prices = await pricingModule.listPrices({
            price_list_id: [priceListId],
          })
          expect(prices.length).toEqual(0)
        })

        it("should idempotently return a success even if price lists dont exist", async () => {
          const deleteRes = await api.delete(
            `/admin/price-lists/does-not-exist`,
            adminHeaders
          )

          expect(deleteRes.status).toEqual(200)
          expect(deleteRes.data).toEqual({
            id: "does-not-exist",
            object: "price_list",
            deleted: true,
          })
        })
      })

      describe("POST /admin/price-lists/:id", () => {
        it("should throw error when trying to update a price list that does not exist", async () => {
          const updateRes = await api
            .post(
              `admin/price-lists/does-not-exist`,
              { title: "new price list name" },
              adminHeaders
            )
            .catch((e) => e)

          expect(updateRes.response.status).toEqual(404)
          expect(updateRes.response.data.message).toEqual(
            "Price lists with id: does-not-exist was not found"
          )
        })

        it("should update price lists", async () => {
          await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
          })

          const [priceList] = await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              ends_at: new Date(),
              starts_at: new Date(),
              status: PriceListStatus.ACTIVE,
              type: PriceListType.OVERRIDE,
            },
          ])

          const data = {
            title: "new price list name",
            description: "new price list description",
            rules: {
              customer_group_id: [customerGroup.id],
            },
          }

          let response = await api.post(
            `admin/price-lists/${priceList.id}`,
            data,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: "new price list name",
              description: "new price list description",
              rules: {
                customer_group_id: [customerGroup.id],
              },
            })
          )
        })
      })

      describe("POST /admin/price-lists/:id/prices/batch/add", () => {
        it("should add price list prices successfully", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
          })

          const [priceList] = await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              prices: [
                {
                  id: "test-price-id",
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: { region_id: region.id },
                },
              ],
            },
          ])

          const data = {
            prices: [
              {
                amount: 400,
                variant_id: variant.id,
                currency_code: "usd",
                rules: { region_id: region.id },
              },
            ],
          }

          const response = await api.post(
            `admin/price-lists/${priceList.id}/prices/batch/add`,
            data,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices.length).toEqual(2)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 400,
                }),
                expect.objectContaining({
                  id: "test-price-id",
                  currency_code: "usd",
                  amount: 5000,
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/price-lists/:id/prices/batch/update", () => {
        it("should update price list prices successfully", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [{ amount: 3000, currency_code: "usd" }],
          })

          const [priceList] = await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              prices: [
                {
                  id: "test-price-id",
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: { region_id: region.id },
                },
              ],
            },
          ])

          const data = {
            prices: [
              {
                id: "test-price-id",
                amount: 400,
                variant_id: variant.id,
                currency_code: "usd",
                rules: { region_id: region.id },
              },
            ],
          }

          const response = await api.post(
            `admin/price-lists/${priceList.id}/prices/batch/update`,
            data,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list.prices.length).toEqual(1)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  currency_code: "usd",
                  amount: 400,
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/price-lists/:id/prices/batch/remove", () => {
        it("should remove price list prices successfully", async () => {
          const priceSet = await createVariantPriceSet({
            container: appContainer,
            variantId: variant.id,
            prices: [],
          })

          const [createdPriceList] = await pricingModule.createPriceLists([
            {
              title: "test price list",
              description: "test",
              prices: [
                {
                  amount: 5000,
                  currency_code: "usd",
                  price_set_id: priceSet.id,
                  rules: {
                    region_id: region.id,
                  },
                },
              ],
            },
          ])

          const [priceList] = await pricingModule.listPriceLists(
            { id: [createdPriceList.id] },
            { relations: ["prices"] }
          )
          const priceIdToDelete = priceList.prices![0].id

          const response = await api.post(
            `/admin/price-lists/${priceList.id}/prices/batch/remove`,
            { ids: [priceIdToDelete] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.price_list).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              prices: [],
            })
          )
        })
      })
    })
  },
})

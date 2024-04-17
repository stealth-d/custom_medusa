import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICustomerModuleService,
  IProductModuleService,
  IPromotionModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Promotion Rules API", () => {
      let appContainer
      let standardPromotion
      let promotionModule: IPromotionModuleService
      let regionService: IRegionModuleService
      let productService: IProductModuleService
      let customerService: ICustomerModuleService
      let salesChannelService: ISalesChannelModuleService

      const promotionRule = {
        operator: "eq",
        attribute: "old_attr",
        values: ["old value"],
      }

      beforeAll(async () => {
        appContainer = getContainer()
        promotionModule = appContainer.resolve(ModuleRegistrationName.PROMOTION)
        regionService = appContainer.resolve(ModuleRegistrationName.REGION)
        productService = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        customerService = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
        salesChannelService = appContainer.resolve(
          ModuleRegistrationName.SALES_CHANNEL
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        standardPromotion = await promotionModule.create({
          code: "TEST_ACROSS",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            allocation: "across",
            target_type: "items",
            value: 100,
            target_rules: [promotionRule],
          },
          rules: [promotionRule],
        })
      })

      describe("POST /admin/promotions/:id/rules/batch/add", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch/add`,
              {
                rules: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should add rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch/add`,
            {
              rules: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              rules: expect.arrayContaining([
                expect.objectContaining({
                  operator: "eq",
                  attribute: "old_attr",
                  values: [expect.objectContaining({ value: "old value" })],
                }),
                expect.objectContaining({
                  operator: "eq",
                  attribute: "new_attr",
                  values: [expect.objectContaining({ value: "new value" })],
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch/add", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/target-rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch/add`,
              {
                rules: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should add target rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/target-rules/batch/add`,
            {
              rules: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              application_method: expect.objectContaining({
                target_rules: expect.arrayContaining([
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "old_attr",
                    values: [expect.objectContaining({ value: "old value" })],
                  }),
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "new_attr",
                    values: [expect.objectContaining({ value: "new value" })],
                  }),
                ]),
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch/add", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch/add`,
              {
                rules: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should throw an error when trying to add buy rules to a standard promotion", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    attribute: "new_attr",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Can't add buy rules to a standard promotion",
          })
        })

        it("should add buy rules to a buyget promotion successfully", async () => {
          const buyGetPromotion = await promotionModule.create({
            code: "TEST_BUYGET",
            type: PromotionType.BUYGET,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 100,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              buy_rules: [promotionRule],
              target_rules: [promotionRule],
            },
            rules: [promotionRule],
          })

          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch/add`,
            {
              rules: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: buyGetPromotion.id,
              application_method: expect.objectContaining({
                buy_rules: expect.arrayContaining([
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "old_attr",
                    values: [expect.objectContaining({ value: "old value" })],
                  }),
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "new_attr",
                    values: [expect.objectContaining({ value: "new value" })],
                  }),
                ]),
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/rules/batch/remove", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch/remove`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch/remove`,
              { rule_ids: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove rules from a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch/remove`,
            { rule_ids: [standardPromotion.rules[0].id] },
            adminHeaders
          )
          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            ids: [standardPromotion.rules[0].id],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = await promotionModule.retrieve(
            standardPromotion.id,
            { relations: ["rules"] }
          )

          expect(promotion.rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch/remove", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/target-rules/batch/remove`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch/remove`,
              { rule_ids: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove target rules from a promotion successfully", async () => {
          const ruleId = standardPromotion.application_method.target_rules[0].id
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/target-rules/batch/remove`,
            { rule_ids: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = await promotionModule.retrieve(
            standardPromotion.id,
            { relations: ["application_method.target_rules"] }
          )

          expect(promotion.application_method!.target_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch/remove", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch/remove`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch/remove`,
              { rule_ids: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove buy rules from a promotion successfully", async () => {
          const buyGetPromotion = await promotionModule.create({
            code: "TEST_BUYGET",
            type: PromotionType.BUYGET,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 100,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              buy_rules: [promotionRule],
              target_rules: [promotionRule],
            },
            rules: [promotionRule],
          })

          const ruleId = buyGetPromotion!.application_method!.buy_rules![0].id
          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch/remove`,
            { rule_ids: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = await promotionModule.retrieve(buyGetPromotion.id, {
            relations: ["application_method.buy_rules"],
          })

          expect(promotion.application_method!.buy_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/rules/batch/update", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch/update`,
              {
                rules: [
                  {
                    attribute: "test",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "id must be a string, id should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch/update`,
              {
                rules: [
                  {
                    id: standardPromotion.rules[0].id,
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should throw error when promotion rule id does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch/update`,
              {
                rules: [
                  {
                    id: "does-not-exist",
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Promotion rules with id - does-not-exist not found",
          })
        })

        it("should add rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch/update`,
            {
              rules: [
                {
                  id: standardPromotion.rules[0].id,
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              rules: expect.arrayContaining([
                expect.objectContaining({
                  operator: "eq",
                  attribute: "new_attr",
                  values: [expect.objectContaining({ value: "new value" })],
                }),
              ]),
            })
          )
        })
      })

      describe("GET /admin/promotions/rule-attribute-options/:ruleType", () => {
        it("should throw error when ruleType is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-attribute-options/does-not-exist`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid param rule_type (does-not-exist)",
          })
        })

        it("return all rule attributes for a valid ruleType", async () => {
          const response = await api.get(
            `/admin/promotions/rule-attribute-options/rules`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.attributes).toEqual([
            {
              id: "currency",
              label: "Currency code",
              required: true,
              value: "currency_code",
            },
            {
              id: "customer_group",
              label: "Customer Group",
              required: false,
              value: "customer_group.id",
            },
            {
              id: "region",
              label: "Region",
              required: false,
              value: "region.id",
            },
            {
              id: "country",
              label: "Country",
              required: false,
              value: "shipping_address.country_code",
            },
            {
              id: "sales_channel",
              label: "Sales Channel",
              required: false,
              value: "sales_channel.id",
            },
          ])
        })
      })

      describe("GET /admin/promotions/rule-operator-options", () => {
        it("return all rule operators", async () => {
          const response = await api.get(
            `/admin/promotions/rule-operator-options`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.operators).toEqual([
            {
              id: "in",
              label: "In",
              value: "in",
            },
            {
              id: "eq",
              label: "Equals",
              value: "eq",
            },
            {
              id: "ne",
              label: "Not In",
              value: "ne",
            },
          ])
        })
      })

      describe("GET /admin/promotions/rule-value-options/:ruleType/:ruleAttributeId", () => {
        it("should throw error when ruleType is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-value-options/does-not-exist/region`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid param rule_type (does-not-exist)",
          })
        })

        it("should throw error when ruleAttributeId is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-value-options/rules/does-not-exist`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid rule attribute - does-not-exist",
          })
        })

        it("should return all values based on rule types", async () => {
          const [region1, region2] = await regionService.create([
            { name: "North America", currency_code: "usd" },
            { name: "Europe", currency_code: "eur" },
          ])

          let response = await api.get(
            `/admin/promotions/rule-value-options/rules/region`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              {
                label: "North America",
                value: region1.id,
              },
              {
                label: "Europe",
                value: region2.id,
              },
            ])
          )

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/currency?limit=2&order=name`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Afghan Afghani", value: "afn" },
              { label: "Albanian Lek", value: "all" },
            ])
          )

          const group = await customerService.createCustomerGroup({
            name: "VIP",
          })

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/customer_group`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            {
              label: "VIP",
              value: group.id,
            },
          ])

          const salesChannel = await salesChannelService.create({
            name: "Instagram",
          })

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/sales_channel`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          // TODO: This is returning a default sales channel, but very flakily
          // Figure out why this happens and fix
          // expect(response.data.values.length).toEqual(1)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Instagram", value: salesChannel.id },
            ])
          )

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/country?limit=2`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              {
                label: "Andorra",
                value: "ad",
              },
              {
                label: "United Arab Emirates",
                value: "ae",
              },
            ])
          )

          const [product1, product2] = await productService.create([
            { title: "test product 1" },
            { title: "test product 2" },
          ])

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "test product 1", value: product1.id },
              { label: "test product 2", value: product2.id },
            ])
          )

          const category = await productService.createCategory({
            name: "test category 1",
            parent_category_id: null,
          })

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_category`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test category 1", value: category.id },
          ])

          const collection = await productService.createCollections({
            title: "test collection 1",
          })

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_collection`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test collection 1", value: collection.id },
          ])

          const type = await productService.createTypes({
            value: "test type",
          })

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_type`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test type", value: type.id },
          ])

          const [tag1, tag2] = await productService.createTags([
            { value: "test tag 1" },
            { value: "test tag 2" },
          ])

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_tag`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "test tag 1", value: tag1.id },
              { label: "test tag 2", value: tag2.id },
            ])
          )
        })
      })
    })
  },
})

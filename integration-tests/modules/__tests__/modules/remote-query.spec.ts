import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../..//helpers/create-admin-user"
import { adminHeaders } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Remote Query", () => {
      let appContainer
      let regionModule: IRegionModuleService
      let paymentModule: IPaymentModuleService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
        paymentModule = appContainer.resolve(ModuleRegistrationName.PAYMENT)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should fail to retrieve a single non-existing id", async () => {
        const region = await regionModule.create({
          name: "Test Region",
          currency_code: "usd",
          countries: ["us"],
        })

        const getRegion = await remoteQuery({
          region: {
            fields: ["id", "currency_code"],
            __args: {
              id: region.id,
            },
          },
        })

        expect(getRegion).toEqual([
          {
            id: region.id,
            currency_code: "usd",
          },
        ])

        const getNonExistingRegion = remoteQuery(
          {
            region: {
              fields: ["id", "currency_code"],
              __args: {
                id: "region_123",
              },
            },
          },
          undefined,
          { throwIfKeyNotFound: true }
        )

        expect(getNonExistingRegion).rejects.toThrow(
          "region id not found: region_123"
        )
      })

      it("should fail if a expected relation is not found", async () => {
        const region = await regionModule.create({
          name: "Test Region",
          currency_code: "usd",
          countries: ["us"],
        })

        const regionWithPayment = await regionModule.create({
          name: "Test W/ Payment",
          currency_code: "brl",
          countries: ["br"],
        })

        const regionNoLink = await regionModule.create({
          name: "No link",
          currency_code: "eur",
          countries: ["dk"],
        })

        await remoteLink.create([
          {
            [Modules.REGION]: {
              region_id: region.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: "pp_system_default_non_existent",
            },
          },
          {
            [Modules.REGION]: {
              region_id: regionWithPayment.id,
            },
            [Modules.PAYMENT]: {
              payment_provider_id: "pp_system_default", // default payment provider auto created
            },
          },
        ])

        // Validate all relations, including the link
        expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: regionNoLink.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            undefined,
            {
              throwIfRelationNotFound: true,
            }
          )
        ).rejects.toThrow(
          `regionRegionPaymentPaymentProviderLink region_id not found: ${regionNoLink.id}`
        )

        // Only validate the relations with Payment. It doesn't fail because the link didn't return any data
        expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: regionNoLink.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            undefined,
            {
              throwIfRelationNotFound: [Modules.PAYMENT],
            }
          )
        ).resolves.toHaveLength(1)

        // The link exists, but the payment doesn't
        expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: region.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            undefined,
            {
              throwIfRelationNotFound: [Modules.PAYMENT],
            }
          )
        ).rejects.toThrow(
          "payment id not found: pp_system_default_non_existent"
        )

        // everything is fine
        expect(
          remoteQuery(
            {
              region: {
                fields: ["id"],
                __args: {
                  id: regionWithPayment.id,
                },
                payment_providers: {
                  fields: ["id"],
                },
              },
            },
            undefined,
            {
              throwIfRelationNotFound: [Modules.PAYMENT],
            }
          )
        ).resolves.toHaveLength(1)
      })
    })
  },
})

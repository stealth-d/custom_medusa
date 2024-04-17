import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IStoreModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store - Admin", () => {
      let appContainer
      let service: IStoreModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(ModuleRegistrationName.STORE)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should correctly implement the entire lifecycle of a store", async () => {
        const createdStore = await service.create({
          name: "Test store",
          supported_currency_codes: ["usd"],
        })

        expect(createdStore).toEqual(
          expect.objectContaining({
            id: createdStore.id,
            supported_currency_codes: ["usd"],
            name: "Test store",
          })
        )

        const updated = await api.post(
          `/admin/stores/${createdStore.id}`,
          {
            name: "Updated store",
          },
          adminHeaders
        )

        expect(updated.status).toEqual(200)
        expect(updated.data.store).toEqual(
          expect.objectContaining({
            id: createdStore.id,
            name: "Updated store",
          })
        )

        await service.delete(createdStore.id)
        const listedStores = await api.get(`/admin/stores?id=${createdStore.id}`, adminHeaders)
        expect(listedStores.data.stores).toHaveLength(0)
      })
    })
  },
})

import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import adminSeeder from "../../../../helpers/admin-seeder"
import jwt from "jsonwebtoken"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /store/customers", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(
          ModuleRegistrationName.CUSTOMER
        )
      })

      beforeEach(async () => {
        await adminSeeder(dbConnection)
      })

      it("should create a customer", async () => {
        const authService: IAuthModuleService = appContainer.resolve(
          ModuleRegistrationName.AUTH
        )
        const { jwt_secret } =
          appContainer.resolve("configModule").projectConfig
        const authUser = await authService.create({
          entity_id: "store_user",
          provider: "emailpass",
          scope: "store",
        })

        const token = jwt.sign(authUser, jwt_secret)

        const response = await api.post(
          `/store/customers`,
          {
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          },
          { headers: { authorization: `Bearer ${token}` } }
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          })
        )
      })
    })
  },
})

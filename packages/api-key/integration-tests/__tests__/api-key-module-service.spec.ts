import crypto from "crypto"
import { Modules } from "@medusajs/modules-sdk"
import { IApiKeyModuleService } from "@medusajs/types"
import { ApiKeyType } from "@medusajs/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import {
  createSecretKeyFixture,
  createPublishableKeyFixture,
} from "../__fixtures__"

jest.setTimeout(100000)

const mockPublishableKeyBytes = () => {
  jest.spyOn(crypto, "randomBytes").mockImplementationOnce(() => {
    return Buffer.from(
      "44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
      "hex"
    )
  })
}

const mockSecretKeyBytes = () => {
  jest
    .spyOn(crypto, "randomBytes")
    .mockImplementationOnce(() => {
      return Buffer.from(
        "44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
        "hex"
      )
    })
    .mockImplementationOnce(() => {
      return Buffer.from("44de31ebcf085fa423fc584aa8540670", "hex")
    })
}

moduleIntegrationTestRunner({
  moduleName: Modules.API_KEY,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IApiKeyModuleService>) => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    describe("API Key Module Service", () => {
      describe("creating a publishable API key", () => {
        it("should create it successfully", async function () {
          mockPublishableKeyBytes()
          const apiKey = await service.create(createPublishableKeyFixture)

          expect(apiKey).toEqual(
            expect.objectContaining({
              title: "Test API Key",
              type: ApiKeyType.PUBLISHABLE,
              salt: undefined,
              created_by: "test",
              last_used_at: null,
              revoked_by: null,
              revoked_at: null,
              redacted: "pk_44d***3be",
              token:
                "pk_44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
            })
          )
        })
      })

      describe("creating a secret API key", () => {
        it("should get created successfully", async function () {
          mockSecretKeyBytes()
          const apiKey = await service.create(createSecretKeyFixture)

          expect(apiKey).toEqual(
            expect.objectContaining({
              title: "Secret key",
              type: ApiKeyType.SECRET,
              salt: undefined,
              created_by: "test",
              last_used_at: null,
              revoked_by: null,
              revoked_at: null,
              redacted: "sk_44d***3be",
              token:
                "sk_44de31ebcf085fa423fc584aa854067025e937a79edb565f472404345f0f23be",
            })
          )
        })

        it("should only allow creating one active token", async function () {
          expect(
            service.create([createSecretKeyFixture, createSecretKeyFixture])
          ).rejects.toThrow(
            "You can only create one secret key at a time. You tried to create 2 secret keys."
          )

          await service.create(createSecretKeyFixture)
          const err = await service
            .create(createSecretKeyFixture)
            .catch((e) => e)
          expect(err.message).toEqual(
            "You can only have one active secret key a time. Revoke or delete your existing key before creating a new one."
          )
        })

        it("should allow for at most two tokens, where one is revoked", async function () {
          const firstApiKey = await service.create(createSecretKeyFixture)
          await service.revoke(
            { id: firstApiKey.id },
            {
              revoked_by: "test",
            }
          )

          await service.create(createSecretKeyFixture)
          const err = await service
            .create(createSecretKeyFixture)
            .catch((e) => e)
          expect(err.message).toEqual(
            "You can only have one active secret key a time. Revoke or delete your existing key before creating a new one."
          )
        })
      })

      describe("revoking API keys", () => {
        it("should have the revoked at and revoked by set when a key is revoked", async function () {
          const firstApiKey = await service.create(createSecretKeyFixture)
          const revokedKey = await service.revoke(firstApiKey.id, {
            revoked_by: "test",
          })

          expect(revokedKey).toEqual(
            expect.objectContaining({
              revoked_by: "test",
              revoked_at: expect.any(Date),
            })
          )
        })

        it("should be able to revoke a key in the future", async function () {
          const now = Date.parse("2021-01-01T00:00:00Z")
          const hourInSec = 3600
          jest.useFakeTimers().setSystemTime(now)

          const createdKey = await service.create(createSecretKeyFixture)
          const revokedKey = await service.revoke(createdKey.id, {
            revoked_by: "test",
            revoke_in: hourInSec,
          })

          expect(revokedKey).toEqual(
            expect.objectContaining({
              revoked_by: "test",
              revoked_at: new Date(now + hourInSec * 1000),
            })
          )

          jest.useRealTimers()
        })

        it("should do nothing if the revokal list is empty", async function () {
          const firstApiKey = await service.create(createSecretKeyFixture)
          let revokedKeys = await service.revoke([])
          expect(revokedKeys).toHaveLength(0)

          const apiKey = await service.retrieve(firstApiKey.id)
          expect(apiKey.revoked_at).toBeFalsy()
          expect(apiKey.revoked_by).toBeFalsy()
        })

        it("should not allow revoking an already revoked API key", async function () {
          const firstApiKey = await service.create(createSecretKeyFixture)
          await service.revoke(firstApiKey.id, {
            revoked_by: "test",
          })

          const err = await service
            .revoke(firstApiKey.id, {
              revoked_by: "test2",
            })
            .catch((e) => e)

          expect(err.message).toEqual(
            `There are 1 secret keys that are already revoked.`
          )
        })
      })

      describe("updating an API key", () => {
        it("should update the name successfully", async function () {
          const createdApiKey = await service.create(createSecretKeyFixture)

          const updatedApiKey = await service.update(createdApiKey.id, {
            title: "New Name",
          })
          expect(updatedApiKey.title).toEqual("New Name")
        })

        it("should not reflect any updates on other fields", async function () {
          const createdApiKey = await service.create(createSecretKeyFixture)

          const updatedApiKey = await service.update(createdApiKey.id, {
            title: createdApiKey.title,
            revoked_by: "test",
            revoked_at: new Date(),
            last_used_at: new Date(),
          })

          // These should not be returned on an update
          createdApiKey.token = ""
          expect(createdApiKey).toEqual(updatedApiKey)
        })
      })

      describe("deleting API keys", () => {
        it("should successfully delete existing api keys", async function () {
          const createdApiKeys = await service.create([
            createPublishableKeyFixture,
            createSecretKeyFixture,
          ])
          await service.delete([createdApiKeys[0].id, createdApiKeys[1].id])

          const apiKeysInDatabase = await service.list()
          expect(apiKeysInDatabase).toHaveLength(0)
        })
      })

      describe("authenticating with API keys", () => {
        it("should authenticate a secret key successfully", async function () {
          const createdApiKey = await service.create(createSecretKeyFixture)
          const authenticated = await service.authenticate(createdApiKey.token)

          expect(authenticated).toBeTruthy()
          expect(authenticated.title).toEqual(createSecretKeyFixture.title)
        })
        it("should authenticate with a token to be revoked in the future", async function () {
          const createdApiKey = await service.create(createSecretKeyFixture)

          // We simulate setting the revoked_at in the future here
          jest.useFakeTimers().setSystemTime(new Date().setFullYear(3000))
          await service.revoke(createdApiKey.id, {
            revoked_by: "test",
          })
          jest.useRealTimers()

          const authenticated = await service.authenticate(createdApiKey.token)
          expect(authenticated).toBeTruthy()
          expect(authenticated.title).toEqual(createdApiKey.title)
        })

        it("should not authenticate a publishable key", async function () {
          const createdApiKey = await service.create(
            createPublishableKeyFixture
          )
          const authenticated = await service.authenticate(createdApiKey.token)

          expect(authenticated).toBeFalsy()
        })
        it("should not authenticate with a non-existent token", async function () {
          const createdApiKey = await service.create(createSecretKeyFixture)
          const authenticated = await service.authenticate("some-token")

          expect(authenticated).toBeFalsy()
        })
        it("should not authenticate with a revoked token", async function () {
          const createdApiKey = await service.create(createSecretKeyFixture)
          await service.revoke(createdApiKey.id, {
            revoked_by: "test",
          })
          const authenticated = await service.authenticate(createdApiKey.token)

          expect(authenticated).toBeFalsy()
        })
      })

      describe("retrieving API keys", () => {
        it("should successfully return all existing api keys", async function () {
          await service.create([
            createPublishableKeyFixture,
            createSecretKeyFixture,
          ])

          const apiKeysInDatabase = await service.list()
          expect(apiKeysInDatabase).toHaveLength(2)
        })

        it("should only return keys with matching token", async function () {
          const created = await service.create([
            createPublishableKeyFixture,
            createPublishableKeyFixture,
          ])

          const apiKeysInDatabase = await service.list({
            token: created[0].token,
          })
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toEqual(created[0].token)
        })

        it("should not return the token and salt for secret keys when listing", async function () {
          await service.create([createSecretKeyFixture])

          const apiKeysInDatabase = await service.list()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeFalsy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should return the token for publishable keys when listing", async function () {
          await service.create([createPublishableKeyFixture])

          const apiKeysInDatabase = await service.list()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeTruthy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should not return the token and salt for secret keys when listing and counting", async function () {
          await service.create([createSecretKeyFixture])

          const [apiKeysInDatabase] = await service.listAndCount()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeFalsy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should return the token for publishable keys when listing and counting", async function () {
          await service.create([createPublishableKeyFixture])

          const [apiKeysInDatabase] = await service.listAndCount()
          expect(apiKeysInDatabase).toHaveLength(1)
          expect(apiKeysInDatabase[0].token).toBeTruthy()
          expect(apiKeysInDatabase[0].salt).toBeFalsy()
        })

        it("should not return the token and salt for secret keys when retrieving", async function () {
          const [createdApiKey] = await service.create([createSecretKeyFixture])

          const apiKeyInDatabase = await service.retrieve(createdApiKey.id)
          expect(apiKeyInDatabase.token).toBeFalsy()
          expect(apiKeyInDatabase.salt).toBeFalsy()
        })

        it("should return the token for publishable keys when retrieving", async function () {
          const [createdApiKey] = await service.create([
            createPublishableKeyFixture,
          ])

          const apiKeyInDatabase = await service.retrieve(createdApiKey.id)
          expect(apiKeyInDatabase.token).toBeTruthy()
          expect(apiKeyInDatabase.salt).toBeFalsy()
        })
      })
    })
  },
})

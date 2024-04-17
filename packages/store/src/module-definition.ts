import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { StoreModuleService } from "@services"
import { Modules } from "@medusajs/modules-sdk"
import * as Models from "@models"
import * as ModuleModels from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleRepositories from "@repositories"

const migrationScriptOptions = {
  moduleName: Modules.STORE,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.STORE,
  moduleModels: Object.values(Models),
  migrationsPath: __dirname + "/migrations",
})

const service = StoreModuleService
const loaders = [containerLoader, connectionLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}

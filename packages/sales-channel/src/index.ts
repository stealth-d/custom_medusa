import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

import * as SalesChannelModels from "@models"

import { moduleDefinition } from "./module-definition"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.SALES_CHANNEL,
  models: SalesChannelModels,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export * from "./initialize"
export * from "./types"
export * from "./loaders"
export * from "./models"
export * from "./services"

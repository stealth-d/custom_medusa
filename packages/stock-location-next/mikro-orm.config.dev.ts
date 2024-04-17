import * as entities from "./src/models"

import { TSMigrationGenerator } from "@medusajs/utils"

module.exports = {
  entities: Object.values(entities),
  schema: "public",
  clientUrl: "postgres://postgres@localhost/medusa-stock-location",
  type: "postgresql",
  migrations: {
    generator: TSMigrationGenerator,
  },
}

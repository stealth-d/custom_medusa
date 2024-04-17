import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultStoreRegionFields } from "./query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { filters: req.filterableFields }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables,
    fields: defaultStoreRegionFields,
  })

  // TODO: Add count, offset, limit
  const regions = await remoteQuery(queryObject)

  res.json({ regions })
}

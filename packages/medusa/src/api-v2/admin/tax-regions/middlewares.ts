import * as QueryConfig from "./query-config"

import {
  AdminCreateTaxRegion,
  AdminGetTaxRegionParams,
  AdminGetTaxRegionsParams,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

export const adminTaxRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/tax-regions*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: "POST",
    matcher: "/admin/tax-regions",
    middlewares: [
      validateAndTransformBody(AdminCreateTaxRegion),
      validateAndTransformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-regions",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: "GET",
    matcher: "/admin/tax-regions/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import {
  AdminCreateShippingOption,
  AdminGetShippingOptionParams,
  AdminGetShippingOptionsParams,
  AdminShippingOptionRulesBatchAdd,
  AdminShippingOptionRulesBatchRemove,
  AdminUpdateShippingOption,
} from "./validators"
import {
  listTransformQueryConfig,
  retrieveTransformQueryConfig,
} from "./query-config"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

export const adminShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-options*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionsParams,
        listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformBody(AdminCreateShippingOption),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateShippingOption),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-options/:id",
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch/add",
    middlewares: [
      validateAndTransformBody(AdminShippingOptionRulesBatchAdd),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch/remove",
    middlewares: [
      validateAndTransformBody(AdminShippingOptionRulesBatchRemove),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
]

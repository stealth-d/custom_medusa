import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminCreateSalesChannel,
  AdminGetSalesChannelParams,
  AdminGetSalesChannelsParams,
  AdminSetSalesChannelProductsBatch,
  AdminUpdateSalesChannel,
} from "./validators"

export const adminSalesChannelRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/sales-channels*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels",
    middlewares: [
      validateAndTransformQuery(
        AdminGetSalesChannelsParams,
        QueryConfig.listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "sales_channel_location",
        resourceId: "sales_channel_id",
        filterableField: "location_id",
      }),
      maybeApplyLinkFilter({
        entryPoint: "publishable_api_key_sales_channel",
        resourceId: "sales_channel_id",
        filterableField: "publishable_key_id",
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels",
    middlewares: [
      validateAndTransformBody(AdminCreateSalesChannel),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateSalesChannel),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/sales-channels/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id/products/batch/add",
    middlewares: [
      validateAndTransformBody(AdminSetSalesChannelProductsBatch),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-channels/:id/products/batch/remove",
    middlewares: [
      validateAndTransformBody(AdminSetSalesChannelProductsBatch),
      validateAndTransformQuery(
        AdminGetSalesChannelParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]

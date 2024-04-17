import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetSalesChannelParamsType = z.infer<
  typeof AdminGetSalesChannelParams
>
export const AdminGetSalesChannelParams = createSelectParams()

export type AdminGetSalesChannelsParamsType = z.infer<
  typeof AdminGetSalesChannelsParams
>
export const AdminGetSalesChannelsParams = createFindParams({
  limit: 20,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    description: z.string().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
    location_id: z.union([z.string(), z.array(z.string())]).optional(),
    publishable_key_id: z.union([z.string(), z.array(z.string())]).optional(),
    $and: z.lazy(() => AdminGetSalesChannelsParams.array()).optional(),
    $or: z.lazy(() => AdminGetSalesChannelsParams.array()).optional(),
  })
)

export type AdminCreateSalesChannelType = z.infer<
  typeof AdminCreateSalesChannel
>
export const AdminCreateSalesChannel = z.object({
  name: z.string(),
  description: z.string().optional(),
  is_disabled: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminUpdateSalesChannelType = z.infer<
  typeof AdminUpdateSalesChannel
>
export const AdminUpdateSalesChannel = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  is_disabled: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminSetSalesChannelProductsBatchType = z.infer<
  typeof AdminSetSalesChannelProductsBatch
>
export const AdminSetSalesChannelProductsBatch = z.object({
  product_ids: z.array(z.string()),
})

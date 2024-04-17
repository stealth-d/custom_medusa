import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export const AdminCustomerParams = createSelectParams()
export const AdminCustomerGroupParams = createSelectParams()

export const AdminCustomerGroupInCustomerParams = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export const AdminCustomersParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string())]).optional(),
    email: z.union([z.string(), z.array(z.string())]).optional(),
    groups: z
      .union([
        AdminCustomerGroupInCustomerParams,
        z.string(),
        z.array(z.string()),
      ])
      .optional(),
    company_name: z.union([z.string(), z.array(z.string())]).optional(),
    first_name: z.union([z.string(), z.array(z.string())]).optional(),
    last_name: z.union([z.string(), z.array(z.string())]).optional(),
    created_by: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional().optional(),
    updated_at: createOperatorMap().optional().optional(),
    deleted_at: createOperatorMap().optional().optional(),
    $and: z.lazy(() => AdminCustomersParams.array()).optional(),
    $or: z.lazy(() => AdminCustomersParams.array()).optional(),
  })
)

export const AdminCreateCustomer = z.object({
  email: z.string().email().optional(),
  company_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
})

export const AdminUpdateCustomer = z.object({
  email: z.string().email().nullable().optional(),
  company_name: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
})

export const AdminCreateCustomerAddress = z.object({
  address_name: z.string().optional(),
  is_default_shipping: z.boolean().optional(),
  is_default_billing: z.boolean().optional(),
  company: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  city: z.string().optional(),
  country_code: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminUpdateCustomerAddress = AdminCreateCustomerAddress

export const AdminCustomerAdressesParams = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    address_name: z.union([z.string(), z.array(z.string())]).optional(),
    is_default_shipping: z.boolean().optional(),
    is_default_billing: z.boolean().optional(),
    company: z.union([z.string(), z.array(z.string())]).optional(),
    first_name: z.union([z.string(), z.array(z.string())]).optional(),
    last_name: z.union([z.string(), z.array(z.string())]).optional(),
    address_1: z.union([z.string(), z.array(z.string())]).optional(),
    address_2: z.union([z.string(), z.array(z.string())]).optional(),
    city: z.union([z.string(), z.array(z.string())]).optional(),
    country_code: z.union([z.string(), z.array(z.string())]).optional(),
    province: z.union([z.string(), z.array(z.string())]).optional(),
    postal_code: z.union([z.string(), z.array(z.string())]).optional(),
    phone: z.union([z.string(), z.array(z.string())]).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
)

export type AdminCustomerParamsType = z.infer<typeof AdminCustomerParams>
export type AdminCustomerGroupParamsType = z.infer<
  typeof AdminCustomerGroupParams
>
export type AdminCustomerGroupInCustomerParamsType = z.infer<
  typeof AdminCustomerGroupInCustomerParams
>
export type AdminCustomersParamsType = z.infer<typeof AdminCustomersParams>
export type AdminCreateCustomerType = z.infer<typeof AdminCreateCustomer>
export type AdminUpdateCustomerType = z.infer<typeof AdminUpdateCustomer>
export type AdminCreateCustomerAddressType = z.infer<
  typeof AdminCreateCustomerAddress
>

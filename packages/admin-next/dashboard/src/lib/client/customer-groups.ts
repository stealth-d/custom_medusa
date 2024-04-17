import {
  AdminCustomerGroupListResponse,
  AdminCustomerGroupResponse,
} from "@medusajs/types"
import { z } from "zod"
import { CreateCustomerGroupSchema } from "../../v2-routes/customer-groups/customer-group-create/components/create-customer-group-form"
import { EditCustomerGroupSchema } from "../../v2-routes/customer-groups/customer-group-edit/components/edit-customer-group-form"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveCustomerGroup(id: string, query?: Record<string, any>) {
  return getRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups/${id}`,
    query
  )
}

async function listCustomerGroups(query?: Record<string, any>) {
  return getRequest<AdminCustomerGroupListResponse>(
    `/admin/customer-groups`,
    query
  )
}

async function createCustomerGroup(
  payload: z.infer<typeof CreateCustomerGroupSchema>
) {
  return postRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups`,
    payload
  )
}

async function updateCustomerGroup(
  id: string,
  payload: z.infer<typeof EditCustomerGroupSchema>
) {
  return postRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups/${id}`,
    payload
  )
}

async function deleteCustomerGroup(id: string) {
  return deleteRequest<{
    id: string
    deleted: boolean
    object: "customer-group"
  }>(`/admin/customer-groups/${id}`)
}

async function batchAddCustomers(
  id: string,
  payload: { customer_ids: { id: string }[] }
) {
  return postRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups/${id}/customers/batch/add`,
    payload
  )
}

async function batchRemoveCustomers(
  id: string,
  payload: { customer_ids: { id: string }[] }
) {
  return postRequest<AdminCustomerGroupResponse>(
    `/admin/customer-groups/${id}/customers/batch/remove`,
    payload
  )
}

export const customerGroups = {
  retrieve: retrieveCustomerGroup,
  list: listCustomerGroups,
  create: createCustomerGroup,
  update: updateCustomerGroup,
  delete: deleteCustomerGroup,
  addCustomers: batchAddCustomers,
  removeCustomers: batchRemoveCustomers,
}

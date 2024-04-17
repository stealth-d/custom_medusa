import { createOrdersWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  OrderStatus,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminPostDraftOrdersReq } from "./validators"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        ...req.filterableFields,
        is_draft_order: true,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: draft_orders, metadata } = await remoteQuery(queryObject)

  res.json({
    draft_orders,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostDraftOrdersReq>,
  res: MedusaResponse
) => {
  const input = req.validatedBody
  const workflowInput = {
    ...input,
    no_notification: !!input.no_notification_order,
    status: OrderStatus.DRAFT,
    is_draft_order: true,
  }

  if (!input.currency_code) {
    const regionService = req.scope.resolve(ModuleRegistrationName.REGION)
    const region = await regionService.retrieve(input.region_id)
    input.currency_code = region.currency_code
  }

  if (!input.email) {
    const customerService = req.scope.resolve(ModuleRegistrationName.CUSTOMER)
    const customer = await customerService.retrieve(input.customer_id)
    input.email = customer.email
  }

  const { result, errors } = await createOrdersWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        id: result.id,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const draftOrder = await remoteQuery(queryObject)

  res.status(200).json({ draft_order: draftOrder[0] })
}

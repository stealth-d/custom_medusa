import {
  deleteSalesChannelsWorkflow,
  updateSalesChannelsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  AdminGetSalesChannelParamsType,
  AdminUpdateSalesChannelType,
} from "../validators"
import { refetchSalesChannel } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetSalesChannelParamsType>,
  res: MedusaResponse
) => {
  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ sales_channel: salesChannel })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateSalesChannelType>,
  res: MedusaResponse
) => {
  const { errors } = await updateSalesChannelsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ sales_channel: salesChannel })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { errors } = await deleteSalesChannelsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "sales-channel",
    deleted: true,
  })
}

import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { SalesChannelDTO } from "@medusajs/types"
import { associateLocationsWithChannelStep } from "../steps"

interface WorkflowInput {
  data: {
    sales_channel_id: string
    location_ids: string[]
  }[]
}

export const addLocationsToSalesChannelWorkflowId =
  "add-locations-to-sales-channel"
export const addLocationsToSalesChannelWorkflow = createWorkflow(
  addLocationsToSalesChannelWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<SalesChannelDTO[]> => {
    return associateLocationsWithChannelStep({ links: input.data })
  }
)

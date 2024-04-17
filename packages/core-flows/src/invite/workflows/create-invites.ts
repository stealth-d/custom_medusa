import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createInviteStep } from "../steps"
import { InviteDTO, InviteWorkflow } from "@medusajs/types"

export const createInvitesWorkflowId = "create-invite-step"
export const createInvitesWorkflow = createWorkflow(
  createInvitesWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.CreateInvitesWorkflowInputDTO>
  ): WorkflowData<InviteDTO[]> => {
    return createInviteStep(input.invites)
  }
)

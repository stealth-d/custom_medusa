import { InviteWorkflow, UserDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { createUsersStep } from "../../user"
import { deleteInvitesStep } from "../steps"
import { validateTokenStep } from "../steps/validate-token"

export const acceptInviteWorkflowId = "accept-invite-workflow"
export const acceptInviteWorkflow = createWorkflow(
  acceptInviteWorkflowId,
  (
    input: WorkflowData<InviteWorkflow.AcceptInviteWorkflowInputDTO>
  ): WorkflowData<UserDTO[]> => {
    const invite = validateTokenStep(input.invite_token)

    const createUserInput = transform(
      { input, invite },
      ({ input, invite }) => {
        return [
          {
            ...input.user,
            email: input.user.email ?? invite.email,
          },
        ]
      }
    )

    const users = createUsersStep(createUserInput)

    const authUserInput = transform({ input, users }, ({ input, users }) => {
      const createdUser = users[0]

      return {
        authUserId: input.auth_user_id,
        key: "user_id",
        value: createdUser.id,
      }
    })

    setAuthAppMetadataStep(authUserInput)

    deleteInvitesStep([invite.id])

    return users
  }
)

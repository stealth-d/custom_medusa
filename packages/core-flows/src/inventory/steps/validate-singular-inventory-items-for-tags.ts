import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { InventoryNext } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

export const validateInventoryItemsForCreateStepId =
  "validate-inventory-items-for-create-step"
export const validateInventoryItemsForCreate = createStep(
  validateInventoryItemsForCreateStepId,
  async (
    input: {
      tag?: string
    }[],
    { container }
  ) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkService = remoteLink.getLinkModule(
      Modules.PRODUCT,
      "variant_id",
      Modules.INVENTORY,
      "inventory_item_id"
    )

    const existingItems = await linkService.list(
      { variant_id: input.map((i) => i.tag) },
      { select: ["variant_id", "inventory_item_id"] }
    )

    if (existingItems.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Inventory items already exist for variants with ids: " +
          existingItems.map((i) => i.variant_id).join(", ")
      )
    }

    return new StepResponse(input)
  }
)

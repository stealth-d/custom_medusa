import { CreatePriceListPricesWorkflowDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import {
  createPriceListPricesStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

export const createPriceListPricesWorkflowId = "create-price-list-prices"
export const createPriceListPricesWorkflow = createWorkflow(
  createPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: CreatePriceListPricesWorkflowDTO[]
    }>
  ): WorkflowData<void> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    createPriceListPricesStep({
      data: input.data,
      variant_price_map: variantPriceMap,
    })
  }
)

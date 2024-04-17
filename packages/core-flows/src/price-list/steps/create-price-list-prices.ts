import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddPriceListPricesDTO,
  CreatePriceListPriceDTO,
  CreatePriceListPricesWorkflowStepDTO,
  IPricingModuleService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createPriceListPricesStepId = "create-price-list-prices"
export const createPriceListPricesStep = createStep(
  createPriceListPricesStepId,
  async (stepInput: CreatePriceListPricesWorkflowStepDTO, { container }) => {
    const { data, variant_price_map: variantPriceSetMap } = stepInput
    const priceListPricesToCreate: AddPriceListPricesDTO[] = []
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    for (const createPriceListPricesData of data) {
      const { prices = [], id } = createPriceListPricesData
      const pricesToAdd: CreatePriceListPriceDTO[] = []

      for (const price of prices) {
        pricesToAdd.push({
          ...price,
          price_set_id: variantPriceSetMap[price.variant_id!],
        })
      }

      if (pricesToAdd.length) {
        priceListPricesToCreate.push({
          price_list_id: id,
          prices: pricesToAdd,
        })
      }
    }

    const createdPrices = await pricingModule.addPriceListPrices(
      priceListPricesToCreate
    )

    return new StepResponse(
      null,
      createdPrices.map((p) => p.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    if (createdIds.length) {
      await pricingModule.removePrices(createdIds)
    }
  }
)

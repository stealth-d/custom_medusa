import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CustomerGroupUpdatableFields,
  FilterableCustomerGroupProps,
  ICustomerModuleService,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type UpdateCustomerGroupStepInput = {
  selector: FilterableCustomerGroupProps
  update: CustomerGroupUpdatableFields
}

export const updateCustomerGroupStepId = "update-customer-groups"
export const updateCustomerGroupsStep = createStep(
  updateCustomerGroupStepId,
  async (data: UpdateCustomerGroupStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
    const prevCustomerGroups = await service.listCustomerGroups(data.selector, {
      select: selects,
      relations,
    })

    const customers = await service.updateCustomerGroups(
      data.selector,
      data.update
    )

    return new StepResponse(customers, prevCustomerGroups)
  },
  async (prevCustomerGroups, { container }) => {
    if (!prevCustomerGroups) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await promiseAll(
      prevCustomerGroups.map((c) =>
        service.updateCustomerGroups(c.id, {
          name: c.name,
        })
      )
    )
  }
)

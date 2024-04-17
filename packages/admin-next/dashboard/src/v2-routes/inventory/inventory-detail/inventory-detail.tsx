import { Outlet, json, useLoaderData, useParams } from "react-router-dom"

import { InventoryItemAttributeSection } from "./components/inventory-item-attributes/attributes-section"
import { InventoryItemGeneralSection } from "./components/inventory-item-general-section"
import { InventoryItemLocationLevelsSection } from "./components/inventory-item-location-levels"
import { InventoryItemReservationsSection } from "./components/inventory-item-reservations"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { inventoryItemLoader } from "./loader"
import { useInventoryItem } from "../../../hooks/api/inventory"

export const InventoryDeatil = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof inventoryItemLoader>
  >

  const { inventory_item, isLoading, isError, error } = useInventoryItem(
    id!,
    {},
    {
      initialData,
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !inventory_item) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start">
        <div className="w-full flex flex-col gap-y-2">
          <InventoryItemGeneralSection inventoryItem={inventory_item} />
          <InventoryItemLocationLevelsSection inventoryItem={inventory_item} />
          <InventoryItemReservationsSection inventoryItem={inventory_item} />
          <div className="hidden lg:block">
            <JsonViewSection data={inventory_item} />
          </div>
          <Outlet />
        </div>
        <div className="w-full lg:max-w-[400px] max-w-[100%] mt-2 lg:mt-0 flex flex-col gap-y-2">
          <InventoryItemAttributeSection inventoryItem={inventory_item} />
          <div className="lg:hidden">
            <JsonViewSection data={inventory_item} />
          </div>
        </div>
      </div>
    </div>
  )
}

import { Container, Heading } from "@medusajs/ui"

import { DataTable } from "../../../../components/table/data-table"
import { InventoryNext } from "@medusajs/types"
import { useDataTable } from "../../../../hooks/use-data-table"
import { useInventoryItems } from "../../../../hooks/api/inventory"
import { useInventoryTableColumns } from "./use-inventory-table-columns"
import { useInventoryTableFilters } from "./use-inventory-table-filters"
import { useInventoryTableQuery } from "./use-inventory-table-query"
import { useTranslation } from "react-i18next"

const PAGE_SIZE = 20

export const InventoryListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useInventoryTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { inventory_items, count, isLoading, isError, error } =
    useInventoryItems({
      ...searchParams,
    })

  const filters = useInventoryTableFilters()
  const columns = useInventoryTableColumns()

  const { table } = useDataTable({
    data: (inventory_items ?? []) as InventoryNext.InventoryItemDTO[],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("inventory.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        isLoading={isLoading}
        pagination
        search
        filters={filters}
        queryObject={raw}
        orderBy={["title", "sku", "stocked_quantity", "reserved_quantity"]}
        navigateTo={(row) => `${row.id}`}
      />
    </Container>
  )
}

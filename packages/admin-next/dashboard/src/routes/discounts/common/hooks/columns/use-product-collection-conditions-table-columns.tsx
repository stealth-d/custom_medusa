import { useTranslation } from "react-i18next"
import { useMemo } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { ProductCollection } from "@medusajs/medusa"
import { Checkbox } from "@medusajs/ui"

const columnHelper = createColumnHelper<ProductCollection>()

export const useProductCollectionConditionsTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      columnHelper.accessor("title", {
        header: t("fields.title"),
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => `/${getValue()}`,
      }),
      columnHelper.accessor("products", {
        header: t("fields.products"),
        cell: ({ getValue }) => {
          const count = getValue()?.length

          return <span>{count || "-"}</span>
        },
      }),
    ],
    [t]
  )
}

import { Trash } from "@medusajs/icons"
import { AdminTaxRegionResponse } from "@medusajs/types"
import { Button, Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useDeleteTaxRegion,
  useTaxRegions,
} from "../../../../../hooks/api/tax-regions"
import { useTaxRegionTableQuery } from "../../../../../hooks/table/query/use-tax-region-table-query copy"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { getCountryByIso2 } from "../../../../../lib/countries"

const PAGE_SIZE = 20

export const TaxRegionListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRegionTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { tax_regions, count, isLoading, isError, error } = useTaxRegions({
    ...searchParams,
    parent_id: "null",
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: tax_regions ?? [],
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
        <Heading level="h2">{t("taxes.domain")}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="/settings/taxes/create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        navigateTo={(row) => `${row.original.id}`}
        pagination
        queryObject={raw}
      />
    </Container>
  )
}

const TaxRegionActions = ({
  taxRegion,
}: {
  taxRegion: AdminTaxRegionResponse["tax_region"]
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync } = useDeleteTaxRegion(taxRegion.id)

  const handleDelete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/settings/taxes", { replace: true })
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<AdminTaxRegionResponse["tax_region"]>()

const useColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("country_code", {
        header: t("fields.country"),
        cell: ({ getValue }) => {
          const countryCode = getValue()
          const displayName =
            getCountryByIso2(countryCode)?.display_name || countryCode

          return (
            <div className="flex size-full items-center">
              <span className="truncate">{displayName}</span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <TaxRegionActions taxRegion={row.original as any} />
        },
      }),
    ],
    [t]
  )
}

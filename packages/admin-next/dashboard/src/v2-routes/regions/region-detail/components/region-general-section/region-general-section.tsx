import { PencilSquare, Trash } from "@medusajs/icons"
import { RegionDTO } from "@medusajs/types"
import { Badge, Container, Heading, Text, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatProvider } from "../../../../../lib/format-provider"
import { currencies } from "../../../../../lib/currencies"
import { useDeleteRegion } from "../../../../../hooks/api/regions.tsx"
import { ListSummary } from "../../../../../components/common/list-summary"
import { useNavigate } from "react-router-dom"

type RegionGeneralSectionProps = {
  region: RegionDTO
}

export const RegionGeneralSection = ({ region }: RegionGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{region.name}</Heading>
        <RegionActions region={region} />
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.currency")}
        </Text>
        <div className="flex items-center gap-x-2">
          <Badge size="2xsmall" className="uppercase">
            {region.currency_code}
          </Badge>
          <Text size="small" leading="compact">
            {currencies[region.currency_code.toUpperCase()].name}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.paymentProviders")}
        </Text>
        <div className="inline-flex">
          {region.payment_providers?.length > 0 ? (
            <ListSummary
              list={region.payment_providers.map((p) => formatProvider(p.id))}
            />
          ) : (
            "-"
          )}
        </div>
      </div>
    </Container>
  )
}

const RegionActions = ({ region }: { region: RegionDTO }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutateAsync } = useDeleteRegion(region.id)
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.deleteRegionWarning", {
        name: region.name,
      }),
      verificationText: region.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined)
    navigate("/settings/regions", { replace: true })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/regions/${region.id}/edit`,
            },
          ],
        },
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

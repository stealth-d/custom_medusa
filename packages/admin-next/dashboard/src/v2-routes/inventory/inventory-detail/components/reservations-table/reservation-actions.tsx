import { PencilSquare, Trash } from "@medusajs/icons"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { InventoryNext } from "@medusajs/types"
import { useDeleteReservationItem } from "../../../../../hooks/api/inventory"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const ReservationActions = ({
  reservation,
}: {
  reservation: InventoryNext.ReservationItemDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteReservationItem(reservation.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("inventory.deleteWarning"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/reservation/${reservation.id}/edit`,
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

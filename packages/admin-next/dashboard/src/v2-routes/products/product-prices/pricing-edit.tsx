import { useUpdateProductVariant } from "../../../hooks/api/products"
import { RouteFocusModal, useRouteModal } from "../../../components/route-modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExtendedProductDTO } from "../../../types/api-responses"
import { VariantPricingForm } from "../common/variant-pricing-form"
import { normalizeVariants } from "../product-create/schema"
import { Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

export const UpdateVariantPricesSchema = zod.object({
  variants: zod.array(
    zod.object({
      prices: zod.record(zod.string(), zod.string()).optional(),
    })
  ),
})

export type UpdateVariantPricesSchemaType = zod.infer<
  typeof UpdateVariantPricesSchema
>

export const PricingEdit = ({ product }: { product: ExtendedProductDTO }) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const form = useForm<UpdateVariantPricesSchemaType>({
    defaultValues: {
      variants: product.variants.map((variant: any) => ({
        prices: variant.prices.reduce((acc: any, price: any) => {
          acc[price.currency_code] = price.amount
          return acc
        }, {}),
      })) as any,
    },

    resolver: zodResolver(UpdateVariantPricesSchema, {}),
  })

  // TODO: Add batch update method here
  const { mutateAsync, isLoading } = useUpdateProductVariant(product.id, "")

  const handleSubmit = form.handleSubmit(
    async (values) => {
      const reqData = { variants: normalizeVariants(values.variants) }
      await mutateAsync(reqData, {
        onSuccess: () => {
          handleSuccess(`../${product.id}`)
        },
      })
    },
    (err) => {
      console.log(err)
    }
  )

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex w-full items-center justify-end gap-x-2">
            <div className="flex items-center gap-x-4">
              <RouteFocusModal.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                type="submit"
                variant="primary"
                size="small"
                isLoading={isLoading}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body>
          <VariantPricingForm form={form as any} />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

import { useParams } from "react-router-dom"

import { useProduct } from "../../../hooks/api/products"
import { PricingEdit } from "./pricing-edit"
import { RouteFocusModal } from "../../../components/route-modal"

export const ProductPrices = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && <PricingEdit product={product} />}
    </RouteFocusModal>
  )
}

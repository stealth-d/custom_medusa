import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCustomerGroup } from "../../../hooks/api/customer-groups"
import { CustomerGroupCustomerSection } from "./components/customer-group-customer-section"
import { CustomerGroupGeneralSection } from "./components/customer-group-general-section"
import { customerGroupLoader } from "./loader"

export const CustomerGroupDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerGroupLoader>
  >

  const { id } = useParams()
  const { customer_group, isLoading, isError, error } = useCustomerGroup(
    id!,
    {
      fields: "+customers.id",
    },
    { initialData }
  )

  if (isLoading || !customer_group) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <CustomerGroupGeneralSection group={customer_group} />
      <CustomerGroupCustomerSection group={customer_group} />
      <JsonViewSection data={customer_group} />
      <Outlet />
    </div>
  )
}

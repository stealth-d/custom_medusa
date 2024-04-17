import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const CartCustomer: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      relationship: {
        serviceName: Modules.CUSTOMER,
        primaryKey: "id",
        foreignKey: "customer_id",
        alias: "customer",
      },
    },
    {
      serviceName: Modules.CUSTOMER,
      relationship: {
        serviceName: Modules.CART,
        primaryKey: "customer_id",
        foreignKey: "id",
        alias: "carts",
        isList: true,
      },
    },
  ],
}

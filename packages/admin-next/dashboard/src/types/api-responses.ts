/**
 * Temporary types for API responses until we export them from `@medusajs/types`
 */

import {
  CampaignDTO,
  CurrencyDTO,
  CustomerGroupDTO,
  InventoryNext,
  InviteDTO,
  PaymentProviderDTO,
  PriceListDTO,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductTypeDTO,
  ProductVariantDTO,
  PromotionDTO,
  RegionDTO,
  SalesChannelDTO,
  ShippingOptionDTO,
  ShippingProfileDTO,
  StockLocationAddressDTO,
  StockLocationDTO,
  StoreDTO,
  UserDTO,
} from "@medusajs/types"

import { ProductTagDTO } from "@medusajs/types/dist/product"
import { WorkflowExecutionDTO } from "../v2-routes/workflow-executions/types"

type ListRes = {
  count: number
  offset: number
  limit: number
}

type DeleteRes = {
  id: string
  object: string
  deleted: true
}

// Auth
export type EmailPassRes = { token: string }

// Promotions
export type PromotionRes = { promotion: PromotionDTO }
export type PromotionListRes = { promotions: PromotionDTO[] } & ListRes
export type PromotionRuleAttributesListRes = { attributes: Record<any, any>[] }
export type PromotionRuleOperatorsListRes = { operators: Record<any, any>[] }
export type PromotionRuleValuesListRes = { values: Record<any, any>[] }
export type PromotionRulesListRes = { rules: Record<any, any>[] }
export type PromotionDeleteRes = DeleteRes

// Users
export type UserRes = { user: UserDTO }
export type UserListRes = { users: UserDTO[] } & ListRes
export type UserDeleteRes = DeleteRes

// Stores
export type ExtendedStoreDTO = StoreDTO & {
  default_currency: CurrencyDTO | null
}

export type StoreRes = { store: ExtendedStoreDTO }
export type StoreListRes = { stores: ExtendedStoreDTO[] } & ListRes

// Regions
export type RegionRes = { region: RegionDTO }
export type RegionListRes = { regions: RegionDTO[] } & ListRes
export type RegionDeleteRes = DeleteRes

// Campaigns
export type CampaignRes = { campaign: CampaignDTO }
export type CampaignListRes = { campaigns: CampaignDTO[] } & ListRes
export type CampaignDeleteRes = DeleteRes

// API Keys
export type ApiKeyDeleteRes = DeleteRes

// Sales Channels
export type SalesChannelDeleteRes = DeleteRes

// Currencies
export type CurrencyRes = { currency: CurrencyDTO }
export type CurrencyListRes = { currencies: CurrencyDTO[] } & ListRes

// Invites
export type InviteRes = { invite: InviteDTO }
export type InviteListRes = { invites: InviteDTO[] } & ListRes
export type InviteDeleteRes = DeleteRes

// Products
export type ExtendedProductDTO = ProductDTO & {
  variants: ProductVariantDTO[] | null
  sales_channels: SalesChannelDTO[] | null
  collections: ProductCollectionDTO[] | null
  categories: ProductCategoryDTO[] | null
}
export type ProductRes = { product: ExtendedProductDTO }
export type ProductListRes = { products: ExtendedProductDTO[] } & ListRes
export type ProductDeleteRes = DeleteRes

// Categories
export type CategoryRes = { category: ProductCategoryDTO }
export type CategoriesListRes = { categories: ProductCategoryDTO[] } & ListRes

// Tags
export type TagRes = { tag: ProductTagDTO }
export type TagsListRes = { tags: ProductTagDTO[] } & ListRes

// Product Types
export type ProductTypeRes = { product_type: ProductTypeDTO }
export type ProductTypeListRes = { product_types: ProductTypeDTO[] } & ListRes

// Payments

export type PaymentProvidersListRes = {
  payment_providers: PaymentProviderDTO[]
}

// Stock Locations
export type ExtendedStockLocationDTO = StockLocationDTO & {
  address: StockLocationAddressDTO | null
  sales_channels: SalesChannelDTO[] | null
}
export type StockLocationRes = { stock_location: ExtendedStockLocationDTO }
export type StockLocationListRes = {
  stock_locations: ExtendedStockLocationDTO[]
} & ListRes
export type StockLocationDeleteRes = DeleteRes
export type FulfillmentSetDeleteRes = DeleteRes
export type ServiceZoneDeleteRes = DeleteRes

// Shipping options
export type ShippingOptionRes = { shipping_option: ShippingOptionDTO }
export type ShippingOptionDeleteRes = DeleteRes

// Shipping profile
export type ShippingProfileRes = { shipping_profile: ShippingProfileDTO }
export type ShippingProfileListRes = {
  shipping_profiles: ShippingProfileDTO[]
} & ListRes
export type ShippingProfileDeleteRes = DeleteRes

// Workflow Executions
export type WorkflowExecutionRes = { workflow_execution: WorkflowExecutionDTO }
export type WorkflowExecutionListRes = {
  workflow_executions: WorkflowExecutionDTO[]
} & ListRes

// Product Collections
export type ProductCollectionRes = { collection: ProductCollectionDTO }
export type ProductCollectionListRes = {
  collections: ProductCollectionDTO[]
} & ListRes
export type ProductCollectionDeleteRes = DeleteRes

// Taxes
export type TaxRegionDeleteRes = DeleteRes
export type TaxRateDeleteRes = DeleteRes

// Inventory Items
export type InventoryItemRes = {
  inventory_item: InventoryNext.InventoryItemDTO & {
    stocked_quantity: number
    reserved_quantity: number
    location_levels?: InventoryNext.InventoryLevelDTO[]
  }
}

export type InventoryItemListRes = {
  inventory_items: InventoryNext.InventoryItemDTO[]
} & ListRes
export type InventoryItemDeleteRes = DeleteRes

export type InventoryItemLocationLevelsRes = {
  inventory_levels: InventoryNext.InventoryLevelDTO[]
} & ListRes

export type InventoryItemLevelDeleteRes = DeleteRes

// Reservations
export type ReservationItemDeleteRes = DeleteRes

export type ReservationItemListRes = {
  reservations: InventoryNext.ReservationItemDTO[]
} & ListRes

export type ReservationItemRes = {
  reservation: InventoryNext.ReservationItemDTO
}
// Price Lists
export type PriceListRes = { price_list: PriceListDTO }
export type PriceListListRes = { price_lists: PriceListDTO[] } & ListRes
export type PriceListDeleteRes = DeleteRes

// Customer Groups
export type CustomerGroupRes = { customer_group: CustomerGroupDTO }
export type CustomerGroupListRes = {
  customer_groups: CustomerGroupDTO[]
} & ListRes
export type CustomerGroupDeleteRes = DeleteRes

/**
 * Temporary types for API payloads until we export them from `@medusajs/types`
 */

import {
  CreateApiKeyDTO,
  CreateCampaignDTO,
  CreateCustomerDTO,
  CreateFulfillmentSetDTO,
  CreateInviteDTO,
  CreatePriceListDTO,
  CreateProductCollectionDTO,
  CreatePromotionDTO,
  CreatePromotionRuleDTO,
  CreateRegionDTO,
  CreateSalesChannelDTO,
  CreateServiceZoneDTO,
  CreateShippingOptionDTO,
  CreateShippingProfileDTO,
  CreateStockLocationInput,
  InventoryNext,
  UpdateApiKeyDTO,
  UpdateCampaignDTO,
  UpdateCustomerDTO,
  UpdatePriceListDTO,
  UpdateProductCollectionDTO,
  UpdatePromotionDTO,
  UpdatePromotionRuleDTO,
  UpdateRegionDTO,
  UpdateSalesChannelDTO,
  UpdateStockLocationInput,
  UpdateStoreDTO,
  UpdateUserDTO,
} from "@medusajs/types"

// Auth
export type EmailPassReq = { email: string; password: string }

// Regions
export type CreateRegionReq = CreateRegionDTO
export type UpdateRegionReq = UpdateRegionDTO

// Stores
export type UpdateStoreReq = UpdateStoreDTO

// API Keys
export type CreateApiKeyReq = CreateApiKeyDTO
export type UpdateApiKeyReq = UpdateApiKeyDTO

// Customers
export type CreateCustomerReq = CreateCustomerDTO
export type UpdateCustomerReq = Omit<UpdateCustomerDTO, "id">

// Sales Channels
export type CreateSalesChannelReq = CreateSalesChannelDTO
export type UpdateSalesChannelReq = UpdateSalesChannelDTO
export type AddProductsSalesChannelReq = { product_ids: string[] }
export type RemoveProductsSalesChannelReq = { product_ids: string[] }

// Users
export type UpdateUserReq = Omit<UpdateUserDTO, "id">

// Invites
export type CreateInviteReq = CreateInviteDTO

// Stock Locations
export type CreateStockLocationReq = CreateStockLocationInput
export type UpdateStockLocationReq = UpdateStockLocationInput
export type CreateFulfillmentSetReq = CreateFulfillmentSetDTO
export type CreateServiceZoneReq = CreateServiceZoneDTO

// Shipping Options
export type CreateShippingOptionReq = CreateShippingOptionDTO

// Shipping Profile
export type CreateShippingProfileReq = CreateShippingProfileDTO

// Product Collections
export type CreateProductCollectionReq = CreateProductCollectionDTO
export type UpdateProductCollectionReq = UpdateProductCollectionDTO

// Price Lists
export type CreatePriceListReq = CreatePriceListDTO
export type UpdatePriceListReq = UpdatePriceListDTO
export type AddPriceListPricesReq = {
  prices: {
    currency_code: string
    amount: number
    variant_id: string
  }[]
}
export type DeletePriceListPricesReq = { ids: string[] }

// Promotion
export type CreatePromotionReq = CreatePromotionDTO
export type UpdatePromotionReq = UpdatePromotionDTO
export type BatchAddPromotionRulesReq = { rules: CreatePromotionRuleDTO[] }
export type BatchRemovePromotionRulesReq = { rule_ids: string[] }
export type BatchUpdatePromotionRulesReq = { rules: UpdatePromotionRuleDTO[] }

// Campaign
export type CreateCampaignReq = CreateCampaignDTO
export type UpdateCampaignReq = UpdateCampaignDTO

// Inventory Items
export type CreateInventoryItemReq = InventoryNext.CreateInventoryItemInput
export type UpdateInventoryItemReq = Omit<
  InventoryNext.UpdateInventoryItemInput,
  "id"
>

// Inventory Item Levels
export type InventoryItemLocationBatch = {
  creates: { location_id: string; stocked_quantity?: number }[]
  deletes: string[]
}

export type UpdateInventoryLevelReq = {
  reserved_quantity?: number
  stocked_quantity?: number
}

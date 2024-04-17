import {
  DateComparisonOperator,
  FindParams,
  NumericalComparisonOperator,
  StringComparisonOperator,
  extendedFindParamsMixin,
} from "../../../types/common"
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { IsType } from "../../../utils"

export class AdminGetInventoryItemsItemParams extends FindParams {}

/**
 * Parameters used to filter and configure the pagination of the retrieved inventory items.
 */
export class AdminGetInventoryItemsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Search terms to search inventory items' sku, title, and description.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * Location IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

  /**
   * SKUs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  sku?: string | string[]

  /**
   * Origin countries to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  origin_country?: string | string[]

  /**
   * MID codes to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  mid_code?: string | string[]

  /**
   * Materials to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  material?: string | string[]

  /**
   * String filters to apply to inventory items' `hs_code` field.
   */
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  hs_code?: string | string[] | StringComparisonOperator

  /**
   * Number filters to apply to inventory items' `weight` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  weight?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `length` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  length?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `height` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  height?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `width` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  width?: number | NumericalComparisonOperator

  /**
   * Filter inventory items by whether they require shipping.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  requires_shipping?: boolean
}

export class AdminPostInventoryItemsItemLocationLevelsReq {
  @IsString()
  location_id: string

  @IsNumber()
  @IsOptional()
  stocked_quantity?: number

  @IsOptional()
  @IsNumber()
  incoming_quantity?: number
}

export class AdminPostInventoryItemsItemLocationLevelsBatchReq {
  @ValidateNested({ each: true })
  @Type(() => AdminPostInventoryItemsItemLocationLevelsReq)
  creates: AdminPostInventoryItemsItemLocationLevelsReq[]

  @IsString({ each: true })
  deletes: string[]
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsParams extends FindParams {}

/**
 * @schema AdminPostInventoryItemsReq
 * type: object
 * description: "The details of the inventory item to create."
 * properties:
 *   sku:
 *     description: The unique SKU of the associated Product Variant.
 *     type: string
 *   ean:
 *     description: The EAN number of the item.
 *     type: string
 *   upc:
 *     description: The UPC number of the item.
 *     type: string
 *   barcode:
 *     description: A generic GTIN field for the Product Variant.
 *     type: string
 *   hs_code:
 *     description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   inventory_quantity:
 *     description: The amount of stock kept of the associated Product Variant.
 *     type: integer
 *     default: 0
 *   allow_backorder:
 *     description: Whether the associated Product Variant can be purchased when out of stock.
 *     type: boolean
 *   manage_inventory:
 *     description: Whether Medusa should keep track of the inventory for the associated Product Variant.
 *     type: boolean
 *     default: true
 *   weight:
 *     description: The weight of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   length:
 *     description: The length of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   height:
 *     description: The height of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   width:
 *     description: The width of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   origin_country:
 *     description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   material:
 *     description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   title:
 *     description: The inventory item's title.
 *     type: string
 *   description:
 *     description: The inventory item's description.
 *     type: string
 *   thumbnail:
 *     description: The inventory item's thumbnail.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class AdminPostInventoryItemsReq {
  @IsString()
  @IsOptional()
  sku?: string

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

// eslint-disable-next-line max-len
export class AdminGetInventoryItemsItemLocationLevelsParams extends extendedFindParamsMixin(
  {
    limit: 50,
    offset: 0,
  }
) {
  /**
   * Location IDs to filter location levels.
   */
  @IsOptional()
  @IsString({ each: true })
  location_id?: string[]
}
/**
 * @schema AdminPostInventoryItemsItemLocationLevelsLevelReq
 * type: object
 * properties:
 *   stocked_quantity:
 *     description: the total stock quantity of an inventory item at the given location ID
 *     type: number
 *   incoming_quantity:
 *     description: the incoming stock quantity of an inventory item at the given location ID
 *     type: number
 */
export class AdminPostInventoryItemsItemLocationLevelsLevelReq {
  @IsOptional()
  @IsNumber()
  @Min(0)
  incoming_quantity?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  stocked_quantity?: number
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsLevelParams extends FindParams {}
/**
 * @schema AdminPostInventoryItemsInventoryItemReq
 * type: object
 * description: "The attributes to update in an inventory item."
 * properties:
 *   hs_code:
 *     description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   origin_country:
 *     description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   material:
 *     description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   weight:
 *     description: The weight of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   height:
 *     description: The height of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   width:
 *     description: The width of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   length:
 *     description: The length of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   title:
 *     description: The inventory item's title.
 *     type: string
 *   description:
 *     description: The inventory item's description.
 *     type: string
 *   thumbnail:
 *     description: The inventory item's thumbnail.
 *     type: string
 *   requires_shipping:
 *     description: Whether the item requires shipping.
 *     type: boolean
 */

export class AdminPostInventoryItemsInventoryItemReq {
  @IsString()
  @IsOptional()
  sku?: string

  @IsOptional()
  @IsString()
  origin_country?: string

  @IsOptional()
  @IsString()
  hs_code?: string

  @IsOptional()
  @IsString()
  mid_code?: string

  @IsOptional()
  @IsString()
  material?: string

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  height?: number

  @IsOptional()
  @IsNumber()
  length?: number

  @IsOptional()
  @IsNumber()
  width?: number

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsBoolean()
  @IsOptional()
  requires_shipping?: boolean
}

export class AdminPostInventoryItemsInventoryItemParams extends FindParams {}

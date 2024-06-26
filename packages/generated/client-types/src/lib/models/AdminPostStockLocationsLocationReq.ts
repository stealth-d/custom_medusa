/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { StockLocationAddressInput } from "./StockLocationAddressInput"

/**
 * The details to update of the stock location.
 */
export interface AdminPostStockLocationsLocationReq {
  /**
   * the name of the stock location
   */
  name?: string
  /**
   * the stock location address ID
   */
  address_id?: string
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
  /**
   * The data of an associated address to create or update.
   */
  address?: StockLocationAddressInput
}

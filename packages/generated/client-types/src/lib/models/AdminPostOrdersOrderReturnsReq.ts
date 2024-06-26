/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the requested return.
 */
export interface AdminPostOrdersOrderReturnsReq {
  /**
   * The line items that will be returned.
   */
  items: Array<{
    /**
     * The ID of the Line Item.
     */
    item_id: string
    /**
     * The ID of the Return Reason to use.
     */
    reason_id?: string
    /**
     * An optional note with information about the Return.
     */
    note?: string
    /**
     * The quantity of the Line Item.
     */
    quantity: number
  }>
  /**
   * The Shipping Method to be used to handle the return shipment.
   */
  return_shipping?: {
    /**
     * The ID of the Shipping Option to create the Shipping Method from.
     */
    option_id?: string
    /**
     * The price to charge for the Shipping Method.
     */
    price?: number
  }
  /**
   * An optional note with information about the Return.
   */
  note?: string
  /**
   * A flag to indicate if the Return should be registerd as received immediately.
   */
  receive_now?: boolean
  /**
   * If set to `true`, no notification will be sent to the customer related to this Return.
   */
  no_notification?: boolean
  /**
   * The amount to refund.
   */
  refund?: number
  /**
   * The ID of the location used for the return.
   */
  location_id?: string
}

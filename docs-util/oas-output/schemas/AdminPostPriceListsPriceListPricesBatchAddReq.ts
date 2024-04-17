/**
 * @schema AdminPostPriceListsPriceListPricesBatchAddReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostPriceListsPriceListPricesBatchAddReq
 * required:
 *   - prices
 * properties:
 *   prices:
 *     type: array
 *     description: The price list's prices.
 *     items:
 *       type: object
 *       description: The price's prices.
 *       x-schemaName: AdminPriceListPricesCreateReq
 *       required:
 *         - currency_code
 *         - amount
 *         - variant_id
 *       properties:
 *         currency_code:
 *           type: string
 *           title: currency_code
 *           description: The price's currency code.
 *         amount:
 *           type: number
 *           title: amount
 *           description: The price's amount.
 *         variant_id:
 *           type: string
 *           title: variant_id
 *           description: The price's variant id.
 *         min_quantity:
 *           type: number
 *           title: min_quantity
 *           description: The price's min quantity.
 *         max_quantity:
 *           type: number
 *           title: max_quantity
 *           description: The price's max quantity.
 *         rules:
 *           type: object
 *           description: The price's rules.
 *           properties: {}
 * 
*/


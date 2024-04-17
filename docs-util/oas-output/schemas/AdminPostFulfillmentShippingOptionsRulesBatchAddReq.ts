/**
 * @schema AdminPostFulfillmentShippingOptionsRulesBatchAddReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostFulfillmentShippingOptionsRulesBatchAddReq
 * required:
 *   - rules
 * properties:
 *   rules:
 *     type: array
 *     description: The fulfillment's rules.
 *     items:
 *       type: object
 *       description: The rule's rules.
 *       x-schemaName: FulfillmentRuleCreate
 *       required:
 *         - operator
 *         - attribute
 *         - value
 *       properties:
 *         operator: {}
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The rule's attribute.
 *         value:
 *           oneOf:
 *             - type: string
 *               title: value
 *               description: The rule's value.
 *             - type: array
 *               description: The rule's value.
 *               items:
 *                 type: string
 *                 title: value
 *                 description: The value's details.
 * 
*/


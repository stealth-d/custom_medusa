/**
 * @schema AdminPostPromotionsPromotionRulesBatchAddReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostPromotionsPromotionRulesBatchAddReq
 * required:
 *   - rules
 * properties:
 *   rules:
 *     type: array
 *     description: The promotion's rules.
 *     items:
 *       type: object
 *       description: The rule's rules.
 *       x-schemaName: PromotionRule
 *       required:
 *         - operator
 *         - attribute
 *         - values
 *       properties:
 *         operator: {}
 *         description:
 *           type: string
 *           title: description
 *           description: The rule's description.
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The rule's attribute.
 *         values:
 *           type: array
 *           description: The rule's values.
 *           items:
 *             type: string
 *             title: values
 *             description: The value's values.
 * 
*/


/**
 * @schema AdminPostCampaignsReq
 * type: object
 * description: The promotion's campaign.
 * x-schemaName: AdminPostCampaignsReq
 * required:
 *   - name
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The campaign's name.
 *   campaign_identifier:
 *     type: string
 *     title: campaign_identifier
 *     description: The campaign's campaign identifier.
 *   description:
 *     type: string
 *     title: description
 *     description: The campaign's description.
 *   currency:
 *     type: string
 *     title: currency
 *     description: The campaign's currency.
 *   budget:
 *     $ref: "#/components/schemas/CampaignBudget"
 *   starts_at:
 *     type: string
 *     title: starts_at
 *     description: The campaign's starts at.
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The campaign's ends at.
 *   promotions:
 *     type: array
 *     description: The campaign's promotions.
 *     items:
 *       type: object
 *       description: The promotion's promotions.
 *       x-schemaName: IdObject
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The promotion's ID.
 * 
*/


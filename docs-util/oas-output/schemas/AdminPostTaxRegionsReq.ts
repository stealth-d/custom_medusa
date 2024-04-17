/**
 * @schema AdminPostTaxRegionsReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostTaxRegionsReq
 * required:
 *   - country_code
 * properties:
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The tax region's country code.
 *   province_code:
 *     type: string
 *     title: province_code
 *     description: The tax region's province code.
 *   parent_id:
 *     type: string
 *     title: parent_id
 *     description: The tax region's parent id.
 *   default_tax_rate:
 *     $ref: "#/components/schemas/CreateDefaultTaxRate"
 *   metadata:
 *     type: object
 *     description: The tax region's metadata.
 *     properties: {}
 * 
*/


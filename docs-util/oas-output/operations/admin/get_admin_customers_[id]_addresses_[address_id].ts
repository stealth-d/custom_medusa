/**
 * @oas [get] /admin/customers/{id}/addresses/{address_id}
 * operationId: GetCustomersIdAddressesAddress_id
 * summary: List Addresses
 * description: Retrieve a list of addresses in a customer. The addresses can be
 *   filtered by fields like FILTER FIELDS. The addresses can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: address_id
 *     in: path
 *     description: The customer's address id.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/customers/{id}/addresses/{address_id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Customers
 * responses:
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * requestBody:
 *   content:
 *     application/json:
 *       schema: {}
 * 
*/


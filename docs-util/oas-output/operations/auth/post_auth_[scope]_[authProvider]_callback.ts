/**
 * @oas [post] /auth/{scope}/{authProvider}/callback
 * operationId: PostScopeAuthproviderCallback
 * summary: Add Callbacks to [scope]
 * description: Add a list of callbacks to a [scope].
 * x-authenticated: false
 * parameters:
 *   - name: scope
 *     in: path
 *     description: The [scope]'s scope.
 *     required: true
 *     schema:
 *       type: string
 *   - name: authProvider
 *     in: path
 *     description: The [scope]'s authprovider.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/{scope}/{authProvider}/callback'
 * tags:
 *   - "[scope]"
 * responses:
 *   "200":
 *     description: OK
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
 * 
*/


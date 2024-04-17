/**
 * @schema AdminGetProductsParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminGetProductsParams
 * properties:
 *   q:
 *     type: string
 *     title: q
 *     description: The product's q.
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The product's ID.
 *       - type: array
 *         description: The product's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   status:
 *     type: array
 *     description: The product's status.
 *     items: {}
 *   title:
 *     type: string
 *     title: title
 *     description: The product's title.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The product's handle.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: The product's is giftcard.
 *   price_list_id:
 *     type: array
 *     description: The product's price list id.
 *     items:
 *       type: string
 *       title: price_list_id
 *       description: The price list id's details.
 *   sales_channel_id:
 *     type: array
 *     description: The product's sales channel id.
 *     items:
 *       type: string
 *       title: sales_channel_id
 *       description: The sales channel id's details.
 *   collection_id:
 *     type: array
 *     description: The product's collection id.
 *     items:
 *       type: string
 *       title: collection_id
 *       description: The collection id's details.
 *   tags:
 *     type: array
 *     description: The product's tags.
 *     items:
 *       type: string
 *       title: tags
 *       description: The tag's tags.
 *   type_id:
 *     type: array
 *     description: The product's type id.
 *     items:
 *       type: string
 *       title: type_id
 *       description: The type id's details.
 *   variants:
 *     type: object
 *     description: The product's variants.
 *     properties: {}
 *   created_at: {}
 *   updated_at: {}
 *   deleted_at: {}
 *   $and:
 *     type: array
 *     description: The product's $and.
 *     items:
 *       type: object
 *       description: The $and's details.
 *       x-schemaName: AdminGetProductsParams
 *       properties:
 *         q:
 *           type: string
 *           title: q
 *           description: The $and's q.
 *         id:
 *           oneOf:
 *             - type: string
 *               title: id
 *               description: The $and's ID.
 *             - type: array
 *               description: The $and's ID.
 *               items:
 *                 type: string
 *                 title: id
 *                 description: The id's ID.
 *         status:
 *           type: array
 *           description: The $and's status.
 *           items: {}
 *         title:
 *           type: string
 *           title: title
 *           description: The $and's title.
 *         handle:
 *           type: string
 *           title: handle
 *           description: The $and's handle.
 *         is_giftcard:
 *           type: boolean
 *           title: is_giftcard
 *           description: The $and's is giftcard.
 *         price_list_id:
 *           type: array
 *           description: The $and's price list id.
 *           items:
 *             type: string
 *             title: price_list_id
 *             description: The price list id's details.
 *         sales_channel_id:
 *           type: array
 *           description: The $and's sales channel id.
 *           items:
 *             type: string
 *             title: sales_channel_id
 *             description: The sales channel id's details.
 *         collection_id:
 *           type: array
 *           description: The $and's collection id.
 *           items:
 *             type: string
 *             title: collection_id
 *             description: The collection id's details.
 *         tags:
 *           type: array
 *           description: The $and's tags.
 *           items:
 *             type: string
 *             title: tags
 *             description: The tag's tags.
 *         type_id:
 *           type: array
 *           description: The $and's type id.
 *           items:
 *             type: string
 *             title: type_id
 *             description: The type id's details.
 *         variants:
 *           type: object
 *           description: The $and's variants.
 *           properties: {}
 *         created_at: {}
 *         updated_at: {}
 *         deleted_at: {}
 *         $and:
 *           type: array
 *           description: The $and's details.
 *           items:
 *             type: object
 *             description: The $and's details.
 *             x-schemaName: AdminGetProductsParams
 *             properties:
 *               q:
 *                 type: string
 *                 title: q
 *                 description: The $and's q.
 *               id:
 *                 oneOf:
 *                   - type: string
 *                     title: id
 *                     description: The $and's ID.
 *                   - type: array
 *                     description: The $and's ID.
 *                     items:
 *                       type: string
 *                       title: id
 *                       description: The id's ID.
 *               status:
 *                 type: array
 *                 description: The $and's status.
 *                 items: {}
 *               title:
 *                 type: string
 *                 title: title
 *                 description: The $and's title.
 *               handle:
 *                 type: string
 *                 title: handle
 *                 description: The $and's handle.
 *               is_giftcard:
 *                 type: boolean
 *                 title: is_giftcard
 *                 description: The $and's is giftcard.
 *               price_list_id:
 *                 type: array
 *                 description: The $and's price list id.
 *                 items:
 *                   type: string
 *                   title: price_list_id
 *                   description: The price list id's details.
 *               sales_channel_id:
 *                 type: array
 *                 description: The $and's sales channel id.
 *                 items:
 *                   type: string
 *                   title: sales_channel_id
 *                   description: The sales channel id's details.
 *               collection_id:
 *                 type: array
 *                 description: The $and's collection id.
 *                 items:
 *                   type: string
 *                   title: collection_id
 *                   description: The collection id's details.
 *               tags:
 *                 type: array
 *                 description: The $and's tags.
 *                 items:
 *                   type: string
 *                   title: tags
 *                   description: The tag's tags.
 *               type_id:
 *                 type: array
 *                 description: The $and's type id.
 *                 items:
 *                   type: string
 *                   title: type_id
 *                   description: The type id's details.
 *               variants:
 *                 type: object
 *                 description: The $and's variants.
 *                 properties: {}
 *               created_at: {}
 *               updated_at: {}
 *               deleted_at: {}
 *               $and:
 *                 type: array
 *                 description: The $and's details.
 *                 items:
 *                   type: object
 *                   description: The $and's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               $or:
 *                 type: array
 *                 description: The $and's $or.
 *                 items:
 *                   type: object
 *                   description: The $or's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               expand:
 *                 type: string
 *                 title: expand
 *                 description: The $and's expand.
 *               fields:
 *                 type: string
 *                 title: fields
 *                 description: The $and's fields.
 *               offset:
 *                 type: number
 *                 title: offset
 *                 description: The $and's offset.
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The $and's limit.
 *               order:
 *                 type: string
 *                 title: order
 *                 description: The $and's order.
 *         $or:
 *           type: array
 *           description: The $and's $or.
 *           items:
 *             type: object
 *             description: The $or's details.
 *             x-schemaName: AdminGetProductsParams
 *             properties:
 *               q:
 *                 type: string
 *                 title: q
 *                 description: The $or's q.
 *               id:
 *                 oneOf:
 *                   - type: string
 *                     title: id
 *                     description: The $or's ID.
 *                   - type: array
 *                     description: The $or's ID.
 *                     items:
 *                       type: string
 *                       title: id
 *                       description: The id's ID.
 *               status:
 *                 type: array
 *                 description: The $or's status.
 *                 items: {}
 *               title:
 *                 type: string
 *                 title: title
 *                 description: The $or's title.
 *               handle:
 *                 type: string
 *                 title: handle
 *                 description: The $or's handle.
 *               is_giftcard:
 *                 type: boolean
 *                 title: is_giftcard
 *                 description: The $or's is giftcard.
 *               price_list_id:
 *                 type: array
 *                 description: The $or's price list id.
 *                 items:
 *                   type: string
 *                   title: price_list_id
 *                   description: The price list id's details.
 *               sales_channel_id:
 *                 type: array
 *                 description: The $or's sales channel id.
 *                 items:
 *                   type: string
 *                   title: sales_channel_id
 *                   description: The sales channel id's details.
 *               collection_id:
 *                 type: array
 *                 description: The $or's collection id.
 *                 items:
 *                   type: string
 *                   title: collection_id
 *                   description: The collection id's details.
 *               tags:
 *                 type: array
 *                 description: The $or's tags.
 *                 items:
 *                   type: string
 *                   title: tags
 *                   description: The tag's tags.
 *               type_id:
 *                 type: array
 *                 description: The $or's type id.
 *                 items:
 *                   type: string
 *                   title: type_id
 *                   description: The type id's details.
 *               variants:
 *                 type: object
 *                 description: The $or's variants.
 *                 properties: {}
 *               created_at: {}
 *               updated_at: {}
 *               deleted_at: {}
 *               $and:
 *                 type: array
 *                 description: The $or's $and.
 *                 items:
 *                   type: object
 *                   description: The $and's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               $or:
 *                 type: array
 *                 description: The $or's details.
 *                 items:
 *                   type: object
 *                   description: The $or's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               expand:
 *                 type: string
 *                 title: expand
 *                 description: The $or's expand.
 *               fields:
 *                 type: string
 *                 title: fields
 *                 description: The $or's fields.
 *               offset:
 *                 type: number
 *                 title: offset
 *                 description: The $or's offset.
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The $or's limit.
 *               order:
 *                 type: string
 *                 title: order
 *                 description: The $or's order.
 *         expand:
 *           type: string
 *           title: expand
 *           description: The $and's expand.
 *         fields:
 *           type: string
 *           title: fields
 *           description: The $and's fields.
 *         offset:
 *           type: number
 *           title: offset
 *           description: The $and's offset.
 *         limit:
 *           type: number
 *           title: limit
 *           description: The $and's limit.
 *         order:
 *           type: string
 *           title: order
 *           description: The $and's order.
 *   $or:
 *     type: array
 *     description: The product's $or.
 *     items:
 *       type: object
 *       description: The $or's details.
 *       x-schemaName: AdminGetProductsParams
 *       properties:
 *         q:
 *           type: string
 *           title: q
 *           description: The $or's q.
 *         id:
 *           oneOf:
 *             - type: string
 *               title: id
 *               description: The $or's ID.
 *             - type: array
 *               description: The $or's ID.
 *               items:
 *                 type: string
 *                 title: id
 *                 description: The id's ID.
 *         status:
 *           type: array
 *           description: The $or's status.
 *           items: {}
 *         title:
 *           type: string
 *           title: title
 *           description: The $or's title.
 *         handle:
 *           type: string
 *           title: handle
 *           description: The $or's handle.
 *         is_giftcard:
 *           type: boolean
 *           title: is_giftcard
 *           description: The $or's is giftcard.
 *         price_list_id:
 *           type: array
 *           description: The $or's price list id.
 *           items:
 *             type: string
 *             title: price_list_id
 *             description: The price list id's details.
 *         sales_channel_id:
 *           type: array
 *           description: The $or's sales channel id.
 *           items:
 *             type: string
 *             title: sales_channel_id
 *             description: The sales channel id's details.
 *         collection_id:
 *           type: array
 *           description: The $or's collection id.
 *           items:
 *             type: string
 *             title: collection_id
 *             description: The collection id's details.
 *         tags:
 *           type: array
 *           description: The $or's tags.
 *           items:
 *             type: string
 *             title: tags
 *             description: The tag's tags.
 *         type_id:
 *           type: array
 *           description: The $or's type id.
 *           items:
 *             type: string
 *             title: type_id
 *             description: The type id's details.
 *         variants:
 *           type: object
 *           description: The $or's variants.
 *           properties: {}
 *         created_at: {}
 *         updated_at: {}
 *         deleted_at: {}
 *         $and:
 *           type: array
 *           description: The $or's $and.
 *           items:
 *             type: object
 *             description: The $and's details.
 *             x-schemaName: AdminGetProductsParams
 *             properties:
 *               q:
 *                 type: string
 *                 title: q
 *                 description: The $and's q.
 *               id:
 *                 oneOf:
 *                   - type: string
 *                     title: id
 *                     description: The $and's ID.
 *                   - type: array
 *                     description: The $and's ID.
 *                     items:
 *                       type: string
 *                       title: id
 *                       description: The id's ID.
 *               status:
 *                 type: array
 *                 description: The $and's status.
 *                 items: {}
 *               title:
 *                 type: string
 *                 title: title
 *                 description: The $and's title.
 *               handle:
 *                 type: string
 *                 title: handle
 *                 description: The $and's handle.
 *               is_giftcard:
 *                 type: boolean
 *                 title: is_giftcard
 *                 description: The $and's is giftcard.
 *               price_list_id:
 *                 type: array
 *                 description: The $and's price list id.
 *                 items:
 *                   type: string
 *                   title: price_list_id
 *                   description: The price list id's details.
 *               sales_channel_id:
 *                 type: array
 *                 description: The $and's sales channel id.
 *                 items:
 *                   type: string
 *                   title: sales_channel_id
 *                   description: The sales channel id's details.
 *               collection_id:
 *                 type: array
 *                 description: The $and's collection id.
 *                 items:
 *                   type: string
 *                   title: collection_id
 *                   description: The collection id's details.
 *               tags:
 *                 type: array
 *                 description: The $and's tags.
 *                 items:
 *                   type: string
 *                   title: tags
 *                   description: The tag's tags.
 *               type_id:
 *                 type: array
 *                 description: The $and's type id.
 *                 items:
 *                   type: string
 *                   title: type_id
 *                   description: The type id's details.
 *               variants:
 *                 type: object
 *                 description: The $and's variants.
 *                 properties: {}
 *               created_at: {}
 *               updated_at: {}
 *               deleted_at: {}
 *               $and:
 *                 type: array
 *                 description: The $and's details.
 *                 items:
 *                   type: object
 *                   description: The $and's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               $or:
 *                 type: array
 *                 description: The $and's $or.
 *                 items:
 *                   type: object
 *                   description: The $or's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               expand:
 *                 type: string
 *                 title: expand
 *                 description: The $and's expand.
 *               fields:
 *                 type: string
 *                 title: fields
 *                 description: The $and's fields.
 *               offset:
 *                 type: number
 *                 title: offset
 *                 description: The $and's offset.
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The $and's limit.
 *               order:
 *                 type: string
 *                 title: order
 *                 description: The $and's order.
 *         $or:
 *           type: array
 *           description: The $or's details.
 *           items:
 *             type: object
 *             description: The $or's details.
 *             x-schemaName: AdminGetProductsParams
 *             properties:
 *               q:
 *                 type: string
 *                 title: q
 *                 description: The $or's q.
 *               id:
 *                 oneOf:
 *                   - type: string
 *                     title: id
 *                     description: The $or's ID.
 *                   - type: array
 *                     description: The $or's ID.
 *                     items:
 *                       type: string
 *                       title: id
 *                       description: The id's ID.
 *               status:
 *                 type: array
 *                 description: The $or's status.
 *                 items: {}
 *               title:
 *                 type: string
 *                 title: title
 *                 description: The $or's title.
 *               handle:
 *                 type: string
 *                 title: handle
 *                 description: The $or's handle.
 *               is_giftcard:
 *                 type: boolean
 *                 title: is_giftcard
 *                 description: The $or's is giftcard.
 *               price_list_id:
 *                 type: array
 *                 description: The $or's price list id.
 *                 items:
 *                   type: string
 *                   title: price_list_id
 *                   description: The price list id's details.
 *               sales_channel_id:
 *                 type: array
 *                 description: The $or's sales channel id.
 *                 items:
 *                   type: string
 *                   title: sales_channel_id
 *                   description: The sales channel id's details.
 *               collection_id:
 *                 type: array
 *                 description: The $or's collection id.
 *                 items:
 *                   type: string
 *                   title: collection_id
 *                   description: The collection id's details.
 *               tags:
 *                 type: array
 *                 description: The $or's tags.
 *                 items:
 *                   type: string
 *                   title: tags
 *                   description: The tag's tags.
 *               type_id:
 *                 type: array
 *                 description: The $or's type id.
 *                 items:
 *                   type: string
 *                   title: type_id
 *                   description: The type id's details.
 *               variants:
 *                 type: object
 *                 description: The $or's variants.
 *                 properties: {}
 *               created_at: {}
 *               updated_at: {}
 *               deleted_at: {}
 *               $and:
 *                 type: array
 *                 description: The $or's $and.
 *                 items:
 *                   type: object
 *                   description: The $and's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               $or:
 *                 type: array
 *                 description: The $or's details.
 *                 items:
 *                   type: object
 *                   description: The $or's details.
 *                   x-schemaName: AdminGetProductsParams
 *                   properties: {}
 *               expand:
 *                 type: string
 *                 title: expand
 *                 description: The $or's expand.
 *               fields:
 *                 type: string
 *                 title: fields
 *                 description: The $or's fields.
 *               offset:
 *                 type: number
 *                 title: offset
 *                 description: The $or's offset.
 *               limit:
 *                 type: number
 *                 title: limit
 *                 description: The $or's limit.
 *               order:
 *                 type: string
 *                 title: order
 *                 description: The $or's order.
 *         expand:
 *           type: string
 *           title: expand
 *           description: The $or's expand.
 *         fields:
 *           type: string
 *           title: fields
 *           description: The $or's fields.
 *         offset:
 *           type: number
 *           title: offset
 *           description: The $or's offset.
 *         limit:
 *           type: number
 *           title: limit
 *           description: The $or's limit.
 *         order:
 *           type: string
 *           title: order
 *           description: The $or's order.
 *   expand:
 *     type: string
 *     title: expand
 *     description: The product's expand.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The product's fields.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The product's offset.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The product's limit.
 *   order:
 *     type: string
 *     title: order
 *     description: The product's order.
 * 
*/


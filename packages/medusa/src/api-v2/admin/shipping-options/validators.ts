import {
  RuleOperator,
  ShippingOptionPriceType as ShippingOptionPriceTypeEnum,
} from "@medusajs/utils"
import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type AdminGetShippingOptionParamsType = z.infer<
  typeof AdminGetShippingOptionParams
>
export const AdminGetShippingOptionParams = createSelectParams()

export type AdminGetShippingOptionsParamsType = z.infer<
  typeof AdminGetShippingOptionsParams
>
export const AdminGetShippingOptionsParams = createFindParams({
  offset: 0,
  limit: 20,
})

/**
 * SHIPPING OPTIONS RULES
 */

export type AdminCreateShippingOptionRuleType = z.infer<
  typeof AdminCreateShippingOptionRule
>
export const AdminCreateShippingOptionRule = z
  .object({
    operator: z.nativeEnum(RuleOperator),
    attribute: z.string(),
    value: z.string().or(z.array(z.string())),
  })
  .strict()

export type AdminShippingOptionRulesBatchAddType = z.infer<
  typeof AdminShippingOptionRulesBatchAdd
>
export const AdminShippingOptionRulesBatchAdd = z
  .object({
    rules: AdminCreateShippingOptionRule.array(),
  })
  .strict()

export type AdminShippingOptionRulesBatchRemoveType = z.infer<
  typeof AdminShippingOptionRulesBatchRemove
>
export const AdminShippingOptionRulesBatchRemove = z
  .object({
    rule_ids: z.array(z.string()),
  })
  .strict()

/**
 * SHIPPING OPTIONS
 */

export const AdminCreateShippingOptionTypeObject = z
  .object({
    label: z.string(),
    description: z.string(),
    code: z.string(),
  })
  .strict()

// eslint-disable-next-line max-len
export const AdminCreateShippingOptionPriceWithCurrency = z
  .object({
    currency_code: z.string(),
    amount: z.number(),
  })
  .strict()

export const AdminCreateShippingOptionPriceWithRegion = z
  .object({
    region_id: z.string(),
    amount: z.number(),
  })
  .strict()

export const AdminUpdateShippingOptionPriceWithCurrency = z
  .object({
    id: z.string().optional(),
    currency_code: z.string().optional(),
    amount: z.number().optional(),
  })
  .strict()

export const AdminUpdateShippingOptionPriceWithRegion = z
  .object({
    id: z.string().optional(),
    region_id: z.string().optional(),
    amount: z.number().optional(),
  })
  .strict()

export type AdminCreateShippingOptionType = z.infer<
  typeof AdminCreateShippingOption
>
export const AdminCreateShippingOption = z
  .object({
    name: z.string(),
    service_zone_id: z.string(),
    shipping_profile_id: z.string(),
    data: z.record(z.unknown()).optional(),
    price_type: z.nativeEnum(ShippingOptionPriceTypeEnum),
    provider_id: z.string(),
    type: AdminCreateShippingOptionTypeObject,
    prices: AdminCreateShippingOptionPriceWithCurrency.or(
      AdminCreateShippingOptionPriceWithRegion
    ).array(),
    rules: AdminCreateShippingOptionRule.array().optional(),
  })
  .strict()

export type AdminUpdateShippingOptionType = z.infer<
  typeof AdminUpdateShippingOption
>
export const AdminUpdateShippingOption = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    data: z.record(z.unknown()).optional(),
    price_type: z.nativeEnum(ShippingOptionPriceTypeEnum).optional(),
    provider_id: z.string().optional(),
    type: AdminCreateShippingOptionTypeObject.optional(),
    prices: AdminUpdateShippingOptionPriceWithCurrency.or(
      AdminUpdateShippingOptionPriceWithRegion
    )
      .array()
      .optional(),
  })
  .strict()

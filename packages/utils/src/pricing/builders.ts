import {
  PriceDTO,
  PriceListRuleDTO,
  PriceRuleDTO,
  ProductVariantDTO,
  UpdatePriceListPriceDTO,
} from "@medusajs/types"

export function buildPriceListRules(
  priceListRules: PriceListRuleDTO[]
): Record<string, string[]> {
  return priceListRules.reduce((acc, curr) => {
    const ruleAttribute = curr.rule_type.rule_attribute
    const ruleValues = curr.price_list_rule_values || []

    acc[ruleAttribute] = ruleValues.map((ruleValue) => ruleValue.value)

    return acc
  }, {})
}

export function buildPriceSetRules(
  priceRules: PriceRuleDTO[]
): Record<string, string> {
  return priceRules.reduce((acc, curr) => {
    const ruleAttribute = curr.rule_type.rule_attribute
    const ruleValue = curr.value

    acc[ruleAttribute] = ruleValue

    return acc
  }, {})
}

export function buildPriceSetPricesForCore(
  prices: (PriceDTO & {
    price_set: PriceDTO["price_set"] & {
      variant?: ProductVariantDTO
    }
  })[]
): Record<string, any>[] {
  return prices.map((price) => {
    const productVariant = (price.price_set as any).variant
    const rules: Record<string, string> = price.price_rules
      ? buildPriceSetRules(price.price_rules)
      : {}

    return {
      ...price,
      variant_id: productVariant?.id ?? null,
      rules,
    }
  })
}

export function buildPriceSetPricesForModule(
  prices: PriceDTO[]
): UpdatePriceListPriceDTO[] {
  return prices.map((price) => {
    const rules: Record<string, string> = price.price_rules
      ? buildPriceSetRules(price.price_rules)
      : {}

    return {
      ...price,
      price_set_id: price.price_set!?.id!,
      rules,
    }
  })
}

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  ruleQueryConfigurations,
  validateRuleAttribute,
  validateRuleType,
} from "../../../utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { rule_type: ruleType, rule_attribute_id: ruleAttributeId } = req.params
  const queryConfig = ruleQueryConfigurations[ruleAttributeId]
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  validateRuleType(ruleType)
  validateRuleAttribute(ruleType, ruleAttributeId)

  const { rows } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: queryConfig.entryPoint,
      variables: {
        filters: req.filterableFields,
        ...req.remoteQueryConfig.pagination,
      },
      fields: [queryConfig.labelAttr, queryConfig.valueAttr],
    })
  )

  const values = rows.map((r) => ({
    label: r[queryConfig.labelAttr],
    value: r[queryConfig.valueAttr],
  }))

  res.json({
    values,
  })
}

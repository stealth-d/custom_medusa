import { buildEventNamesFromEntityName } from "../event-bus"

const eventBaseNames: [
  "fulfillmentSet",
  "serviceZone",
  "geoZone",
  "shippingOption",
  "shippingProfile",
  "shippingOptionRule",
  "fulfillment"
] = [
  "fulfillmentSet",
  "serviceZone",
  "geoZone",
  "shippingOption",
  "shippingProfile",
  "shippingOptionRule",
  "fulfillment",
]

export const FulfillmentEvents = buildEventNamesFromEntityName(eventBaseNames)

import { AbstractFulfillmentProviderService } from "@medusajs/utils/src"

export class FulfillmentProviderServiceFixtures extends AbstractFulfillmentProviderService {
  static identifier = "fixtures-fulfillment-provider"

  async createFulfillment(data, items, order, fulfillment): Promise<any> {
    return {}
  }

  async cancelFulfillment(fulfillment): Promise<any> {
    return {}
  }

  async getFulfillmentOptions(): Promise<any> {
    return {}
  }
}

export const services = [FulfillmentProviderServiceFixtures]

interface PricingTier {
  min: number;
  max: number | null;
  price: number;
  discount: number;
}

interface PriceCalculation {
  unitPrice: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  finalUnitPrice: number;
}

export class PricingService {
  //TODO: puxar do banco e remover o mock
  private pricingTable: PricingTier[] = [
    { min: 100, max: 499, price: 5.00, discount: 0 },
    { min: 500, max: 999, price: 5.00, discount: 10 },
    { min: 1000, max: 1999, price: 5.00, discount: 15 },
    { min: 2000, max: null, price: 5.00, discount: 20 }
  ];

  calculatePrice(quantity: number): PriceCalculation {
    const tier = this.findPricingTier(quantity);

    if (!tier) {
      throw new Error('Configuração de preço não encontrada');
    }

    const unitPrice = tier.price;
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (tier.discount / 100);
    const total = subtotal - discountAmount;
    const finalUnitPrice = total / quantity;

    return {
      unitPrice,
      subtotal,
      discountPercentage: tier.discount,
      discountAmount,
      total,
      finalUnitPrice
    };
  }

  private findPricingTier(quantity: number): PricingTier | null {
    return this.pricingTable.find(tier => {
      const meetsMin = quantity >= tier.min;
      const meetsMax = tier.max === null || quantity <= tier.max;
      return meetsMin && meetsMax;
    }) || null;
  }

  getPricingTable(): PricingTier[] {
    return this.pricingTable;
  }
}

export interface Product {
  id: string
  name: string
  costPrice: number
  sellPrice: number
}

export interface ProfitDetail {
  productId: string
  productName: string
  costPrice: number
  sellPrice: number
  profit: number
  profitRate: number
}

export interface BundlePlan {
  id: string
  products: Product[]
  totalCost: number
  totalSellPrice: number
  totalProfit: number
  profitRate: number
  discountedSellPrice: number
  discountedProfit: number
  discountedProfitRate: number
  discountAmount: number
  profitDetails: ProfitDetail[]
}

export interface Settings {
  minItems: number
  maxItems: number
  allowDuplicate: boolean
  profitThreshold: number
  bundleDiscountRate: number
}

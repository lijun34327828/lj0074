import { Product, BundlePlan, ProfitDetail } from '../shared/types.js'

const products = new Map<string, Product>()

export function getAllProducts(): Product[] {
  return Array.from(products.values())
}

export function getProductById(id: string): Product | undefined {
  return products.get(id)
}

export function addProduct(data: Omit<Product, 'id'>): Product {
  const product: Product = {
    id: crypto.randomUUID(),
    ...data,
  }
  products.set(product.id, product)
  return product
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id'>>): Product | null {
  const existing = products.get(id)
  if (!existing) return null
  const updated = { ...existing, ...data }
  products.set(id, updated)
  return updated
}

export function deleteProduct(id: string): boolean {
  return products.delete(id)
}

export function generateBundlePlans(
  productList: Product[],
  minItems: number,
  maxItems: number,
  allowDuplicate: boolean
): BundlePlan[] {
  const plans: BundlePlan[] = []

  const effectiveMin = Math.max(2, minItems)
  const effectiveMax = Math.min(productList.length, maxItems)

  for (let k = effectiveMin; k <= effectiveMax; k++) {
    const combos = allowDuplicate
      ? combinationsWithRepetition(productList, k)
      : combinations(productList, k)

    for (const combo of combos) {
      const totalCost = combo.reduce((s, p) => s + p.costPrice, 0)
      const totalSellPrice = combo.reduce((s, p) => s + p.sellPrice, 0)
      const totalProfit = totalSellPrice - totalCost
      const profitRate = totalSellPrice > 0 ? totalProfit / totalSellPrice : 0

      const profitDetails: ProfitDetail[] = combo.map((p) => ({
        productId: p.id,
        productName: p.name,
        costPrice: p.costPrice,
        sellPrice: p.sellPrice,
        profit: p.sellPrice - p.costPrice,
        profitRate: p.sellPrice > 0 ? (p.sellPrice - p.costPrice) / p.sellPrice : 0,
      }))

      plans.push({
        id: crypto.randomUUID(),
        products: combo,
        totalCost: Math.round(totalCost * 100) / 100,
        totalSellPrice: Math.round(totalSellPrice * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        profitRate: Math.round(profitRate * 10000) / 10000,
        profitDetails,
      })
    }
  }

  plans.sort((a, b) => b.profitRate - a.profitRate)

  return plans
}

function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = []

  function backtrack(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current])
      return
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i])
      backtrack(i + 1, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return result
}

function combinationsWithRepetition<T>(arr: T[], k: number): T[][] {
  const result: T[][] = []

  function backtrack(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current])
      return
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i])
      backtrack(i, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return result
}

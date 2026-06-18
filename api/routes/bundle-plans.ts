import { Router, type Request, type Response } from 'express'
import * as store from '../store.js'
import type { BundlePlan } from '../../shared/types.js'

let cachedPlans: BundlePlan[] = []

const router = Router()

router.post('/generate', (req: Request, res: Response) => {
  const { minItems, maxItems, allowDuplicate, profitThreshold } = req.body
  const products = store.getAllProducts()

  if (products.length < 2) {
    res.status(400).json({ error: '至少需要2款商品才能生成套餐方案' })
    return
  }

  const min = Number(minItems) || 2
  const max = Number(maxItems) || Math.min(products.length, 5)
  const dup = Boolean(allowDuplicate)
  const threshold = profitThreshold != null ? Number(profitThreshold) : 0

  cachedPlans = store.generateBundlePlans(products, min, max, dup)

  if (threshold > 0) {
    cachedPlans = cachedPlans.filter((p) => p.profitRate >= threshold)
  }

  res.json(cachedPlans)
})

router.get('/', (_req: Request, res: Response) => {
  res.json(cachedPlans)
})

export default router

import { Router, type Request, type Response } from 'express'
import type { Settings } from '../../shared/types.js'

let settings: Settings = {
  minItems: 2,
  maxItems: 5,
  allowDuplicate: false,
  profitThreshold: 0.15,
  bundleDiscountRate: 0,
}

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.json(settings)
})

router.put('/', (req: Request, res: Response) => {
  const { minItems, maxItems, allowDuplicate, profitThreshold, bundleDiscountRate } = req.body
  if (minItems != null) settings.minItems = Number(minItems)
  if (maxItems != null) settings.maxItems = Number(maxItems)
  if (allowDuplicate != null) settings.allowDuplicate = Boolean(allowDuplicate)
  if (profitThreshold != null) settings.profitThreshold = Number(profitThreshold)
  if (bundleDiscountRate != null) settings.bundleDiscountRate = Number(bundleDiscountRate)
  res.json(settings)
})

export default router

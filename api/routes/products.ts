import { Router, type Request, type Response } from 'express'
import * as store from '../store.js'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  const products = store.getAllProducts()
  res.json(products)
})

router.post('/', (req: Request, res: Response) => {
  const { name, costPrice, sellPrice } = req.body
  if (!name || costPrice == null || sellPrice == null) {
    res.status(400).json({ error: 'name, costPrice, sellPrice are required' })
    return
  }
  const product = store.addProduct({
    name,
    costPrice: Number(costPrice),
    sellPrice: Number(sellPrice),
  })
  res.status(201).json(product)
})

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const { name, costPrice, sellPrice } = req.body
  const updated = store.updateProduct(id, {
    ...(name != null ? { name } : {}),
    ...(costPrice != null ? { costPrice: Number(costPrice) } : {}),
    ...(sellPrice != null ? { sellPrice: Number(sellPrice) } : {}),
  })
  if (!updated) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(updated)
})

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const deleted = store.deleteProduct(id)
  if (!deleted) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json({ success: true })
})

export default router

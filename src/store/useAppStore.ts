import { create } from 'zustand'
import type { Product, BundlePlan, Settings } from '../../shared/types'

interface AppState {
  products: Product[]
  plans: BundlePlan[]
  settings: Settings
  loading: boolean
  sortField: 'profitRate' | 'totalProfit' | 'totalSellPrice' | 'unitProfit'
  sortDirection: 'asc' | 'desc'

  fetchProducts: () => Promise<void>
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  fetchPlans: () => Promise<void>
  generatePlans: () => Promise<void>

  fetchSettings: () => Promise<void>
  updateSettings: (data: Partial<Settings>) => Promise<void>

  setSortField: (field: 'profitRate' | 'totalProfit' | 'totalSellPrice' | 'unitProfit') => void
  toggleSortDirection: () => void
}

export const useStore = create<AppState>((set, get) => ({
  products: [],
  plans: [],
  settings: {
    minItems: 2,
    maxItems: 5,
    allowDuplicate: false,
    profitThreshold: 0.15,
  },
  loading: false,
  sortField: 'profitRate',
  sortDirection: 'desc',

  fetchProducts: async () => {
    const res = await fetch('/api/products')
    const products = await res.json()
    set({ products })
  },

  addProduct: async (data) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const product = await res.json()
    set((state) => ({ products: [...state.products, product] }))
    const { products, settings } = get()
    if (products.length >= 2) {
      get().generatePlans()
    }
  },

  updateProduct: async (id, data) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? updated : p)),
    }))
    const { products } = get()
    if (products.length >= 2) {
      get().generatePlans()
    }
  },

  deleteProduct: async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
    const { products } = get()
    if (products.length >= 2) {
      get().generatePlans()
    } else {
      set({ plans: [] })
    }
  },

  fetchPlans: async () => {
    const res = await fetch('/api/bundle-plans')
    const plans = await res.json()
    set({ plans })
  },

  generatePlans: async () => {
    set({ loading: true })
    const { settings } = get()
    const res = await fetch('/api/bundle-plans/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    const plans = await res.json()
    set({ plans, loading: false })
  },

  fetchSettings: async () => {
    const res = await fetch('/api/settings')
    const settings = await res.json()
    set({ settings })
  },

  updateSettings: async (data) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const settings = await res.json()
    set({ settings })
    const { products } = get()
    if (products.length >= 2) {
      get().generatePlans()
    }
  },

  setSortField: (field) => {
    const { sortField, sortDirection } = get()
    if (sortField === field) {
      set({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' })
    } else {
      set({ sortField: field, sortDirection: 'desc' })
    }
  },

  toggleSortDirection: () => {
    set((state) => ({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' }))
  },
}))

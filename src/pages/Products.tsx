import { useState, useMemo } from 'react'
import { useStore } from '@/store/useAppStore'
import { Plus, Trash2, Pencil, Check, X, TrendingUp, DollarSign, Package } from 'lucide-react'
import type { Product } from '../../shared/types'

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useStore()
  const [name, setName] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: '', costPrice: 0, sellPrice: 0 })

  const stats = useMemo(() => {
    const totalCost = products.reduce((s, p) => s + p.costPrice, 0)
    const totalSell = products.reduce((s, p) => s + p.sellPrice, 0)
    const totalProfit = totalSell - totalCost
    const avgProfitRate = products.length > 0
      ? products.reduce((s, p) => s + (p.sellPrice > 0 ? (p.sellPrice - p.costPrice) / p.sellPrice : 0), 0) / products.length
      : 0
    return { totalCost, totalSell, totalProfit, avgProfitRate }
  }, [products])

  const handleAdd = async () => {
    if (!name.trim() || !costPrice || !sellPrice) return
    await addProduct({
      name: name.trim(),
      costPrice: Number(costPrice),
      sellPrice: Number(sellPrice),
    })
    setName('')
    setCostPrice('')
    setSellPrice('')
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setEditData({ name: p.name, costPrice: p.costPrice, sellPrice: p.sellPrice })
  }

  const saveEdit = async (id: string) => {
    await updateProduct(id, {
      name: editData.name.trim(),
      costPrice: Number(editData.costPrice),
      sellPrice: Number(editData.sellPrice),
    })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const StatCard = ({ icon: Icon, label, value, subValue, color }: {
    icon: any
    label: string
    value: string
    subValue?: string
    color: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">{label}</p>
          <p className={`text-2xl font-bold font-mono mt-2 ${color}`}>{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color.replace('text-', 'bg-').replace('[#', '/10 text-[').replace(']', ']')}`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1B4332]" style={{ fontFamily: '"DM Serif Display", serif' }}>
            商品管理
          </h2>
          <p className="text-sm text-gray-500 mt-1">录入在售单品的成本价与售卖单价，系统自动核算毛利</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#D4A843]">
            <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
            <span>正在重新核算套餐方案...</span>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="商品总数"
            value={`${products.length} 款`}
            color="text-[#1B4332]"
          />
          <StatCard
            icon={DollarSign}
            label="总成本"
            value={`¥${stats.totalCost.toFixed(2)}`}
            subValue="单品成本合计"
            color="text-gray-600"
          />
          <StatCard
            icon={TrendingUp}
            label="总售价"
            value={`¥${stats.totalSell.toFixed(2)}`}
            subValue="单品售价合计"
            color="text-[#1B4332]"
          />
          <StatCard
            icon={TrendingUp}
            label="平均毛利率"
            value={`${(stats.avgProfitRate * 100).toFixed(1)}%`}
            subValue={`单件毛利 ¥${stats.totalProfit.toFixed(2)}`}
            color={stats.avgProfitRate >= 0.15 ? 'text-[#1B4332]' : 'text-[#D4A843]'}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#1B4332]/10 flex items-center justify-center">
            <Plus size={18} className="text-[#1B4332]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1B4332]">添加商品</h3>
            <p className="text-xs text-gray-400">录入商品信息后自动参与套餐推演</p>
          </div>
        </div>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">商品名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：冰红茶"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all bg-gray-50/50"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="w-40">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">成本价 (¥)</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all bg-gray-50/50 font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="w-40">
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">售卖单价 (¥)</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all bg-gray-50/50 font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!name.trim() || !costPrice || !sellPrice}
            className="px-6 py-3 bg-[#1B4332] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#143728] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            添加商品
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#1B4332]">商品列表</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {products.length} 款
            </span>
          </div>
          {products.length > 0 && (
            <span className="text-xs text-gray-400">
              修改价格后将自动重新核算套餐毛利
            </span>
          )}
        </div>
        {products.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm">暂无商品，请在上方添加</p>
            <p className="text-gray-300 text-xs mt-1">至少添加 2 款商品即可自动生成套餐方案</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F8F5]">
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3.5">商品名称</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3.5">成本价</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3.5">售卖单价</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3.5">单件毛利</th>
                <th className="text-right text-xs font-medium text-gray-500 px-6 py-3.5">毛利率</th>
                <th className="text-center text-xs font-medium text-gray-500 px-6 py-3.5">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const profit = p.sellPrice - p.costPrice
                const rate = p.sellPrice > 0 ? profit / p.sellPrice : 0
                const isEditing = editingId === p.id

                return (
                  <tr
                    key={p.id}
                    className={`border-t border-gray-50 transition-all hover:bg-[#FDFDFB] ${
                      i % 2 === 1 ? 'bg-[#FAFAF8]/50' : ''
                    } ${isEditing ? 'bg-[#1B4332]/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 font-medium"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1B4332]/10 to-[#D4A843]/10 flex items-center justify-center">
                            <span className="text-[#1B4332] text-sm font-bold">{p.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">{p.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.costPrice}
                          onChange={(e) => setEditData({ ...editData, costPrice: Number(e.target.value) })}
                          className="w-28 px-2 py-1.5 border border-gray-200 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 font-mono"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 font-mono">¥{p.costPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.sellPrice}
                          onChange={(e) => setEditData({ ...editData, sellPrice: Number(e.target.value) })}
                          className="w-28 px-2 py-1.5 border border-gray-200 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 font-mono"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-[#1B4332] font-mono">¥{p.sellPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-mono font-semibold ${profit >= 0 ? 'text-[#1B4332]' : 'text-[#E63946]'}`}>
                        ¥{profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, rate * 100))}%`,
                              backgroundColor: rate >= 0.3 ? '#1B4332' : rate >= 0.15 ? '#D4A843' : rate >= 0 ? '#E63946' : '#999',
                            }}
                          />
                        </div>
                        <span className={`text-sm font-mono font-semibold w-14 text-right ${
                          rate >= 0.3 ? 'text-[#1B4332]' : rate >= 0.15 ? 'text-[#D4A843]' : rate >= 0 ? 'text-[#E63946]' : 'text-gray-400'
                        }`}>
                          {(rate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => saveEdit(p.id)}
                            className="p-2 rounded-lg hover:bg-green-50 text-[#1B4332] transition-colors bg-[#1B4332]/5"
                            title="保存"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg hover:bg-red-50 text-[#E63946] transition-colors bg-red-50"
                            title="取消"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEdit(p)}
                            className="p-2 rounded-lg hover:bg-[#1B4332]/10 text-gray-400 hover:text-[#1B4332] transition-colors"
                            title="编辑"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#E63946] transition-colors"
                            title="删除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

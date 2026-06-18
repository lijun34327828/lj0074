import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@/store/useAppStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, CartesianGrid } from 'recharts'
import { Sparkles, ArrowUpDown, ChevronDown, Trophy, TrendingUp, DollarSign, Layers, RefreshCw, BarChart3 } from 'lucide-react'

export default function Plans() {
  const {
    products,
    plans,
    settings,
    loading,
    sortField,
    sortDirection,
    generatePlans,
    setSortField,
  } = useStore()

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    if (products.length >= 2 && plans.length === 0) {
      generatePlans()
    }
  }, [])

  const sortedPlans = useMemo(() => {
    const sorted = [...plans].sort((a, b) => {
      const mul = sortDirection === 'desc' ? -1 : 1
      return (a[sortField] - b[sortField]) * mul
    })
    return sorted
  }, [plans, sortField, sortDirection])

  const stats = useMemo(() => {
    if (plans.length === 0) return null
    const bestProfitRate = Math.max(...plans.map(p => p.profitRate))
    const bestProfit = Math.max(...plans.map(p => p.totalProfit))
    const avgProfitRate = plans.reduce((s, p) => s + p.profitRate, 0) / plans.length
    const highQualityCount = plans.filter(p => p.profitRate >= settings.profitThreshold).length
    return { bestProfitRate, bestProfit, avgProfitRate, highQualityCount, total: plans.length }
  }, [plans, settings.profitThreshold])

  const chartData = useMemo(() => {
    return sortedPlans.slice(0, 15).map((p, i) => ({
      name: `方案${i + 1}`,
      profitRate: Math.round(p.profitRate * 10000) / 100,
      totalProfit: p.totalProfit,
      totalSellPrice: p.totalSellPrice,
      totalCost: p.totalCost,
      products: p.products.map((pr) => pr.name).join(' + '),
      id: p.id,
    }))
  }, [sortedPlans])

  const SortHeader = ({
    field,
    label,
  }: {
    field: 'profitRate' | 'totalProfit' | 'totalSellPrice'
    label: string
  }) => (
    <button
      onClick={() => setSortField(field)}
      className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#1B4332] transition-colors group"
    >
      {label}
      <ChevronDown
        size={12}
        className={`transition-transform ${sortField === field ? (sortDirection === 'asc' ? 'rotate-180' : '') : 'opacity-0 group-hover:opacity-50'}`}
      />
    </button>
  )

  const StatCard = ({ icon: Icon, label, value, subValue, color, highlight }: {
    icon: any
    label: string
    value: string
    subValue?: string
    color: string
    highlight?: boolean
  }) => (
    <div className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all ${
      highlight ? 'border-[#D4A843]/40 bg-gradient-to-br from-[#D4A843]/5 to-transparent' : 'border-gray-100'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">{label}</p>
          <p className={`text-2xl font-bold font-mono mt-2 ${color}`}>{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${
          highlight ? 'bg-[#D4A843]/15' : 'bg-gray-100'
        }`}>
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
            套餐方案推演
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            AI 智能排列组合生成多套捆绑方案，对比毛利收益找出最优解
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#D4A843] bg-[#D4A843]/10 px-3 py-2 rounded-lg">
              <RefreshCw size={14} className="animate-spin" />
              <span>AI 正在计算...</span>
            </div>
          )}
          <button
            onClick={generatePlans}
            disabled={products.length < 2 || loading}
            className="px-6 py-3 bg-[#1B4332] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#143728] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Sparkles size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? '计算中...' : '重新推演'}
          </button>
        </div>
      </div>

      {products.length < 2 && (
        <div className="bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl p-6 text-center">
          <p className="text-sm text-[#8B6914]">请先在「商品管理」中录入至少 2 款商品</p>
        </div>
      )}

      {plans.length > 0 && stats && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              icon={Layers}
              label="方案总数"
              value={`${stats.total} 套`}
              subValue="所有组合方案"
              color="text-[#1B4332]"
            />
            <StatCard
              icon={Trophy}
              label="最高毛利率"
              value={`${(stats.bestProfitRate * 100).toFixed(1)}%`}
              subValue="最优方案"
              color="text-[#D4A843]"
              highlight
            />
            <StatCard
              icon={DollarSign}
              label="最高毛利额"
              value={`¥${stats.bestProfit.toFixed(2)}`}
              subValue="单套最大收益"
              color="text-[#1B4332]"
            />
            <StatCard
              icon={TrendingUp}
              label="达标方案"
              value={`${stats.highQualityCount} 套`}
              subValue={`毛利率 ≥ ${(settings.profitThreshold * 100).toFixed(0)}%`}
              color={stats.highQualityCount > 0 ? 'text-[#1B4332]' : 'text-[#E63946]'}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#1B4332]/10 flex items-center justify-center">
                <BarChart3 size={18} className="text-[#1B4332]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1B4332]">毛利对比分析</h3>
                <p className="text-xs text-gray-400">前 15 套方案的毛利与毛利率对比</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#999' }}
                    axisLine={{ stroke: '#eee' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#999' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `¥${v}`}
                    width={60}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#999' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #e5e5e5',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    labelFormatter={(label: string) => {
                      const item = chartData.find((d) => d.name === label)
                      return item ? `${label}：${item.products}` : label
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'profitRate') return [`${value}%`, '毛利率']
                      if (name === 'totalProfit') return [`¥${value.toFixed(2)}`, '毛利额']
                      return [value, name]
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="totalProfit"
                    name="毛利额"
                    radius={[4, 4, 0, 0]}
                    fill="#1B4332"
                    barSize={24}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.profitRate >= settings.profitThreshold * 100 ? '#1B4332' : '#E63946'}
                        fillOpacity={0.85 - (index * 0.03)}
                      />
                    ))}
                  </Bar>
                  <Bar
                    yAxisId="right"
                    dataKey="profitRate"
                    name="毛利率"
                    radius={[4, 4, 0, 0]}
                    fill="#D4A843"
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4A843]/10 flex items-center justify-center">
                  <ArrowUpDown size={18} className="text-[#D4A843]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1B4332]">方案对比明细</h3>
                  <p className="text-xs text-gray-400">点击表头可排序，红色方案低于毛利率阈值</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  共 <span className="font-semibold text-[#1B4332]">{plans.length}</span> 套方案
                </span>
                <span className="text-xs text-gray-400">
                  达标 <span className="font-semibold text-[#1B4332]">{stats.highQualityCount}</span> 套
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="bg-[#F8F8F5]">
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3.5 w-12">排名</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3.5">组合商品</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-5 py-3.5">
                      <SortHeader field="totalSellPrice" label="总售价" />
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 px-5 py-3.5">总成本</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-5 py-3.5">
                      <SortHeader field="totalProfit" label="总毛利" />
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 px-5 py-3.5 w-40">
                      <SortHeader field="profitRate" label="毛利率" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlans.map((plan, i) => {
                    const isLowProfit = plan.profitRate < settings.profitThreshold
                    const isSelected = selectedPlan === plan.id
                    const isTop3 = i < 3

                    return (
                      <tr
                        key={plan.id}
                        onClick={() => setSelectedPlan(isSelected ? null : plan.id)}
                        className={`border-t border-gray-50 transition-all cursor-pointer ${
                          isSelected ? 'bg-[#1B4332]/5' : 'hover:bg-[#FDFDFB]'
                        } ${
                          isLowProfit ? 'bg-red-50/30' : i % 2 === 1 ? 'bg-[#FAFAF8]/50' : ''
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isTop3
                              ? 'bg-gradient-to-br from-[#D4A843] to-[#B8912E] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {plan.products.map((p, j) => (
                              <span
                                key={j}
                                className="inline-block px-2.5 py-1 bg-[#1B4332]/8 text-[#1B4332] rounded-md text-xs font-medium"
                              >
                                {p.name}
                              </span>
                            ))}
                          </div>
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                              {plan.profitDetails.map((d, j) => (
                                <div key={j} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">{d.productName}</span>
                                  <span className="font-mono text-gray-700">
                                    毛利 ¥{d.profit.toFixed(2)}
                                    <span className="text-gray-400 ml-2">
                                      ({(d.profitRate * 100).toFixed(1)}%)
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-mono text-gray-700 font-medium">
                            ¥{plan.totalSellPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-mono text-gray-500">
                            ¥{plan.totalCost.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`text-sm font-mono font-bold ${
                              isLowProfit ? 'text-[#E63946]' : 'text-[#1B4332]'
                            }`}
                          >
                            ¥{plan.totalProfit.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <div className="flex-1 max-w-[100px] h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, plan.profitRate * 100)}%`,
                                  backgroundColor: isLowProfit ? '#E63946' : '#1B4332',
                                }}
                              />
                            </div>
                            <span
                              className={`text-sm font-mono font-bold w-14 text-right ${
                                isLowProfit ? 'text-[#E63946]' : 'text-[#1B4332]'
                              }`}
                            >
                              {(plan.profitRate * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {plans.length === 0 && products.length >= 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#D4A843]/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={32} className="text-[#D4A843]" />
          </div>
          <p className="text-gray-600 text-base font-medium">AI 智能推演已准备就绪</p>
          <p className="text-gray-400 text-sm mt-1.5">点击右上角「重新推演」按钮开始生成套餐组合方案</p>
        </div>
      )}
    </div>
  )
}

import { useEffect } from 'react'
import { useStore } from '@/store/useAppStore'
import { Sliders, AlertTriangle, Layers, RefreshCw, Sparkles } from 'lucide-react'

export default function Settings() {
  const { settings, fetchSettings, updateSettings, loading } = useStore()

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleChange = (key: string, value: number | boolean) => {
    updateSettings({ [key]: value })
  }

  const SettingCard = ({ icon: Icon, title, desc, children, color = '#1B4332' }: {
    icon: any
    title: string
    desc: string
    children: React.ReactNode
    color?: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )

  const SliderControl = ({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    unit = '',
    color = '#1B4332',
  }: {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (v: number) => void
    unit?: string
    color?: string
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm text-gray-600">{label}</label>
        <span
          className="text-sm font-mono font-bold"
          style={{ color }}
        >
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-300 mt-1.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1B4332]" style={{ fontFamily: '"DM Serif Display", serif' }}>
            参数配置
          </h2>
          <p className="text-sm text-gray-500 mt-1">调整套餐组合规则与告警阈值，系统将自动重新推演</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#D4A843] bg-[#D4A843]/10 px-3 py-2 rounded-lg">
            <RefreshCw size={14} className="animate-spin" />
            <span>正在重新计算方案...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SettingCard
          icon={Layers}
          title="组合规则"
          desc="设置套餐商品数量范围与组合方式"
          color="#1B4332"
        >
          <SliderControl
            label="最少捆绑件数"
            value={settings.minItems}
            min={2}
            max={10}
            onChange={(v) => handleChange('minItems', v)}
            unit=" 件"
            color="#1B4332"
          />
          <SliderControl
            label="最多捆绑件数"
            value={settings.maxItems}
            min={2}
            max={10}
            onChange={(v) => handleChange('maxItems', v)}
            unit=" 件"
            color="#1B4332"
          />

          <SliderControl
            label="套餐折扣率"
            value={settings.bundleDiscountRate}
            min={0}
            max={100}
            step={1}
            onChange={(v) => handleChange('bundleDiscountRate', v)}
            unit="%"
            color="#D4A843"
          />

          <div className="pt-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">允许商品重复搭配</p>
                <p className="text-xs text-gray-400 mt-0.5">开启后可生成含重复商品的组合</p>
              </div>
              <button
                onClick={() => handleChange('allowDuplicate', !settings.allowDuplicate)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  settings.allowDuplicate ? 'bg-[#1B4332]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    settings.allowDuplicate ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={AlertTriangle}
          title="告警设置"
          desc="设定毛利率合格线，低于此值的方案将标红提醒"
          color="#D4A843"
        >
          <SliderControl
            label="毛利率阈值"
            value={settings.profitThreshold * 100}
            min={0}
            max={100}
            step={5}
            onChange={(v) => handleChange('profitThreshold', v / 100)}
            unit="%"
            color="#D4A843"
          />

          <div className="p-5 rounded-xl border-2 border-dashed border-[#E63946]/30 bg-red-50/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#E63946]/10 flex items-center justify-center">
                <AlertTriangle size={14} className="text-[#E63946]" />
              </div>
              <p className="text-xs font-medium text-gray-600">阈值预览效果</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(5, settings.profitThreshold * 100)}%`,
                      backgroundColor: '#E63946',
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-[#E63946] font-mono">
                  {(settings.profitThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-400">
                低于此毛利率的套餐方案将以红色标记，提醒收益偏低
              </p>
            </div>
          </div>
        </SettingCard>
      </div>

      <div className="bg-gradient-to-br from-[#1B4332] to-[#163A2B] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles size={20} className="text-[#D4A843]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">当前配置摘要</h4>
            <p className="text-xs text-white/50 mt-0.5">AI 引擎将基于以下参数生成套餐方案</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/50">捆绑件数范围</p>
            <p className="text-xl font-bold font-mono mt-1.5">
              {settings.minItems} - {settings.maxItems} 件
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/50">组合模式</p>
            <p className="text-xl font-bold mt-1.5">
              {settings.allowDuplicate ? '可重复' : '不重复'}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/50">套餐折扣率</p>
            <p className="text-xl font-bold font-mono mt-1.5 text-[#D4A843]">
              {settings.bundleDiscountRate.toFixed(0)}%
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs text-white/50">毛利率告警线</p>
            <p className="text-xl font-bold font-mono mt-1.5">
              {(settings.profitThreshold * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8F5] rounded-xl p-5 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1B4332]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sliders size={16} className="text-[#1B4332]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">使用提示</p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1.5">
              <li>• 调整参数后系统会自动重新计算所有套餐方案，无需手动点击生成</li>
              <li>• 建议将毛利率阈值设置在 15%-30% 之间，兼顾收益与竞争力</li>
              <li>• 商品数量较多时，建议缩小捆绑件数范围以减少计算量</li>
              <li>• 允许重复搭配适用于按数量促销的场景（如买二送一）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

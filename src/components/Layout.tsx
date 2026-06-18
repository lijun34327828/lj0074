import { NavLink, Outlet } from 'react-router-dom'
import { Package, BarChart3, Settings, Sparkles } from 'lucide-react'
import { useStore } from '@/store/useAppStore'
import { useEffect } from 'react'

const navItems = [
  { to: '/', label: '商品管理', icon: Package, desc: '录入单品信息' },
  { to: '/plans', label: '方案推演', icon: BarChart3, desc: 'AI 生成套餐' },
  { to: '/settings', label: '参数配置', icon: Settings, desc: '调整规则阈值' },
]

export default function Layout() {
  const { fetchProducts, fetchSettings, loading } = useStore()

  useEffect(() => {
    fetchProducts()
    fetchSettings()
  }, [])

  return (
    <div className="flex h-screen bg-[#F5F5F0]">
      <aside className="w-64 bg-[#1B4332] text-white flex flex-col shrink-0 shadow-xl">
        <div className="px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#B8912E] flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: '"DM Serif Display", serif' }}>
                ProfitLab
              </h1>
              <p className="text-xs text-white/50 mt-0.5">套餐毛利测算工具</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ to, label, icon: Icon, desc }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-white/15 to-white/5 text-white font-medium shadow-md'
                    : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                }`
              }
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                false ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{desc}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse" />
              <span className="text-xs text-white/60">系统状态</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">AI 引擎</span>
                <span className="text-xs font-mono text-white/70">:8844</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">前端面板</span>
                <span className="text-xs font-mono text-white/70">:3844</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">运行状态</span>
                <span className="text-xs text-green-400 font-medium">在线</span>
              </div>
            </div>
          </div>
          {loading && (
            <div className="mt-3 flex items-center gap-2 bg-[#D4A843]/20 rounded-lg px-3 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
              <span className="text-[10px] text-[#D4A843]">AI 计算中...</span>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

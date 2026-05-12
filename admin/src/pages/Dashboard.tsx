import { useEffect, useState } from 'react'
import { IconUsers, IconMapPin, IconCircleCheck, IconCircleX, IconActivity } from '@tabler/icons-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import StatsCard from '@/components/StatsCard'
import StatusBadge from '@/components/StatusBadge'
import { LoadingSpinner } from '@/components/Loading'
import { analyticsService } from '@/services/analyticsService'
import toast from 'react-hot-toast'

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '12px',
  color: '#f1f5f9',
  fontSize: '12px',
}

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [clientsByMonth, setClientsByMonth] = useState<any[]>([])
  const [placesByCategory, setPlacesByCategory] = useState<any[]>([])
  const [placesByMonth, setPlacesByMonth] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, cm, pc, pm, ra] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getClientsByMonth(),
          analyticsService.getPlacesByCategory(),
          analyticsService.getPlacesByMonth(),
          analyticsService.getRecentActivity(),
        ])
        setSummary(s)
        setClientsByMonth(cm)
        setPlacesByCategory(pc)
        setPlacesByMonth(pm)
        setRecentActivity(ra)
      } catch {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clients"
          value={summary?.clients.total ?? 0}
          subtitle="All registered clients"
          icon={<IconUsers size={22} />}
          iconBg="bg-gradient-to-br from-brand-500 to-brand-700"
          color="text-brand-400"
        />
        <StatsCard
          title="Active Clients"
          value={summary?.clients.active ?? 0}
          subtitle={`${summary?.clients.inactive ?? 0} inactive`}
          icon={<IconCircleCheck size={22} />}
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
          color="text-emerald-400"
        />
        <StatsCard
          title="Total Places"
          value={summary?.places.total ?? 0}
          subtitle="All registered places"
          icon={<IconMapPin size={22} />}
          iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
          color="text-amber-400"
        />
        <StatsCard
          title="Active Places"
          value={summary?.places.active ?? 0}
          subtitle={`${summary?.places.inactive ?? 0} inactive`}
          icon={<IconCircleX size={22} />}
          iconBg="bg-gradient-to-br from-violet-500 to-violet-700"
          color="text-violet-400"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Clients by Month */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <IconActivity size={18} className="text-brand-400" />
            <h3 className="text-sm font-semibold text-white">Client Registrations</h3>
            <span className="text-xs text-dark-500 ml-auto">Last 12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={clientsByMonth}>
              <defs>
                <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ stroke: '#334155' }} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#clientGrad)" strokeWidth={2} name="Clients" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Places by Category */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <IconMapPin size={18} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Places by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={placesByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {placesByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <IconMapPin size={18} className="text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Place Additions Over Time</h3>
          <span className="text-xs text-dark-500 ml-auto">Last 12 months</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={placesByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Places" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Clients</h3>
          <div className="space-y-3">
            {recentActivity?.recentClients?.map((c: any) => (
              <div key={c._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-dark-500 truncate">{c.email}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {!recentActivity?.recentClients?.length && (
              <p className="text-sm text-dark-500 text-center py-4">No recent clients</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Places</h3>
          <div className="space-y-3">
            {recentActivity?.recentPlaces?.map((p: any) => (
              <div key={p._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-dark-500 truncate">{p.city} · {p.category}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
            {!recentActivity?.recentPlaces?.length && (
              <p className="text-sm text-dark-500 text-center py-4">No recent places</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

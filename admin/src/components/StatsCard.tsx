import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  iconBg: string
  trend?: { value: number; label: string }
  color?: string
}

export default function StatsCard({ title, value, subtitle, icon, iconBg, trend, color = 'text-white' }: Props) {
  return (
    <div className="stat-card animate-fade-in group">
      <div>
        <p className="text-sm text-dark-400 mb-1">{title}</p>
        <p className={clsx('text-3xl font-bold', color)}>{value}</p>
        {subtitle && <p className="text-xs text-dark-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={clsx('text-xs font-medium', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-dark-500">{trend.label}</span>
          </div>
        )}
      </div>
      <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110', iconBg)}>
        {icon}
      </div>
    </div>
  )
}

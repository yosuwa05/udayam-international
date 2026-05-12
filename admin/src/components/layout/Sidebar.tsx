import { NavLink } from 'react-router-dom'
import {
  IconLayoutDashboard,
  IconUsers,
  IconMapPin,
  IconSettings,
  IconChevronRight,
  IconShieldCheck,
} from '@tabler/icons-react'
import clsx from 'clsx'

const navItems = [
  { to: '/', icon: IconLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/clients', icon: IconUsers, label: 'Clients' },
  { to: '/places', icon: IconMapPin, label: 'Places' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-950 border-r border-dark-800 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
          <IconShieldCheck size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">AdminPanel</p>
          <p className="text-xs text-dark-500">Management Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-dark-600 uppercase tracking-wider px-4 mb-3">Menu</p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx('sidebar-link', { active: isActive })
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <IconChevronRight size={14} className="opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-dark-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-900">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-dark-500 truncate">admin@panel.com</p>
          </div>
          <IconSettings size={16} className="text-dark-500 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </aside>
  )
}

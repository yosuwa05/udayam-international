import { useLocation } from 'react-router-dom'
import { IconBell, IconSearch } from '@tabler/icons-react'

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview & analytics' },
  '/clients': { title: 'Clients', subtitle: 'Manage your client database' },
  '/places': { title: 'Places', subtitle: 'Manage locations & venues' },
}

export default function Header() {
  const { pathname } = useLocation()
  const page = routeTitles[pathname] || { title: 'Admin Panel', subtitle: '' }
  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="h-16 bg-dark-950 border-b border-dark-800 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-white">{page.title}</h1>
        <p className="text-xs text-dark-500">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs text-dark-500 hidden md:block">{now}</p>
        <button className="w-9 h-9 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-dark-400 hover:text-white hover:border-dark-700 transition-all">
          <IconSearch size={16} />
        </button>
        <button className="w-9 h-9 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-dark-400 hover:text-white hover:border-dark-700 transition-all relative">
          <IconBell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border-2 border-dark-950"></span>
        </button>
      </div>
    </header>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { _axios } from '@/lib/axios'
import { PlaneTakeoff, Map, Package, Activity, Ban } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tourism-dashboard-stats'],
    queryFn: async () => {
      const res = await _axios.get('/tourism/dashboard')
      return res.data.data
    },
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your tourism packages.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          Failed to load dashboard statistics.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Packages"
            value={data?.totalPackages}
            icon={<Package className="w-6 h-6 text-blue-600" />}
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Domestic Packages"
            value={data?.domesticPackages}
            icon={<Map className="w-6 h-6 text-green-600" />}
            bgColor="bg-green-100"
          />
          <StatCard
            title="International Packages"
            value={data?.internationalPackages}
            icon={<PlaneTakeoff className="w-6 h-6 text-purple-600" />}
            bgColor="bg-purple-100"
          />
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string
  value: number
  icon: React.ReactNode
  bgColor: string
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${bgColor}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value || 0}</h3>
      </div>
    </div>
  )
}

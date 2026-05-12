import { IconLoader2 } from '@tabler/icons-react'

interface Props {
  rows?: number
  cols?: number
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <IconLoader2 size={32} className="text-brand-500 animate-spin" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: Props) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3.5 border-t border-dark-800">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-dark-800 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ message = 'No data found' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
        <span className="text-2xl">📭</span>
      </div>
      <p className="text-sm text-dark-400">{message}</p>
    </div>
  )
}

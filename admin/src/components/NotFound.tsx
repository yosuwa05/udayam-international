// app/routes/__not-found.tsx
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Home, LayoutDashboard } from 'lucide-react'

export function NotFound() {
  return (
    <div
      className="min-h-[95dvh] flex items-center justify-center p-5"
      style={{
        background:
          'linear-gradient(135deg, #0a1f22 0%, #0d2b2e 50%, #112f2f 100%)',
      }}
    >
      {/* Subtle gold ring glow behind the 404 */}
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative text-center space-y-8 z-10">
        {/* 404 */}
        <h1
          className="text-[10rem] leading-none font-black select-none tracking-tighter"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(201,162,39,0.25)',
          }}
        >
          404
        </h1>

        {/* Gold divider line */}
        <div
          className="mx-auto h-px w-24"
          style={{
            background:
              'linear-gradient(90deg, transparent, #c9a227, transparent)',
          }}
        />

        {/* Copy */}
        <div className="space-y-3">
          <p className="text-3xl font-bold text-white tracking-wide">
            Page Not Found
          </p>
          <p
            className="text-base max-w-sm mx-auto leading-relaxed"
            style={{ color: 'rgba(201,162,39,0.7)' }}
          >
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            asChild
            size="lg"
            className="gap-2 font-semibold text-sm px-6"
            style={{
              background: '#c9a227',
              color: '#1a1a1a',
              border: 'none',
            }}
          >
            <Link to="/">
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 font-semibold text-sm px-6"
            style={{
              background: 'transparent',
              border: '1px solid rgba(201,162,39,0.4)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

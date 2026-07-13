import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/layouts/Header'
import { Sidebar } from '@/layouts/Sidebar'

type AppShellProps = {
  children?: ReactNode
}

/**
 * App chrome: fixed-height viewport.
 * Sidebar + header stay put; only main content scrolls.
 */
export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-50/80 to-transparent dark:from-brand-950/30"
          />
          <div className="relative mx-auto w-full max-w-7xl pb-10">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

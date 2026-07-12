import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/layouts/Header'
import { Sidebar } from '@/layouts/Sidebar'

type AppShellProps = {
  children?: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="relative flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-50/80 to-transparent dark:from-brand-950/30"
          />
          <div className="relative mx-auto w-full max-w-7xl">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

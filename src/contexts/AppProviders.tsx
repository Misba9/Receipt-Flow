import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { RouteSeo } from '@/components/RouteSeo'
import { CanonicalPathRedirect } from '@/components/seo/CanonicalPathRedirect'
import { AuthProvider } from '@/contexts/AuthProvider'
import { CompanyBrandingProvider } from '@/contexts/CompanyBrandingProvider'
import { QueryProvider } from '@/contexts/QueryProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { ToastProvider } from '@/contexts/ToastProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <CanonicalPathRedirect />
          <RouteSeo />
          <AuthProvider>
            <CompanyBrandingProvider>
              <ToastProvider>{children}</ToastProvider>
            </CompanyBrandingProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}

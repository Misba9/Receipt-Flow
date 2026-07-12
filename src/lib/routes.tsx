import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CompanyActiveGate } from '@/components/CompanyActiveGate'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { GuestRoute } from '@/components/GuestRoute'
import { OnboardingGate } from '@/components/OnboardingGate'
import { PageLoader } from '@/components/PageLoader'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { SuperAdminRoute } from '@/components/SuperAdminRoute'
import { AppShell } from '@/layouts/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { Login } from '@/pages/Login'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Register } from '@/pages/Register'
import { paths } from '@/lib/paths'

const ForgotPassword = lazy(() =>
  import('@/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })),
)
const ResetPassword = lazy(() =>
  import('@/pages/ResetPassword').then((m) => ({ default: m.ResetPassword })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const CustomersPage = lazy(() =>
  import('@/pages/CustomersPage').then((m) => ({ default: m.CustomersPage })),
)
const InvoicesPage = lazy(() =>
  import('@/pages/InvoicesPage').then((m) => ({ default: m.InvoicesPage })),
)
const InvoiceDetailPage = lazy(() =>
  import('@/pages/InvoiceDetailPage').then((m) => ({
    default: m.InvoiceDetailPage,
  })),
)
const InvoiceCreatePage = lazy(() =>
  import('@/pages/InvoiceFormPage').then((m) => ({
    default: m.InvoiceCreatePage,
  })),
)
const InvoiceEditPage = lazy(() =>
  import('@/pages/InvoiceFormPage').then((m) => ({
    default: m.InvoiceEditPage,
  })),
)
const ReportsPage = lazy(() =>
  import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const OnboardingPage = lazy(() =>
  import('@/pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })),
)
const AuthCallbackPage = lazy(() =>
  import('@/pages/AuthCallbackPage').then((m) => ({
    default: m.AuthCallbackPage,
  })),
)
const AdminDashboardPage = lazy(() =>
  import('@/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
)
const AdminCompaniesPage = lazy(() =>
  import('@/pages/AdminCompaniesPage').then((m) => ({
    default: m.AdminCompaniesPage,
  })),
)
const AdminUsersPage = lazy(() =>
  import('@/pages/AdminUsersPage').then((m) => ({
    default: m.AdminUsersPage,
  })),
)
const CompanyDisabledPage = lazy(() =>
  import('@/pages/CompanyDisabledPage').then((m) => ({
    default: m.CompanyDisabledPage,
  })),
)

function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader label="Loading page…" />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={paths.landing} element={<LandingPage />} />

      <Route element={<GuestRoute />}>
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route
          path={paths.forgotPassword}
          element={
            <LazyRoute>
              <ForgotPassword />
            </LazyRoute>
          }
        />
      </Route>

      <Route
        path={paths.authCallback}
        element={
          <LazyRoute>
            <AuthCallbackPage />
          </LazyRoute>
        }
      />

      <Route
        path={paths.onboarding}
        element={
          <LazyRoute>
            <OnboardingPage />
          </LazyRoute>
        }
      />

      <Route
        path={paths.resetPassword}
        element={
          <LazyRoute>
            <ResetPassword />
          </LazyRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path={paths.companyDisabled}
          element={
            <LazyRoute>
              <CompanyDisabledPage />
            </LazyRoute>
          }
        />

        <Route element={<CompanyActiveGate />}>
          <Route element={<AppShell />}>
            <Route element={<SuperAdminRoute />}>
              <Route
                path={paths.admin}
                element={
                  <LazyRoute>
                    <AdminDashboardPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.adminCompanies}
                element={
                  <LazyRoute>
                    <AdminCompaniesPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.adminUsers}
                element={
                  <LazyRoute>
                    <AdminUsersPage />
                  </LazyRoute>
                }
              />
            </Route>
          </Route>

          <Route element={<OnboardingGate />}>
            <Route element={<AppShell />}>
              <Route
                path={paths.dashboard}
                element={
                  <LazyRoute>
                    <DashboardPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.customers}
                element={
                  <LazyRoute>
                    <CustomersPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.invoices}
                element={
                  <LazyRoute>
                    <InvoicesPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.invoiceNew}
                element={
                  <LazyRoute>
                    <InvoiceCreatePage />
                  </LazyRoute>
                }
              />
              <Route
                path="/invoices/:id"
                element={
                  <LazyRoute>
                    <InvoiceDetailPage />
                  </LazyRoute>
                }
              />
              <Route
                path="/invoices/:id/edit"
                element={
                  <LazyRoute>
                    <InvoiceEditPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.reports}
                element={
                  <LazyRoute>
                    <ReportsPage />
                  </LazyRoute>
                }
              />
              <Route
                path={paths.settings}
                element={
                  <LazyRoute>
                    <SettingsPage />
                  </LazyRoute>
                }
              />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to={paths.landing} replace />} />
      <Route path="/app" element={<Navigate to={paths.dashboard} replace />} />
      <Route
        path={paths.receipts}
        element={<Navigate to={paths.invoices} replace />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

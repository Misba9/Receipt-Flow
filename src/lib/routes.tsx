import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CompanyActiveGate } from '@/components/CompanyActiveGate'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { GuestRoute } from '@/components/GuestRoute'
import { OnboardingGate } from '@/components/OnboardingGate'
import { PageLoader } from '@/components/PageLoader'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { SuperAdminRoute } from '@/components/SuperAdminRoute'
import {
  LANDING_ROUTE_META,
  TOOL_ROUTE_META,
  COMPARISON_ROUTE_META,
} from '@/content/public-route-meta'
import {
  FEATURES_INDEX_PATH,
  INDUSTRIES_INDEX_PATH,
  LOCATIONS_INDEX_PATH,
  PRICING_PATH,
} from '@/lib/breadcrumbs'
import { APP_REDIRECTS, MARKETING_REDIRECTS } from '@/lib/redirects'
import { paths } from '@/lib/paths'

const AppShell = lazy(() =>
  import('@/layouts/AppShell').then((m) => ({ default: m.AppShell })),
)
const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const Login = lazy(() =>
  import('@/pages/Login').then((m) => ({ default: m.Login })),
)
const Register = lazy(() =>
  import('@/pages/Register').then((m) => ({ default: m.Register })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const SeoLandingPage = lazy(() =>
  import('@/pages/SeoLandingPage').then((m) => ({ default: m.SeoLandingPage })),
)
const BlogIndexPage = lazy(() =>
  import('@/pages/blog/BlogIndexPage').then((m) => ({
    default: m.BlogIndexPage,
  })),
)
const BlogCategoryPage = lazy(() =>
  import('@/pages/blog/BlogCategoryPage').then((m) => ({
    default: m.BlogCategoryPage,
  })),
)
const BlogArticlePage = lazy(() =>
  import('@/pages/blog/BlogArticlePage').then((m) => ({
    default: m.BlogArticlePage,
  })),
)
const SeoToolPage = lazy(() =>
  import('@/pages/SeoToolPage').then((m) => ({ default: m.SeoToolPage })),
)
const ToolsIndexPage = lazy(() =>
  import('@/pages/SeoToolPage').then((m) => ({ default: m.ToolsIndexPage })),
)
const FeaturesIndexPage = lazy(() =>
  import('@/pages/MarketingHubPages').then((m) => ({
    default: m.FeaturesIndexPage,
  })),
)
const IndustriesIndexPage = lazy(() =>
  import('@/pages/MarketingHubPages').then((m) => ({
    default: m.IndustriesIndexPage,
  })),
)
const LocationsIndexPage = lazy(() =>
  import('@/pages/MarketingHubPages').then((m) => ({
    default: m.LocationsIndexPage,
  })),
)
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((m) => ({
    default: m.PricingPage,
  })),
)
const AboutPage = lazy(() =>
  import('@/pages/LegalPages').then((m) => ({ default: m.AboutPage })),
)
const PrivacyPage = lazy(() =>
  import('@/pages/LegalPages').then((m) => ({ default: m.PrivacyPage })),
)
const TermsPage = lazy(() =>
  import('@/pages/LegalPages').then((m) => ({ default: m.TermsPage })),
)
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const ComparisonPage = lazy(() =>
  import('@/pages/ComparisonPage').then((m) => ({
    default: m.ComparisonPage,
  })),
)
const ComparisonsIndexPage = lazy(() =>
  import('@/pages/ComparisonPage').then((m) => ({
    default: m.ComparisonsIndexPage,
  })),
)

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

function MarketingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-[100svh] bg-surface-950"
          aria-busy="true"
          aria-label="Loading"
        />
      }
    >
      {children}
    </Suspense>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={paths.landing}
        element={
          <MarketingSuspense>
            <LandingPage />
          </MarketingSuspense>
        }
      />

      {LANDING_ROUTE_META.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            <MarketingSuspense>
              <SeoLandingPage slug={page.slug!} />
            </MarketingSuspense>
          }
        />
      ))}

      <Route
        path={paths.blog}
        element={
          <MarketingSuspense>
            <BlogIndexPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/blog/category/:categorySlug"
        element={
          <MarketingSuspense>
            <BlogCategoryPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/article/:slug"
        element={
          <MarketingSuspense>
            <BlogArticlePage />
          </MarketingSuspense>
        }
      />

      <Route
        path={paths.tools}
        element={
          <MarketingSuspense>
            <ToolsIndexPage />
          </MarketingSuspense>
        }
      />
      {TOOL_ROUTE_META.map((tool) => (
        <Route
          key={tool.path}
          path={tool.path}
          element={
            <MarketingSuspense>
              <SeoToolPage toolId={tool.slug as never} />
            </MarketingSuspense>
          }
        />
      ))}

      <Route
        path={FEATURES_INDEX_PATH}
        element={
          <MarketingSuspense>
            <FeaturesIndexPage />
          </MarketingSuspense>
        }
      />
      <Route
        path={INDUSTRIES_INDEX_PATH}
        element={
          <MarketingSuspense>
            <IndustriesIndexPage />
          </MarketingSuspense>
        }
      />
      <Route
        path={LOCATIONS_INDEX_PATH}
        element={
          <MarketingSuspense>
            <LocationsIndexPage />
          </MarketingSuspense>
        }
      />
      <Route
        path={PRICING_PATH}
        element={
          <MarketingSuspense>
            <PricingPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/comparisons"
        element={
          <MarketingSuspense>
            <ComparisonsIndexPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/about"
        element={
          <MarketingSuspense>
            <AboutPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/contact"
        element={
          <MarketingSuspense>
            <ContactPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/privacy"
        element={
          <MarketingSuspense>
            <PrivacyPage />
          </MarketingSuspense>
        }
      />
      <Route
        path="/terms"
        element={
          <MarketingSuspense>
            <TermsPage />
          </MarketingSuspense>
        }
      />
      {COMPARISON_ROUTE_META.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            <MarketingSuspense>
              <ComparisonPage slug={page.slug!} />
            </MarketingSuspense>
          }
        />
      ))}

      <Route element={<GuestRoute />}>
        <Route
          path={paths.login}
          element={
            <LazyRoute>
              <Login />
            </LazyRoute>
          }
        />
        <Route
          path={paths.register}
          element={
            <LazyRoute>
              <Register />
            </LazyRoute>
          }
        />
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
          <Route
            element={
              <LazyRoute>
                <AppShell />
              </LazyRoute>
            }
          >
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
            <Route
              element={
                <LazyRoute>
                  <AppShell />
                </LazyRoute>
              }
            >
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

      {[...MARKETING_REDIRECTS, ...APP_REDIRECTS].map((redirect) => (
        <Route
          key={redirect.from}
          path={redirect.from}
          element={<Navigate to={redirect.to} replace />}
        />
      ))}
      <Route
        path="*"
        element={
          <LazyRoute>
            <NotFoundPage />
          </LazyRoute>
        }
      />
    </Routes>
  )
}

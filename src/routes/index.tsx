import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute } from '@/components/GuestRoute'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Login } from '@/pages/Login'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ReceiptsPage } from '@/pages/ReceiptsPage'
import { Register } from '@/pages/Register'
import { ResetPassword } from '@/pages/ResetPassword'
import { SettingsPage } from '@/pages/SettingsPage'
import { paths } from '@/routes/paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route path={paths.forgotPassword} element={<ForgotPassword />} />
      </Route>

      <Route path={paths.resetPassword} element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path={paths.receipts} element={<ReceiptsPage />} />
          <Route path={paths.settings} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to={paths.dashboard} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

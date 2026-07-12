import { Navigate } from 'react-router-dom'
import { paths } from '@/lib/paths'

/** Legacy register URL now starts the multi-step onboarding wizard. */
export function Register() {
  return <Navigate to={paths.onboarding} replace />
}

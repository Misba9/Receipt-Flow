import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Enforces trailingSlash: false for client-side navigations so canonical URLs stay clean.
 * Server redirects are handled in vercel.json.
 */
export function CanonicalPathRedirect() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const { pathname, search, hash } = location
    if (pathname.length > 1 && pathname.endsWith('/')) {
      navigate(`${pathname.replace(/\/+$/, '')}${search}${hash}`, {
        replace: true,
      })
    }
  }, [location, navigate])

  return null
}

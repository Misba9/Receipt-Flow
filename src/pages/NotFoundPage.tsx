import { Link } from 'react-router-dom'
import { Button, Card, CardDescription, CardTitle } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { paths } from '@/lib/paths'

export function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  useDocumentMeta({
    title: 'Page not found',
    description: 'The page you requested does not exist.',
    path: '/404',
    noIndex: true,
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm font-semibold tracking-wider text-surface-400 uppercase">
          404
        </p>
        <CardTitle className="mt-2 text-2xl">Page not found</CardTitle>
        <CardDescription className="mt-2">
          The page you are looking for does not exist or may have moved.
        </CardDescription>
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Link to={isAuthenticated ? paths.dashboard : paths.landing}>
            <Button>
              {isAuthenticated ? 'Go to dashboard' : 'Back to home'}
            </Button>
          </Link>
          {!isAuthenticated ? (
            <Link to={paths.login}>
              <Button variant="secondary">Sign in</Button>
            </Link>
          ) : null}
        </div>
      </Card>
    </div>
  )
}

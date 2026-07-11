import { Link } from 'react-router-dom'
import { Button, Card, CardDescription, CardTitle } from '@/components/ui'
import { paths } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <Card className="w-full max-w-md text-center">
        <CardTitle className="text-2xl">Page not found</CardTitle>
        <CardDescription className="mt-2">
          The page you are looking for does not exist.
        </CardDescription>
        <Link to={paths.dashboard} className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </Card>
    </div>
  )
}

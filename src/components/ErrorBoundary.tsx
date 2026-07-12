import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { APP_NAME } from '@/utils'

type ErrorBoundaryProps = {
  children: ReactNode
  /** Optional compact fallback for nested boundaries */
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  message: string | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: null,
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Something went wrong.',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  private handleReload = () => {
    window.location.assign('/')
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: null })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
        <div className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-8 text-center shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <p className="text-xs font-semibold tracking-wider text-surface-400 uppercase">
            {APP_NAME}
          </p>
          <h1 className="mt-2 text-xl font-semibold text-surface-900 dark:text-surface-50">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-surface-500">
            An unexpected error stopped this page from loading. You can try
            again or return home.
          </p>
          {this.state.message ? (
            <p className="mt-4 rounded-lg bg-surface-50 px-3 py-2 text-left font-mono text-xs break-all text-surface-600 dark:bg-surface-950 dark:text-surface-400">
              {this.state.message}
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" onClick={this.handleRetry}>
              Try again
            </Button>
            <Button type="button" variant="secondary" onClick={this.handleReload}>
              Go home
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  LoaderCircle,
  Search,
  User,
  X,
} from 'lucide-react'
import { InvoiceStatusBadge } from '@/components/dashboard/InvoiceStatusBadge'
import { useGlobalSearch } from '@/services/search/hooks'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/utils'
import { paths } from '@/lib/paths'

type GlobalSearchProps = {
  className?: string
  /** Compact trigger for small screens */
  mobile?: boolean
}

export function GlobalSearch({ className, mobile = false }: GlobalSearchProps) {
  const navigate = useNavigate()
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const { data, isFetching, isError, error, debouncedQuery, isDebouncing } =
    useGlobalSearch(query)

  const trimmed = query.trim()
  const showHint = open && trimmed.length > 0 && trimmed.length < 2
  const showPanel =
    open &&
    trimmed.length >= 2 &&
    (Boolean(data) || isFetching || isDebouncing || isError)

  const customers = data?.customers ?? []
  const invoices = data?.invoices ?? []
  const hasResults = customers.length > 0 || invoices.length > 0
  const showEmpty =
    !isFetching &&
    !isDebouncing &&
    !isError &&
    debouncedQuery.length >= 2 &&
    !hasResults

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        if (mobile) setMobileExpanded(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        if (mobile) setMobileExpanded(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobile])

  useEffect(() => {
    if (mobileExpanded) {
      inputRef.current?.focus()
    }
  }, [mobileExpanded])

  const closeAndClear = () => {
    setQuery('')
    setOpen(false)
    if (mobile) setMobileExpanded(false)
  }

  const goToCustomer = (name: string) => {
    navigate(`${paths.customers}?q=${encodeURIComponent(name)}`)
    closeAndClear()
  }

  const goToInvoice = (id: string) => {
    navigate(paths.invoiceDetail(id))
    closeAndClear()
  }

  if (mobile && !mobileExpanded) {
    return (
      <button
        type="button"
        onClick={() => setMobileExpanded(true)}
        className={cn(
          'rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
          className,
        )}
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        mobile &&
          'fixed inset-x-0 top-0 z-50 border-b border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-950',
        className,
      )}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search name, phone, email, invoice…"
          className="h-10 w-full rounded-lg border border-surface-200 bg-surface-50 pr-9 pl-9 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50 dark:focus:bg-surface-900"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showPanel}
          role="combobox"
          autoComplete="off"
        />
        {query || (mobile && mobileExpanded) ? (
          <button
            type="button"
            onClick={closeAndClear}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showHint ? (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-500 shadow-xl dark:border-surface-700 dark:bg-surface-900">
          Type at least 2 characters to search.
        </div>
      ) : null}

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-[28rem] w-full overflow-y-auto rounded-xl border border-surface-200 bg-white shadow-xl dark:border-surface-700 dark:bg-surface-900"
        >
          {(isFetching || isDebouncing) && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-surface-500">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          )}

          {isError ? (
            <p className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'Search failed.'}
            </p>
          ) : null}

          {showEmpty ? (
            <p className="px-4 py-6 text-center text-sm text-surface-500">
              No results for “{debouncedQuery}”
            </p>
          ) : null}

          {customers.length > 0 ? (
            <section className="border-b border-surface-100 py-2 dark:border-surface-800">
              <p className="px-4 py-1.5 text-[11px] font-semibold tracking-wider text-surface-400 uppercase">
                Customers
              </p>
              <ul>
                {customers.map((customer) => (
                  <li key={customer.id}>
                    <button
                      type="button"
                      role="option"
                      className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/70"
                      onClick={() => goToCustomer(customer.name)}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                        <User className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-surface-900 dark:text-surface-50">
                          {customer.name}
                        </span>
                        <span className="block truncate text-xs text-surface-500">
                          {[customer.email, customer.phone]
                            .filter(Boolean)
                            .join(' · ') || 'No contact info'}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {invoices.length > 0 ? (
            <section className="py-2">
              <p className="px-4 py-1.5 text-[11px] font-semibold tracking-wider text-surface-400 uppercase">
                Invoices
              </p>
              <ul>
                {invoices.map((invoice) => (
                  <li key={invoice.id}>
                    <button
                      type="button"
                      role="option"
                      className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/70"
                      onClick={() => goToInvoice(invoice.id)}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-surface-900 dark:text-surface-50">
                            {invoice.invoice_number}
                          </span>
                          <InvoiceStatusBadge status={invoice.status} />
                        </span>
                        <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-surface-500">
                          <span className="truncate">
                            {invoice.customer_name ?? 'Unknown customer'}
                          </span>
                          <span className="shrink-0 font-medium text-surface-700 dark:text-surface-300">
                            {formatCurrency(invoice.total, invoice.currency)}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

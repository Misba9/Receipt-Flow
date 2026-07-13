import { Mail, MapPin, Phone, Plus, User } from 'lucide-react'
import { highlightMatch } from '@/lib/highlightMatch'
import type { CustomerSuggestion } from '@/services/customers/types'
import { cn } from '@/utils'

type CustomerSuggestionsDropdownProps = {
  open: boolean
  query: string
  suggestions: CustomerSuggestion[]
  activeIndex: number
  loading?: boolean
  listId: string
  onHover: (index: number) => void
  onSelect: (customer: CustomerSuggestion) => void
  onCreateNew: () => void
}

export function CustomerSuggestionsDropdown({
  open,
  query,
  suggestions,
  activeIndex,
  loading = false,
  listId,
  onHover,
  onSelect,
  onCreateNew,
}: CustomerSuggestionsDropdownProps) {
  if (!open) return null

  return (
    <div
      id={listId}
      role="listbox"
      aria-label="Customer suggestions"
      className={cn(
        'absolute left-0 right-0 z-40 mt-1 max-h-80 overflow-y-auto rounded-xl border border-surface-200 bg-white shadow-lg',
        'dark:border-surface-700 dark:bg-surface-900',
      )}
    >
      {loading ? (
        <p className="px-3 py-3 text-sm text-surface-500">Searching…</p>
      ) : suggestions.length === 0 ? (
        <p className="px-3 py-3 text-sm text-surface-500">
          No matching customers found.
        </p>
      ) : (
        <ul className="py-1">
          {suggestions.map((customer, index) => {
            const active = index === activeIndex
            return (
              <li key={customer.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  id={`${listId}-option-${index}`}
                  aria-selected={active}
                  className={cn(
                    'flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors',
                    active
                      ? 'bg-brand-50 dark:bg-brand-500/10'
                      : 'hover:bg-surface-50 dark:hover:bg-surface-800/80',
                  )}
                  onMouseEnter={() => onHover(index)}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    onSelect(customer)
                  }}
                >
                  <span className="flex items-start gap-2 text-sm text-surface-900 dark:text-surface-50">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-surface-400" />
                    <span className="font-semibold">
                      {highlightMatch(customer.name, query)}
                    </span>
                  </span>
                  {customer.phone ? (
                    <span className="flex items-center gap-2 pl-6 text-xs text-surface-600 dark:text-surface-300">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-surface-400" />
                      <span>{highlightMatch(customer.phone, query)}</span>
                    </span>
                  ) : null}
                  {customer.email ? (
                    <span className="flex items-center gap-2 pl-6 text-xs text-surface-600 dark:text-surface-300">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-surface-400" />
                      <span className="truncate">
                        {highlightMatch(customer.email, query)}
                      </span>
                    </span>
                  ) : null}
                  {customer.address_line1 ? (
                    <span className="flex items-start gap-2 pl-6 text-xs text-surface-500 dark:text-surface-400">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-surface-400" />
                      <span className="line-clamp-2">
                        {customer.address_line1}
                      </span>
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="border-t border-surface-100 dark:border-surface-800">
        <button
          type="button"
          role="option"
          aria-selected={activeIndex === suggestions.length}
          className={cn(
            'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-brand-600 transition-colors dark:text-brand-400',
            activeIndex === suggestions.length
              ? 'bg-brand-50 dark:bg-brand-500/10'
              : 'hover:bg-surface-50 dark:hover:bg-surface-800/80',
          )}
          onMouseEnter={() => onHover(suggestions.length)}
          onMouseDown={(event) => {
            event.preventDefault()
            onCreateNew()
          }}
        >
          <Plus className="h-4 w-4" />
          Create New Customer
        </button>
      </div>
    </div>
  )
}

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { CustomerSuggestionsDropdown } from '@/components/customers/CustomerSuggestionsDropdown'
import { useCustomerAutocompleteSearch } from '@/services/customers/autocomplete'
import type { CustomerSuggestion } from '@/services/customers/types'

export type CustomerAutocompleteFieldKey = 'name' | 'phone' | 'email'

type UseCustomerAutocompleteOptions = {
  /** Current values used to drive search from the active field. */
  getFieldValue: (field: CustomerAutocompleteFieldKey) => string
  excludeId?: string
  enabled?: boolean
  onSelect: (customer: CustomerSuggestion) => void
}

export function useCustomerAutocomplete({
  getFieldValue,
  excludeId,
  enabled = true,
  onSelect,
}: UseCustomerAutocompleteOptions) {
  const listId = useId()
  const [activeField, setActiveField] =
    useState<CustomerAutocompleteFieldKey | null>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const blurTimer = useRef<number | null>(null)

  const query = activeField ? getFieldValue(activeField) : ''
  const { data, isFetching, debouncedQuery, isDebouncing } =
    useCustomerAutocompleteSearch(query, {
      enabled: enabled && open && Boolean(activeField) && query.trim().length >= 1,
      excludeId,
      limit: 10,
    })

  const suggestions = data ?? []
  const optionCount = suggestions.length + 1 // + Create New

  const close = useCallback(() => {
    setOpen(false)
    setActiveIndex(0)
  }, [])

  const openForField = useCallback((field: CustomerAutocompleteFieldKey) => {
    if (blurTimer.current) {
      window.clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
    setActiveField(field)
    setOpen(true)
    setActiveIndex(0)
  }, [])

  const handleBlur = useCallback(() => {
    blurTimer.current = window.setTimeout(() => {
      close()
      setActiveField(null)
    }, 150)
  }, [close])

  const handleCreateNew = useCallback(() => {
    close()
  }, [close])

  const handleSelect = useCallback(
    (customer: CustomerSuggestion) => {
      onSelect(customer)
      close()
      setActiveField(null)
    },
    [close, onSelect],
  )

  useEffect(() => {
    setActiveIndex(0)
  }, [debouncedQuery, suggestions.length])

  useEffect(() => {
    return () => {
      if (blurTimer.current) window.clearTimeout(blurTimer.current)
    }
  }, [])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        if (query.trim().length >= 1) {
          setOpen(true)
          event.preventDefault()
        }
        return
      }

      if (!open) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % optionCount)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => (index - 1 + optionCount) % optionCount)
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key === 'Enter' && open) {
        event.preventDefault()
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex])
        } else {
          handleCreateNew()
        }
      }
    },
    [
      activeIndex,
      close,
      handleCreateNew,
      handleSelect,
      open,
      optionCount,
      query,
      suggestions,
    ],
  )

  const dropdownProps = {
    open:
      open &&
      Boolean(activeField) &&
      query.trim().length >= 1 &&
      (!isDebouncing || suggestions.length > 0 || isFetching),
    query: debouncedQuery || query,
    suggestions,
    activeIndex,
    loading: isFetching || isDebouncing,
    listId,
    onHover: setActiveIndex,
    onSelect: handleSelect,
    onCreateNew: handleCreateNew,
  }

  const getInputA11y = (field: CustomerAutocompleteFieldKey) => ({
    role: 'combobox' as const,
    'aria-expanded': open && activeField === field,
    'aria-controls': listId,
    'aria-autocomplete': 'list' as const,
    'aria-activedescendant':
      open && activeField === field
        ? `${listId}-option-${activeIndex}`
        : undefined,
    autoComplete: 'off' as const,
    onFocus: () => openForField(field),
    onBlur: handleBlur,
    onKeyDown,
  })

  return {
    activeField,
    dropdownProps,
    getInputA11y,
    renderDropdownFor: (field: CustomerAutocompleteFieldKey) =>
      activeField === field ? (
        <CustomerSuggestionsDropdown {...dropdownProps} />
      ) : null,
  }
}

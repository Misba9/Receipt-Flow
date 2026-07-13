import type { FieldErrors, FieldValues } from 'react-hook-form'

/** Whether to show the green “Looks good” state for a field. */
export function showFieldSuccess(options: {
  dirty?: boolean
  touched?: boolean
  invalid?: boolean
  value?: unknown
  /** Empty optional fields should not show success. */
  requireValue?: boolean
}): boolean {
  const interacted = Boolean(options.dirty || options.touched)
  if (!interacted || options.invalid) return false
  if (options.requireValue === false) return true
  if (typeof options.value === 'string') return options.value.trim().length > 0
  if (typeof options.value === 'number') return Number.isFinite(options.value)
  return options.value != null && options.value !== ''
}

export function fieldErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: keyof T & string,
): string | undefined {
  const error = errors[name]
  if (!error) return undefined
  if (typeof error.message === 'string') return error.message
  return undefined
}

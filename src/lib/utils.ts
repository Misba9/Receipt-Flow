export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ReceiptFlow'

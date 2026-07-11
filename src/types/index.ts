export type Theme = 'light' | 'dark' | 'system'

export type NavItem = {
  label: string
  href: string
  icon?: string
}

export type ApiError = {
  message: string
  code?: string
}

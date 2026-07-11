export const paths = {
  home: '/',
  dashboard: '/',
  receipts: '/receipts',
  settings: '/settings',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]

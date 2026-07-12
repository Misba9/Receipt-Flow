/** Applies company brand color to CSS variables used across the app. */
export function applyBrandColor(hex: string) {
  const root = document.documentElement
  root.style.setProperty('--company-brand', hex)
  root.style.setProperty('--color-brand-600', hex)
}

export function clearBrandColor() {
  const root = document.documentElement
  root.style.removeProperty('--company-brand')
  root.style.removeProperty('--color-brand-600')
}

/**
 * Public site navigation tree (header + footer).
 * Keep labels short; paths must match live marketing routes.
 */
export type SiteNavLink = {
  label: string
  path: string
}

export type SiteNavGroup = {
  label: string
  /** Hub / overview path for the group label itself */
  path: string
  children: SiteNavLink[]
}

export const SITE_NAV_FEATURES: SiteNavGroup = {
  label: 'Features',
  path: '/features',
  children: [
    { label: 'Invoice Software', path: '/invoice-software' },
    { label: 'Customer Management', path: '/customer-management' },
    { label: 'Reports', path: '/reports' },
    { label: 'Dashboard', path: '/sales-dashboard' },
    { label: 'Email Invoice', path: '/email-invoices' },
  ],
}

export const SITE_NAV_INDUSTRIES: SiteNavGroup = {
  label: 'Industries',
  path: '/industries',
  children: [
    { label: 'Grocery', path: '/billing-software-for-grocery-stores' },
    { label: 'Mobile Shop', path: '/billing-software-for-mobile-shops' },
    { label: 'Medical', path: '/billing-software-for-medical-stores' },
    { label: 'Electronics', path: '/billing-software-for-electronics-stores' },
    { label: 'Hardware', path: '/billing-software-for-hardware-stores' },
  ],
}

export const SITE_NAV_LOCATIONS: SiteNavGroup = {
  label: 'Locations',
  path: '/locations',
  children: [
    { label: 'Hyderabad', path: '/billing-software-hyderabad' },
    { label: 'Bangalore', path: '/billing-software-bangalore' },
    { label: 'Chennai', path: '/billing-software-chennai' },
    { label: 'Delhi', path: '/billing-software-delhi' },
  ],
}

export const SITE_NAV_PRIMARY: SiteNavLink[] = [
  { label: 'Pricing', path: '/pricing' },
  { label: 'Blog', path: '/blog' },
  { label: 'Free Tools', path: '/tools' },
  { label: 'Compare', path: '/comparisons' },
]

export const SITE_NAV_COMPANY: SiteNavLink[] = [
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export const SITE_NAV_LEGAL: SiteNavLink[] = [
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
]

export const SITE_NAV_GROUPS: SiteNavGroup[] = [
  SITE_NAV_FEATURES,
  SITE_NAV_INDUSTRIES,
  SITE_NAV_LOCATIONS,
]

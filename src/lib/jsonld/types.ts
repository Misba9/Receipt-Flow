/**
 * Google Rich Results–oriented JSON-LD helpers for ReceiptFlow.
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

export type JsonLdNode = Record<string, unknown>

export type JsonLdGraph = {
  '@context': 'https://schema.org'
  '@graph': JsonLdNode[]
}

export type BreadcrumbCrumb = {
  name: string
  path: string
}

export type FaqEntry = {
  question: string
  answer: string
}

export type ReviewEntry = {
  authorName: string
  authorRole?: string
  quote: string
  /** 1–5; only set when a rating is honestly represented. */
  ratingValue?: number
}

export type ValidationIssue = {
  level: 'error' | 'warning'
  type: string
  message: string
  path?: string
}

export type ValidationResult = {
  ok: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

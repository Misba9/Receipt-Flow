import type { ReactNode } from 'react'

/** Highlight case-insensitive matches of `query` inside `text`. */
export function highlightMatch(text: string, query: string): ReactNode {
  const q = query.trim()
  if (!q || !text) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = q.toLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0
  let key = 0

  while (cursor < text.length) {
    const index = lowerText.indexOf(lowerQuery, cursor)
    if (index === -1) {
      parts.push(text.slice(cursor))
      break
    }
    if (index > cursor) {
      parts.push(text.slice(cursor, index))
    }
    parts.push(
      <mark
        key={`m-${key++}`}
        className="rounded-sm bg-brand-500/20 px-0.5 font-semibold text-brand-700 dark:bg-brand-400/25 dark:text-brand-200"
      >
        {text.slice(index, index + q.length)}
      </mark>,
    )
    cursor = index + q.length
  }

  return parts.length === 1 ? parts[0] : parts
}

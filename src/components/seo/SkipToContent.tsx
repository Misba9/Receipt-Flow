/** Shared skip link for marketing shells. */
export function SkipToContent({
  href = '#main-content',
}: {
  href?: string
}) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
    >
      Skip to content
    </a>
  )
}

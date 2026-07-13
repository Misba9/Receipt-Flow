import { Link } from 'react-router-dom'
import { blogCategoryPath } from '@/content/blog'

export function BlogTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <span className="inline-flex rounded-md bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-700">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function BlogCategoryPill({
  name,
  slug,
}: {
  name: string
  slug: string
}) {
  return (
    <Link
      to={blogCategoryPath(slug)}
      className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-brand-800 uppercase transition-colors hover:bg-brand-100"
    >
      {name}
    </Link>
  )
}

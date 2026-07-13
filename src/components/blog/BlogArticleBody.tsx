import type { BlogBlock, BlogSection } from '@/content/blog'

function BlockView({ block }: { block: BlogBlock }) {
  if (block.type === 'p') {
    return (
      <p className="text-base leading-relaxed text-surface-700 sm:text-[1.05rem]">
        {block.text}
      </p>
    )
  }

  if (block.type === 'callout') {
    return (
      <aside className="rounded-xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-sm leading-relaxed text-brand-950">
        {block.text}
      </aside>
    )
  }

  const ListTag = block.type === 'ol' ? 'ol' : 'ul'
  return (
    <ListTag
      className={
        block.type === 'ol'
          ? 'list-decimal space-y-2 pl-5 text-base leading-relaxed text-surface-700'
          : 'list-disc space-y-2 pl-5 text-base leading-relaxed text-surface-700'
      }
    >
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ListTag>
  )
}

export function BlogArticleBody({ sections }: { sections: BlogSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 space-y-4"
        >
          <h2 className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl">
            {section.heading}
          </h2>
          {section.blocks.map((block, index) => (
            <BlockView key={`${section.id}-${index}`} block={block} />
          ))}
        </section>
      ))}
    </div>
  )
}

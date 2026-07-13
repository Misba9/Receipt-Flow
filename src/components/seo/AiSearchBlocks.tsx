import type { ReactNode } from 'react'
import type { AiSearchBlock } from '@/content/ai-search'
import { cn } from '@/utils'

function SectionShell({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-12 sm:py-16', className)}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id={`${id}-heading`}
          className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl"
        >
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}

export function AiSummary({ text }: { text: string }) {
  return (
    <SectionShell id="summary" title="Summary" className="border-t border-surface-100 bg-white">
      <p
        className="max-w-3xl text-base leading-relaxed text-surface-700 sm:text-lg"
        data-speakable="true"
      >
        {text}
      </p>
    </SectionShell>
  )
}

export function AiKeyTakeaways({ items }: { items: string[] }) {
  return (
    <SectionShell
      id="key-takeaways"
      title="Key takeaways"
      className="border-t border-surface-100 bg-surface-50"
    >
      <ol className="max-w-3xl list-decimal space-y-3 pl-5 text-base leading-relaxed text-surface-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </SectionShell>
  )
}

export function AiProsCons({
  pros,
  cons,
}: {
  pros: string[]
  cons: string[]
}) {
  return (
    <SectionShell
      id="pros-cons"
      title="Pros and cons"
      className="border-t border-surface-100 bg-white"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
            Pros
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-surface-700">
            {pros.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-600" aria-hidden>
                  +
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-amber-900 uppercase">
            Cons
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-surface-700">
            {cons.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-700" aria-hidden>
                  −
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}

export function AiComparisonTable({
  heading,
  intro,
  columns,
  rows,
}: {
  heading: string
  intro: string
  columns: { left: string; right: string }
  rows: AiSearchBlock['comparisonRows']
}) {
  return (
    <SectionShell
      id="comparison"
      title={heading}
      className="border-t border-surface-100 bg-surface-50"
    >
      <p className="max-w-3xl text-base leading-relaxed text-surface-600">{intro}</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-surface-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <caption className="sr-only">{heading}</caption>
          <thead className="border-b border-surface-200 bg-surface-50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold text-surface-800">
                Criterion
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-surface-800">
                {columns.left}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-surface-800">
                {columns.right}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-b border-surface-100 align-top">
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-surface-900"
                >
                  {row.criterion}
                </th>
                <td className="px-4 py-3 text-surface-700">{row.receiptflow}</td>
                <td className="px-4 py-3 text-surface-700">{row.alternative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  )
}

export function AiEntityGlossary({
  entities,
}: {
  entities: AiSearchBlock['entities']
}) {
  return (
    <SectionShell
      id="entities"
      title="Key terms and entities"
      className="border-t border-surface-100 bg-white"
    >
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-surface-600">
        Clear definitions help people — and AI assistants — understand what this
        page covers.
      </p>
      <dl className="grid gap-5 sm:grid-cols-2">
        {entities.map((entity) => (
          <div
            key={entity.name}
            className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3"
          >
            <dt className="font-semibold text-surface-950">{entity.name}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-surface-600">
              {entity.description}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}

/** Full GEO/AEO block set in a stable, LLM-friendly order. */
export function AiSearchSections({
  block,
  className,
}: {
  block: AiSearchBlock
  className?: string
}) {
  return (
    <div className={className}>
      <AiSummary text={block.summary} />
      <AiKeyTakeaways items={block.keyTakeaways} />
      <AiProsCons pros={block.pros} cons={block.cons} />
      <AiComparisonTable
        heading={block.comparisonHeading}
        intro={block.comparisonIntro}
        columns={block.comparisonColumns}
        rows={block.comparisonRows}
      />
      <AiEntityGlossary entities={block.entities} />
    </div>
  )
}

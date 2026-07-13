import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { faqItems } from '@/components/landing/faq-data'
import { paths } from '@/lib/paths'
import { cn } from '@/utils'

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-surface-50 py-20 sm:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            Billing software FAQ
          </h2>
          <p className="mt-3 text-base text-surface-600 sm:text-lg">
            Answers about invoice software, GST billing, online billing, and
            customer management for small businesses.
          </p>
        </header>

        <div className="mt-10 divide-y divide-surface-200 border-y border-surface-200">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `${baseId}-panel-${index}`
            const buttonId = `${baseId}-button-${index}`

            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                  >
                    <span className="text-base font-semibold text-surface-950">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-surface-400 transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-surface-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-sm text-surface-600">
          Still deciding?{' '}
          <a href="#features" className="font-medium text-brand-700 hover:underline">
            Browse invoice software features
          </a>
          ,{' '}
          <a href="#get-started" className="font-medium text-brand-700 hover:underline">
            see pricing-free signup
          </a>
          , or{' '}
          <Link
            to={paths.register}
            className="font-medium text-brand-700 hover:underline"
          >
            create your account
          </Link>
          .
        </p>
      </div>
    </section>
  )
}

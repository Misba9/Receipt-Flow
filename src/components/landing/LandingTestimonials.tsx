const testimonials = [
  {
    quote:
      'We stopped chasing PDFs in email threads. Customers get a clean invoice and we know when it is paid.',
    name: 'Maya Chen',
    role: 'Founder, Harbor Studio',
  },
  {
    quote:
      'Multi-tenant from day one meant our agencies never see each other’s data. That was non-negotiable.',
    name: 'James Okonkwo',
    role: 'Ops lead, Ledger Collective',
  },
  {
    quote:
      'Reports and CSV export closed our month-end in half the time. The UI stays out of the way.',
    name: 'Sofia Alvarez',
    role: 'Finance, Northbeam Co.',
  },
]

export function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="testimonials-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            Trusted by teams who bill every week
          </h2>
          <p className="mt-3 text-base text-surface-600 sm:text-lg">
            Operators and founders use ReceiptFlow to keep invoicing calm and
            accountable.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name}>
              <blockquote className="text-base leading-relaxed text-surface-800">
                “{item.quote}”
              </blockquote>
              <footer className="mt-5">
                <p className="text-sm font-semibold text-surface-950">
                  {item.name}
                </p>
                <p className="text-sm text-surface-500">{item.role}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

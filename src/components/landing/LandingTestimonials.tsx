import { testimonials } from '@/components/landing/testimonials'

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
            Trusted by small businesses using online billing software
          </h2>
          <p className="mt-3 text-base text-surface-600 sm:text-lg">
            Operators and founders use ReceiptFlow invoice software to keep GST
            billing and customer management calm and accountable.
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

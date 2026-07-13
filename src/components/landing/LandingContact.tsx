import { useState, type FormEvent } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { APP_NAME } from '@/utils'

type ContactFormValues = {
  name: string
  email: string
  company: string
  message: string
}

export function LandingContact() {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setError('Please fill in your name, email, and message.')
      return
    }

    const subject = encodeURIComponent(
      `${APP_NAME} inquiry from ${values.name.trim()}`,
    )
    const body = encodeURIComponent(
      [
        `Name: ${values.name.trim()}`,
        `Email: ${values.email.trim()}`,
        `Company: ${values.company.trim() || '—'}`,
        '',
        values.message.trim(),
      ].join('\n'),
    )

    window.location.href = `mailto:hello@velonerp.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2
            id="contact-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            Talk with us
          </h2>
          <p className="mt-3 text-base leading-relaxed text-surface-600 sm:text-lg">
            Questions about Business plans, migrations, or multi-company
            rollouts? Send a note — we reply within one business day.
          </p>
          <p className="mt-8 text-sm text-surface-500">
            Prefer email directly?{' '}
            <a
              href="mailto:hello@velonerp.com"
              className="font-medium text-brand-700 hover:underline"
            >
              hello@velonerp.com
            </a>
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-surface-200 bg-surface-50 p-5 sm:p-6"
          noValidate
        >
          {submitted ? (
            <p className="text-sm leading-relaxed text-surface-700">
              Thanks — your mail client should open with the message ready to
              send. If it does not, email{' '}
              <a
                href="mailto:hello@velonerp.com"
                className="font-medium text-brand-700 hover:underline"
              >
                hello@velonerp.com
              </a>
              .
            </p>
          ) : (
            <>
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <Input
                label="Name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
              <Input
                label="Work email"
                type="email"
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                value={values.company}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    company: event.target.value,
                  }))
                }
              />
              <Textarea
                label="Message"
                name="message"
                rows={4}
                value={values.message}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                required
              />
              <Button type="submit" className="w-full sm:w-auto">
                Send message
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

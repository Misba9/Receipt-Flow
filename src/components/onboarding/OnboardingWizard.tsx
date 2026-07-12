import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EmailVerifyPanel } from '@/components/onboarding/EmailVerifyPanel'
import { OnboardingAccountStep } from '@/components/onboarding/OnboardingAccountStep'
import { OnboardingActions } from '@/components/onboarding/OnboardingActions'
import { OnboardingInvoicePreview } from '@/components/onboarding/OnboardingInvoicePreview'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { ColorField } from '@/components/settings/ColorField'
import { LogoUpload } from '@/components/settings/LogoUpload'
import {
  Alert,
  Button,
  Card,
  Input,
  Select,
  Spinner,
  Textarea,
  ThemeToggle,
} from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { applyBrandColor } from '@/lib/branding'
import { paths } from '@/lib/paths'
import { useSessionAccess } from '@/services/admin'
import {
  BUSINESS_TYPES,
  clearOnboardingSession,
  fileToDataUrl,
  finishOnboarding,
  loadOnboardingDraft,
  loadOnboardingStep,
  saveOnboardingDraft,
  saveOnboardingProgress,
  saveOnboardingStep,
  type OnboardingDraft,
} from '@/services/onboarding'
import {
  ensureCurrencyOption,
  ensureTimezoneOption,
} from '@/services/settings/options'
import {
  useCompanySettings,
  useUploadCompanyLogo,
} from '@/services/settings/hooks'
import { APP_NAME, cn } from '@/utils'

const businessOptions = BUSINESS_TYPES.map((value) => ({
  value,
  label: value,
}))

export function OnboardingWizard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    user,
    isAuthenticated,
    isEmailVerified,
    isLoading: authLoading,
    resendSignupEmail,
    refreshUser,
  } = useAuth()
  const { data: access } = useSessionAccess()
  const { data: company, isLoading: companyLoading, refetch } =
    useCompanySettings()
  const uploadLogo = useUploadCompanyLogo()

  const [step, setStep] = useState(() => loadOnboardingStep())
  const [draft, setDraft] = useState<OnboardingDraft>(() => loadOnboardingDraft())
  const [error, setError] = useState<string | null>(null)
  const [errorTitle, setErrorTitle] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const finishStarted = useRef(false)

  // Signed-in users skip account creation; unverified users still fill company data.
  const minStep = isAuthenticated ? 2 : 1
  const activeStep = Math.max(step, minStep)
  const showVerifiedSuccess = isEmailVerified && activeStep === 5

  useEffect(() => {
    saveOnboardingDraft(draft)
  }, [draft])

  useEffect(() => {
    saveOnboardingStep(activeStep)
  }, [activeStep])

  useEffect(() => {
    if (resendIn <= 0) return
    const id = window.setInterval(() => {
      setResendIn((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [resendIn])

  // Detect magic-link return / confirmation in another tab.
  useEffect(() => {
    if (activeStep !== 5 || isEmailVerified) return

    const check = () => {
      void refreshUser()
    }

    check()
    const id = window.setInterval(check, 2500)
    window.addEventListener('focus', check)

    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', check)
    }
  }, [activeStep, isEmailVerified, refreshUser])

  // After verification, persist workspace and redirect.
  useEffect(() => {
    if (!showVerifiedSuccess || error) return

    let cancelled = false

    void (async () => {
      if (finishStarted.current) return
      finishStarted.current = true
      try {
        const latestDraft = loadOnboardingDraft()
        await finishOnboarding(latestDraft)
        if (cancelled) return
        clearOnboardingSession()
        applyBrandColor(latestDraft.primaryColor)
        await refetch()
        toast('Workspace ready. Welcome aboard!', 'success')
        window.setTimeout(() => {
          if (!cancelled) navigate(paths.dashboard, { replace: true })
        }, 2000)
      } catch (err) {
        finishStarted.current = false
        if (cancelled) return
        console.error('[onboarding] finish failed', err)
        setError(
          'Email verified, but we could not finish setup. Try again.',
        )
      }
    })()

    return () => {
      cancelled = true
      finishStarted.current = false
    }
  }, [showVerifiedSuccess, error, navigate, refetch, toast])

  const retryFinish = () => {
    setError(null)
    setErrorTitle(null)
    finishStarted.current = false
  }

  const patchDraft = (partial: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  const persistProgress = async (next: OnboardingDraft) => {
    saveOnboardingDraft(next)
    if (!isAuthenticated) return next
    try {
      const logoUrl = await saveOnboardingProgress(next)
      if (logoUrl !== next.logoUrl) {
        const withLogo = { ...next, logoUrl }
        setDraft(withLogo)
        saveOnboardingDraft(withLogo)
        return withLogo
      }
    } catch {
      // Draft remains in localStorage; sync retries on later steps.
    }
    return next
  }

  const goNext = () => setStep((value) => Math.min(5, value + 1))
  const goBack = () => {
    setError(null)
    setErrorTitle(null)
    setStep((value) => Math.max(minStep, value - 1))
  }

  const handleAccountSuccess = (next: OnboardingDraft) => {
    setDraft(next)
    setError(null)
    setErrorTitle(null)
    setStep(2)
  }
  const handleCompanyContinue = async () => {
    setError(null)
    if (!draft.companyName.trim()) {
      setError('Company name is required.')
      return
    }
    if (!draft.businessType.trim()) {
      setError('Select a business type.')
      return
    }
    setBusy(true)
    try {
      await persistProgress(draft)
      goNext()
    } finally {
      setBusy(false)
    }
  }

  const handleContactContinue = async () => {
    setError(null)
    if (!draft.companyEmail.trim()) {
      setError('Company email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.companyEmail.trim())) {
      setError('Enter a valid company email.')
      return
    }
    if (!draft.phone.trim()) {
      setError('Phone number is required.')
      return
    }
    if (!draft.addressLine1.trim()) {
      setError('Address line 1 is required.')
      return
    }
    if (
      !draft.city.trim() ||
      !draft.state.trim() ||
      !draft.country.trim() ||
      !draft.postalCode.trim()
    ) {
      setError('City, state, country, and postal code are required.')
      return
    }
    setBusy(true)
    try {
      await persistProgress(draft)
      goNext()
    } finally {
      setBusy(false)
    }
  }

  const handleBrandingContinue = async () => {
    setError(null)
    if (!draft.currency.trim() || !draft.timezone.trim() || !draft.invoicePrefix.trim()) {
      setError('Currency, timezone, and invoice prefix are required.')
      return
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(draft.primaryColor)) {
      setError('Choose a valid brand color.')
      return
    }

    setBusy(true)
    try {
      await persistProgress(draft)
      setStep(5)
      saveOnboardingStep(5)

      if (isEmailVerified) {
        return
      }

      if (draft.email) {
        const result = await resendSignupEmail(draft.email)
        if (result.errorKind === 'rate_limit') {
          setErrorTitle(result.errorTitle || 'Too many verification emails')
          setError(
            result.error ||
              "You've requested too many verification emails. Please wait a few minutes before trying again.",
          )
          setResendIn(30)
          return
        }
        if (result.error && result.errorKind !== 'in_progress') {
          console.warn('[onboarding] resend on branding continue', result.error)
        }
        setResendIn(30)
        if (!result.error) {
          toast('Verification link sent to your email.', 'info')
        }
      }
    } finally {
      setBusy(false)
    }
  }

  const handleResendEmail = async () => {
    if (resendIn > 0 || !draft.email || busy) return
    setError(null)
    setErrorTitle(null)
    setBusy(true)
    try {
      const result = await resendSignupEmail(draft.email)
      if (result.errorKind === 'in_progress') return

      if (result.errorKind === 'rate_limit') {
        setErrorTitle(result.errorTitle || 'Too many verification emails')
        setError(
          result.error ||
            "You've requested too many verification emails. Please wait a few minutes before trying again.",
        )
        setResendIn(30)
        return
      }

      if (result.error) {
        setError(result.error)
        return
      }

      setResendIn(30)
      toast('A new verification link was sent.', 'info')
    } finally {
      setBusy(false)
    }
  }

  const handleChangeEmail = () => {
    setError(null)
    setErrorTitle(null)
    finishStarted.current = false
    patchDraft({ accountCreated: false })
    setStep(1)
  }

  const handleLogoSelect = async (file: File) => {
    setError(null)
    try {
      if (isAuthenticated) {
        const url = await uploadLogo.mutateAsync(file)
        patchDraft({ logoUrl: url })
        return
      }
      const dataUrl = await fileToDataUrl(file)
      patchDraft({ logoUrl: dataUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload logo.')
    }
  }

  if (authLoading || (isAuthenticated && companyLoading && activeStep >= 2)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (access?.isSuperAdmin) {
    return <Navigate to={paths.admin} replace />
  }

  if (
    isAuthenticated &&
    isEmailVerified &&
    company?.onboardingCompletedAt &&
    !showVerifiedSuccess
  ) {
    return <Navigate to={paths.dashboard} replace />
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(26,115,245,0.08),_transparent_40%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)] dark:bg-[radial-gradient(circle_at_top,_rgba(26,115,245,0.12),_transparent_35%),linear-gradient(to_bottom,#020617,#0f172a)]">
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-8',
          activeStep === 4 ? 'max-w-6xl' : 'max-w-xl',
        )}
      >
        <header className="mb-5 flex items-center justify-between gap-3 sm:mb-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">
              {APP_NAME}
            </p>
            <p className="truncate text-sm text-surface-500">
              Create your workspace
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to={paths.login}
              className="text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </header>

        <OnboardingProgress step={activeStep} />

        <div
          className={cn(
            'mt-5 grid flex-1 gap-5 sm:mt-6 sm:gap-6',
            activeStep === 4 &&
              'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start',
          )}
        >
          <Card
            key={activeStep}
            className="w-full overflow-hidden border-surface-200/80 p-4 shadow-sm sm:p-6 md:p-8 dark:border-surface-800 motion-safe:animate-[fadeSlideIn_0.28s_ease-out]"
          >
            {error && activeStep !== 1 && activeStep !== 5 ? (
              <Alert className="mb-5">
                {errorTitle ? (
                  <p className="font-semibold">{errorTitle}</p>
                ) : null}
                <p className={errorTitle ? 'mt-1' : undefined}>{error}</p>
              </Alert>
            ) : null}

            {activeStep === 1 ? (
              <OnboardingAccountStep
                draft={draft}
                onDraftChange={setDraft}
                onSuccess={handleAccountSuccess}
              />
            ) : null}

            {activeStep === 2 ? (
              <div className="space-y-5">
                <Input
                  label="Company name"
                  value={draft.companyName}
                  disabled={busy}
                  placeholder="Acme Retail"
                  onChange={(event) => patchDraft({ companyName: event.target.value })}
                />
                <Select
                  label="Business type"
                  value={draft.businessType}
                  disabled={busy}
                  options={businessOptions}
                  placeholder="Select business type"
                  onChange={(event) => patchDraft({ businessType: event.target.value })}
                />
                <Input
                  label="GST number"
                  value={draft.taxId}
                  disabled={busy}
                  placeholder="Optional"
                  onChange={(event) => patchDraft({ taxId: event.target.value })}
                />
                <LogoUpload
                  value={draft.logoUrl}
                  disabled={busy}
                  uploading={uploadLogo.isPending}
                  onSelect={handleLogoSelect}
                  onRemove={() => patchDraft({ logoUrl: null })}
                />
                <OnboardingActions>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy || activeStep <= minStep}
                    onClick={goBack}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    disabled={busy}
                    aria-busy={busy}
                    onClick={() => void handleCompanyContinue()}
                  >
                    {busy ? (
                      <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                    ) : null}
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </OnboardingActions>
              </div>
            ) : null}

            {activeStep === 3 ? (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Company email"
                    type="email"
                    inputMode="email"
                    value={draft.companyEmail}
                    disabled={busy}
                    onChange={(event) =>
                      patchDraft({ companyEmail: event.target.value })
                    }
                  />
                  <Input
                    label="Phone number"
                    type="tel"
                    inputMode="tel"
                    value={draft.phone}
                    disabled={busy}
                    onChange={(event) => patchDraft({ phone: event.target.value })}
                  />
                </div>
                <Input
                  label="Website"
                  type="url"
                  inputMode="url"
                  value={draft.website}
                  disabled={busy}
                  placeholder="Optional"
                  onChange={(event) => patchDraft({ website: event.target.value })}
                />
                <Input
                  label="Address line 1"
                  value={draft.addressLine1}
                  disabled={busy}
                  onChange={(event) =>
                    patchDraft({ addressLine1: event.target.value })
                  }
                />
                <Input
                  label="Address line 2"
                  value={draft.addressLine2}
                  disabled={busy}
                  placeholder="Optional"
                  onChange={(event) =>
                    patchDraft({ addressLine2: event.target.value })
                  }
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="City"
                    value={draft.city}
                    disabled={busy}
                    onChange={(event) => patchDraft({ city: event.target.value })}
                  />
                  <Input
                    label="State"
                    value={draft.state}
                    disabled={busy}
                    onChange={(event) => patchDraft({ state: event.target.value })}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Country"
                    value={draft.country}
                    disabled={busy}
                    onChange={(event) => patchDraft({ country: event.target.value })}
                  />
                  <Input
                    label="Postal code"
                    value={draft.postalCode}
                    disabled={busy}
                    onChange={(event) =>
                      patchDraft({ postalCode: event.target.value })
                    }
                  />
                </div>
                <OnboardingActions>
                  <Button type="button" variant="secondary" disabled={busy} onClick={goBack}>
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    disabled={busy}
                    aria-busy={busy}
                    onClick={() => void handleContactContinue()}
                  >
                    {busy ? (
                      <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                    ) : null}
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </OnboardingActions>
              </div>
            ) : null}

            {activeStep === 4 ? (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Currency"
                    value={draft.currency}
                    disabled={busy}
                    options={ensureCurrencyOption(draft.currency)}
                    onChange={(event) => patchDraft({ currency: event.target.value })}
                  />
                  <Select
                    label="Timezone"
                    value={draft.timezone}
                    disabled={busy}
                    options={ensureTimezoneOption(draft.timezone)}
                    onChange={(event) => patchDraft({ timezone: event.target.value })}
                  />
                </div>
                <Input
                  label="Invoice prefix"
                  value={draft.invoicePrefix}
                  disabled={busy}
                  onChange={(event) =>
                    patchDraft({ invoicePrefix: event.target.value })
                  }
                />
                <ColorField
                  label="Brand color"
                  value={draft.primaryColor}
                  disabled={busy}
                  onChange={(value) => {
                    patchDraft({ primaryColor: value })
                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) applyBrandColor(value)
                  }}
                />
                <Textarea
                  label="Invoice footer"
                  value={draft.invoiceFooter}
                  disabled={busy}
                  onChange={(event) =>
                    patchDraft({ invoiceFooter: event.target.value })
                  }
                />
                <OnboardingActions>
                  <Button type="button" variant="secondary" disabled={busy} onClick={goBack}>
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    disabled={busy}
                    aria-busy={busy}
                    onClick={() => void handleBrandingContinue()}
                  >
                    {busy ? (
                      <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                    ) : null}
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </OnboardingActions>
              </div>
            ) : null}

            {activeStep === 5 ? (
              <EmailVerifyPanel
                email={draft.email || user?.email || ''}
                verified={showVerifiedSuccess}
                busy={busy}
                resendIn={resendIn}
                error={error}
                errorTitle={errorTitle}
                onResend={() => void handleResendEmail()}
                onChangeEmail={handleChangeEmail}
                onBack={showVerifiedSuccess ? undefined : goBack}
                onRetryFinish={retryFinish}
              />
            ) : null}
          </Card>

          {activeStep === 4 ? (
            <aside className="space-y-3 lg:sticky lg:top-6">
              <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Live invoice preview
              </p>
              <OnboardingInvoicePreview draft={draft} />
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  )
}

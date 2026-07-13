import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsSectionCard } from '@/components/settings/SettingsSectionCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { showFieldSuccess } from '@/lib/formFeedback'
import { toFriendlyError } from '@/lib/friendlyError'
import { useUpdateCompanyLocalization } from '@/services/settings/hooks'
import {
  ensureCurrencyOption,
  ensureTimezoneOption,
} from '@/services/settings/options'
import type {
  CompanyLocalizationInput,
  CompanySettings,
} from '@/services/settings/types'
import { companyLocalizationSchema } from '@/validation/company.schema'

type LocalizationSettingsCardProps = {
  settings: CompanySettings
}

export function LocalizationSettingsCard({
  settings,
}: LocalizationSettingsCardProps) {
  const { toast } = useToast()
  const updateLocalization = useUpdateCompanyLocalization()
  const [formError, setFormError] = useState<string | null>(null)

  const currencyOptions = ensureCurrencyOption(settings.currency || 'INR')
  const timezoneOptions = ensureTimezoneOption(
    settings.timezone || 'Asia/Kolkata',
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isDirty, isSubmitting, isValid, dirtyFields, touchedFields },
  } = useForm<CompanyLocalizationInput>({
    resolver: zodResolver(companyLocalizationSchema),
    mode: 'onChange',
    defaultValues: {
      currency: settings.currency || 'INR',
      timezone: settings.timezone || 'Asia/Kolkata',
      invoicePrefix: settings.invoicePrefix,
      invoiceFooter: settings.invoiceFooter,
    },
  })

  useEffect(() => {
    reset({
      currency: settings.currency || 'INR',
      timezone: settings.timezone || 'Asia/Kolkata',
      invoicePrefix: settings.invoicePrefix,
      invoiceFooter: settings.invoiceFooter,
    })
  }, [settings, reset])

  useEffect(() => {
    void trigger()
  }, [trigger])

  const disabled =
    !settings.canEdit || isSubmitting || updateLocalization.isPending
  const invoicePrefix = watch('invoicePrefix') ?? ''
  const invoiceFooter = watch('invoiceFooter') ?? ''

  const onCancel = () => {
    setFormError(null)
    reset({
      currency: settings.currency || 'INR',
      timezone: settings.timezone || 'Asia/Kolkata',
      invoicePrefix: settings.invoicePrefix,
      invoiceFooter: settings.invoiceFooter,
    })
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await updateLocalization.mutateAsync({
        currency: values.currency.trim().toUpperCase(),
        timezone: values.timezone.trim(),
        invoicePrefix: values.invoicePrefix.trim(),
        invoiceFooter: values.invoiceFooter.trim(),
      })
      toast('Saved successfully.', 'success')
    } catch (error) {
      setFormError(
        toFriendlyError(error, 'Unable to save invoicing settings.'),
      )
    }
  })

  return (
    <SettingsSectionCard
      title="Invoicing & localization"
      description="Currency, timezone, and invoice defaults for this workspace only."
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? <Alert>{formError}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Currency"
            disabled={disabled}
            options={currencyOptions}
            error={errors.currency?.message}
            success={showFieldSuccess({
              dirty: dirtyFields.currency,
              touched: touchedFields.currency,
              invalid: Boolean(errors.currency),
              value: true,
              requireValue: false,
            })}
            {...register('currency')}
          />
          <Select
            label="Timezone"
            disabled={disabled}
            options={timezoneOptions}
            error={errors.timezone?.message}
            success={showFieldSuccess({
              dirty: dirtyFields.timezone,
              touched: touchedFields.timezone,
              invalid: Boolean(errors.timezone),
              value: true,
              requireValue: false,
            })}
            {...register('timezone')}
          />
        </div>

        <Input
          label="Invoice prefix"
          placeholder="INV-"
          disabled={disabled}
          error={errors.invoicePrefix?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.invoicePrefix,
            touched: touchedFields.invoicePrefix,
            invalid: Boolean(errors.invoicePrefix),
            value: invoicePrefix,
          })}
          {...register('invoicePrefix')}
        />

        <Textarea
          label="Invoice footer"
          placeholder="Thank you for your business."
          disabled={disabled}
          rows={3}
          error={errors.invoiceFooter?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.invoiceFooter,
            touched: touchedFields.invoiceFooter,
            invalid: Boolean(errors.invoiceFooter),
            value: invoiceFooter,
          })}
          {...register('invoiceFooter')}
        />

        <div className="flex flex-col-reverse gap-2 border-t border-surface-100 pt-5 sm:flex-row sm:justify-end dark:border-surface-800">
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || !isDirty}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={disabled || !isDirty || !isValid}
            className="sm:min-w-40"
          >
            {isSubmitting || updateLocalization.isPending ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {isSubmitting || updateLocalization.isPending
              ? 'Saving…'
              : 'Save Localization'}
          </Button>
        </div>
      </form>
    </SettingsSectionCard>
  )
}

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { ColorField } from '@/components/settings/ColorField'
import { LogoUpload } from '@/components/settings/LogoUpload'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import {
  useRemoveCompanyLogo,
  useUpdateCompanySettings,
  useUploadCompanyLogo,
} from '@/services/settings/hooks'
import {
  ensureCurrencyOption,
  ensureTimezoneOption,
} from '@/services/settings/options'
import { BUSINESS_TYPES } from '@/services/onboarding'
import type {
  CompanySettings,
  CompanySettingsInput,
} from '@/services/settings/types'
import { applyBrandColor } from '@/lib/branding'

type CompanySettingsFormProps = {
  settings: CompanySettings
}

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/
const EMAIL_PATTERN = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BUSINESS_TYPE_OPTIONS = BUSINESS_TYPES.map((value) => ({
  value,
  label: value,
}))

export function CompanySettingsForm({ settings }: CompanySettingsFormProps) {
  const updateSettings = useUpdateCompanySettings()
  const uploadLogo = useUploadCompanyLogo()
  const removeLogo = useRemoveCompanyLogo()

  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logoUrl)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const currencyOptions = ensureCurrencyOption(settings.currency)
  const timezoneOptions = ensureTimezoneOption(settings.timezone)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CompanySettingsInput>({
    defaultValues: {
      name: settings.name,
      businessType: settings.businessType,
      email: settings.email,
      phone: settings.phone,
      website: settings.website,
      taxId: settings.taxId,
      addressLine1: settings.addressLine1,
      addressLine2: settings.addressLine2,
      city: settings.city,
      state: settings.state,
      postalCode: settings.postalCode,
      country: settings.country,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor,
      invoiceFooter: settings.invoiceFooter,
      currency: settings.currency,
      timezone: settings.timezone,
      invoicePrefix: settings.invoicePrefix,
    },
  })

  const disabled = !settings.canEdit || isSubmitting
  const logoChanged = logoUrl !== settings.logoUrl

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    setSuccessMessage(null)

    try {
      await updateSettings.mutateAsync({
        ...values,
        logoUrl,
        primaryColor: values.primaryColor.toLowerCase(),
        currency: values.currency.trim().toUpperCase(),
        timezone: values.timezone.trim(),
        invoicePrefix: values.invoicePrefix.trim(),
      })
      setSuccessMessage(
        'Company settings saved. Branding and invoices will use these details.',
      )
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save settings.',
      )
    }
  })

  const handleLogoSelect = async (file: File) => {
    setFormError(null)
    setSuccessMessage(null)
    try {
      const url = await uploadLogo.mutateAsync(file)
      setLogoUrl(url)
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to upload logo.',
      )
    }
  }

  const handleLogoRemove = async () => {
    setFormError(null)
    setSuccessMessage(null)
    try {
      await removeLogo.mutateAsync(logoUrl)
      setLogoUrl(null)
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to remove logo.',
      )
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {!settings.canEdit ? (
        <Alert variant="info">
          Only company owners and admins can edit company settings.
        </Alert>
      ) : null}

      {formError ? <Alert>{formError}</Alert> : null}
      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Company profile</CardTitle>
            <CardDescription>
              Name, logo, and contact details shown across the app and on PDFs.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <LogoUpload
            value={logoUrl}
            disabled={disabled}
            uploading={uploadLogo.isPending || removeLogo.isPending}
            onSelect={handleLogoSelect}
            onRemove={handleLogoRemove}
          />

          <Input
            label="Company name"
            placeholder="Acme Trading Co."
            disabled={disabled}
            error={errors.name?.message}
            {...register('name', {
              required: 'Company name is required',
              minLength: { value: 2, message: 'Enter at least 2 characters' },
            })}
          />

          <Select
            label="Business type"
            disabled={disabled}
            options={BUSINESS_TYPE_OPTIONS}
            placeholder="Select business type"
            error={errors.businessType?.message}
            {...register('businessType')}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company email"
              type="email"
              placeholder="billing@company.com"
              disabled={disabled}
              error={errors.email?.message}
              {...register('email', {
                pattern: {
                  value: EMAIL_PATTERN,
                  message: 'Enter a valid email',
                },
              })}
            />
            <Input
              label="Company phone"
              type="tel"
              placeholder="+1 555 0100"
              disabled={disabled}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <Input
            label="Website"
            type="url"
            placeholder="https://company.com"
            disabled={disabled}
            error={errors.website?.message}
            {...register('website')}
          />

          <Input
            label="GST number"
            placeholder="GSTIN / VAT / EIN"
            disabled={disabled}
            error={errors.taxId?.message}
            {...register('taxId')}
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Address</CardTitle>
            <CardDescription>
              Printed on invoices and PDF documents.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <Input
            label="Address line 1"
            placeholder="Street address"
            disabled={disabled}
            {...register('addressLine1')}
          />
          <Input
            label="Address line 2"
            placeholder="Suite, floor, etc. (optional)"
            disabled={disabled}
            {...register('addressLine2')}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="City" disabled={disabled} {...register('city')} />
            <Input
              label="State / Province"
              disabled={disabled}
              {...register('state')}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Postal code"
              disabled={disabled}
              {...register('postalCode')}
            />
            <Input label="Country" disabled={disabled} {...register('country')} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Invoicing & localization</CardTitle>
            <CardDescription>
              Prefix, currency, timezone, and footer for this company only.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Currency"
              disabled={disabled}
              options={currencyOptions}
              error={errors.currency?.message}
              {...register('currency', { required: 'Currency is required' })}
            />
            <Select
              label="Timezone"
              disabled={disabled}
              options={timezoneOptions}
              error={errors.timezone?.message}
              {...register('timezone', { required: 'Timezone is required' })}
            />
          </div>

          <Input
            label="Invoice prefix"
            placeholder="INV-"
            disabled={disabled}
            error={errors.invoicePrefix?.message}
            {...register('invoicePrefix', {
              required: 'Invoice prefix is required',
              maxLength: {
                value: 20,
                message: 'Prefix must be 20 characters or less',
              },
            })}
          />

          <Textarea
            label="Invoice footer"
            placeholder="Thank you for your business."
            disabled={disabled}
            error={errors.invoiceFooter?.message}
            {...register('invoiceFooter', {
              maxLength: {
                value: 1000,
                message: 'Footer must be 1000 characters or less',
              },
            })}
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Brand color</CardTitle>
            <CardDescription>
              Accent color for the workspace, invoices, and PDFs.
            </CardDescription>
          </div>
        </CardHeader>

        <Controller
          name="primaryColor"
          control={control}
          rules={{
            required: 'Brand color is required',
            pattern: {
              value: HEX_PATTERN,
              message: 'Use a hex color like #1a73f5',
            },
          }}
          render={({ field }) => (
            <ColorField
              label="Brand color"
              value={field.value}
              disabled={disabled}
              error={errors.primaryColor?.message}
              onChange={(value) => {
                field.onChange(value)
                if (HEX_PATTERN.test(value)) {
                  applyBrandColor(value)
                }
              }}
            />
          )}
        />
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-surface-500 dark:text-surface-400">
          Settings are isolated per company via Row Level Security.
        </p>
        <Button
          type="submit"
          disabled={disabled || (!isDirty && !logoChanged)}
          className="sm:min-w-36"
        >
          {isSubmitting || updateSettings.isPending ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSubmitting || updateSettings.isPending
            ? 'Saving…'
            : 'Save settings'}
        </Button>
      </div>
    </form>
  )
}

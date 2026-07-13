import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Building2, Globe, Mail, MapPin, Pencil, Phone, X } from 'lucide-react'
import { LogoUpload } from '@/components/settings/LogoUpload'
import { SettingsSectionCard } from '@/components/settings/SettingsSectionCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/useToast'
import { BUSINESS_TYPES } from '@/services/onboarding'
import {
  useRemoveCompanyLogo,
  useUpdateCompanyProfile,
  useUploadCompanyLogo,
} from '@/services/settings/hooks'
import type {
  CompanyProfileInput,
  CompanySettings,
} from '@/services/settings/types'
import { cn } from '@/utils'

type CompanyProfileCardProps = {
  settings: CompanySettings
}

const EMAIL_PATTERN = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BUSINESS_TYPE_OPTIONS = BUSINESS_TYPES.map((value) => ({
  value,
  label: value,
}))

function ProfileField({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value?: string | null
  icon?: typeof Mail
}) {
  const display = value?.trim()
  if (!display) return null

  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-surface-400">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-surface-900 dark:text-surface-50">
        {display}
      </p>
    </div>
  )
}

function formatWebsite(url: string) {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

function buildAddressLines(settings: CompanySettings) {
  const street = [settings.addressLine1, settings.addressLine2]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')
  const locality = [settings.city, settings.state, settings.postalCode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')
  const country = settings.country.trim()
  return [street, locality, country].filter(Boolean)
}

export function CompanyProfileCard({ settings }: CompanyProfileCardProps) {
  const { toast } = useToast()
  const updateProfile = useUpdateCompanyProfile()
  const uploadLogo = useUploadCompanyLogo()
  const removeLogo = useRemoveCompanyLogo()

  const [editing, setEditing] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logoUrl)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyProfileInput>({
    defaultValues: {
      name: settings.name,
      businessType: settings.businessType,
      description: settings.description,
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
    },
  })

  useEffect(() => {
    setLogoUrl(settings.logoUrl)
    if (!editing) {
      reset({
        name: settings.name,
        businessType: settings.businessType,
        description: settings.description,
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
      })
    }
  }, [settings, editing, reset])

  const descriptionValue = watch('description') ?? ''
  const disabled = !settings.canEdit || isSubmitting || updateProfile.isPending
  const addressLines = buildAddressLines(settings)

  const startEdit = () => {
    setFormError(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setFormError(null)
    setLogoUrl(settings.logoUrl)
    reset({
      name: settings.name,
      businessType: settings.businessType,
      description: settings.description,
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
    })
    setEditing(false)
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await updateProfile.mutateAsync({
        ...values,
        logoUrl,
        name: values.name.trim(),
        description: values.description.trim(),
      })
      toast('Settings updated successfully.', 'success')
      setEditing(false)
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save profile.',
      )
    }
  })

  const handleLogoSelect = async (file: File) => {
    setFormError(null)
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
    try {
      await removeLogo.mutateAsync(logoUrl)
      setLogoUrl(null)
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to remove logo.',
      )
    }
  }

  if (!editing) {
    return (
      <SettingsSectionCard
        title="Company profile"
        description="Public company details used on invoices, PDFs, and emails."
        action={
          settings.canEdit ? (
            <Button type="button" variant="secondary" size="sm" onClick={startEdit}>
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : null
        }
      >
        <div className="motion-safe:animate-[fadeSlideIn_0.28s_ease-out]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-900">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.name}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <Building2 className="h-10 w-10 text-surface-300" />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
                {settings.name || 'Untitled company'}
              </h2>
              {settings.businessType ? (
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {settings.businessType}
                </p>
              ) : null}
            </div>
          </div>

          <div className="my-6 h-px bg-surface-100 dark:bg-surface-800" />

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Email" value={settings.email} icon={Mail} />
            <ProfileField label="Phone" value={settings.phone} icon={Phone} />
            <ProfileField
              label="Website"
              value={
                settings.website ? formatWebsite(settings.website) : null
              }
              icon={Globe}
            />
            <ProfileField label="GST" value={settings.taxId} />
          </div>

          {addressLines.length > 0 ? (
            <>
              <div className="my-6 h-px bg-surface-100 dark:bg-surface-800" />
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-surface-400">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  Address
                </p>
                <div className="mt-2 space-y-0.5 text-sm font-medium text-surface-900 dark:text-surface-50">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {settings.description.trim() ? (
            <>
              <div className="my-6 h-px bg-surface-100 dark:bg-surface-800" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-surface-400">
                  Description
                </p>
                <p className="mt-2 text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                  {settings.description}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </SettingsSectionCard>
    )
  }

  return (
    <SettingsSectionCard
      title="Edit company profile"
      description="Update company details. Changes apply to invoices and emails."
      action={
        <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
      }
    >
      <form
        className={cn(
          'space-y-5 motion-safe:animate-[fadeSlideIn_0.28s_ease-out]',
        )}
        onSubmit={onSubmit}
        noValidate
      >
        {formError ? <Alert>{formError}</Alert> : null}

        <LogoUpload
          value={logoUrl}
          disabled={disabled}
          uploading={uploadLogo.isPending || removeLogo.isPending}
          onSelect={handleLogoSelect}
          onRemove={handleLogoRemove}
        />

        <Input
          label="Company name"
          placeholder="Quick Groceries"
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

        <div>
          <Textarea
            label="Company description"
            placeholder="Quick Groceries is a retail grocery business providing fresh vegetables, fruits, dairy products and household essentials."
            disabled={disabled}
            rows={4}
            error={errors.description?.message}
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description must be 500 characters or less',
              },
            })}
          />
          <p className="mt-1.5 text-right text-xs text-surface-400">
            {descriptionValue.length}/500
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            placeholder="hello@company.com"
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
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Address line 1"
            placeholder="Street address"
            disabled={disabled}
            {...register('addressLine1')}
          />
          <Input
            label="Address line 2"
            placeholder="Suite, floor (optional)"
            disabled={disabled}
            {...register('addressLine2')}
          />
        </div>

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

        <div className="flex flex-col-reverse gap-2 border-t border-surface-100 pt-5 sm:flex-row sm:justify-end dark:border-surface-800">
          <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={cancelEdit}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={disabled} className="sm:min-w-32">
            {disabled ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {disabled ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </SettingsSectionCard>
  )
}

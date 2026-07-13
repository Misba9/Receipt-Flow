import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ColorField } from '@/components/settings/ColorField'
import { SettingsSectionCard } from '@/components/settings/SettingsSectionCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/hooks/useToast'
import { applyBrandColor } from '@/lib/branding'
import { useUpdateCompanyBranding } from '@/services/settings/hooks'
import type {
  CompanyBrandingInput,
  CompanySettings,
} from '@/services/settings/types'

type BrandingSettingsCardProps = {
  settings: CompanySettings
}

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

export function BrandingSettingsCard({ settings }: BrandingSettingsCardProps) {
  const { toast } = useToast()
  const updateBranding = useUpdateCompanyBranding()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CompanyBrandingInput>({
    defaultValues: {
      primaryColor: settings.primaryColor || '#1a73f5',
    },
  })

  useEffect(() => {
    reset({ primaryColor: settings.primaryColor || '#1a73f5' })
  }, [settings.primaryColor, reset])

  const previewColor = watch('primaryColor') || '#1a73f5'
  const disabled =
    !settings.canEdit || isSubmitting || updateBranding.isPending

  const onCancel = () => {
    setFormError(null)
    reset({ primaryColor: settings.primaryColor || '#1a73f5' })
    applyBrandColor(settings.primaryColor || '#1a73f5')
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const color = values.primaryColor.trim().toLowerCase()
      await updateBranding.mutateAsync({ primaryColor: color })
      applyBrandColor(color)
      toast('Settings updated successfully.', 'success')
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save branding.',
      )
    }
  })

  return (
    <SettingsSectionCard
      title="Branding"
      description="Accent color for the workspace, invoices, and PDFs."
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? <Alert>{formError}</Alert> : null}

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

        <div
          className="overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-700"
          style={{ borderTopColor: previewColor, borderTopWidth: 4 }}
        >
          <div
            className="px-5 py-4 text-white"
            style={{ backgroundColor: previewColor }}
          >
            <p className="text-sm font-semibold">Live preview</p>
            <p className="text-xs text-white/80">
              Invoice accents and primary buttons
            </p>
          </div>
          <div className="space-y-3 bg-white px-5 py-4 dark:bg-surface-900">
            <div className="h-2 w-[66%] rounded-full bg-surface-100 dark:bg-surface-800" />
            <div className="h-2 w-1/2 rounded-full bg-surface-100 dark:bg-surface-800" />
            <div
              className="inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ backgroundColor: previewColor }}
            >
              Sample CTA
            </div>
          </div>
        </div>

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
            disabled={disabled || !isDirty}
            className="sm:min-w-36"
          >
            {isSubmitting || updateBranding.isPending ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {isSubmitting || updateBranding.isPending
              ? 'Saving…'
              : 'Save Branding'}
          </Button>
        </div>
      </form>
    </SettingsSectionCard>
  )
}

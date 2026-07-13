import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SettingsSectionCard } from '@/components/settings/SettingsSectionCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/hooks/useToast'
import { useUpdateCompanyEmailBranding } from '@/services/settings/hooks'
import type {
  CompanyEmailBrandingInput,
  CompanySettings,
} from '@/services/settings/types'

type EmailBrandingSettingsCardProps = {
  settings: CompanySettings
}

const EMAIL_PATTERN = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailBrandingSettingsCard({
  settings,
}: EmailBrandingSettingsCardProps) {
  const { toast } = useToast()
  const updateEmailBranding = useUpdateCompanyEmailBranding()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CompanyEmailBrandingInput>({
    defaultValues: {
      senderName: settings.senderName || settings.name,
      replyTo: settings.replyTo,
    },
  })

  useEffect(() => {
    reset({
      senderName: settings.senderName || settings.name,
      replyTo: settings.replyTo,
    })
  }, [settings, reset])

  const disabled =
    !settings.canEdit || isSubmitting || updateEmailBranding.isPending

  const onCancel = () => {
    setFormError(null)
    reset({
      senderName: settings.senderName || settings.name,
      replyTo: settings.replyTo,
    })
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await updateEmailBranding.mutateAsync({
        senderName: values.senderName.trim(),
        replyTo: values.replyTo.trim(),
      })
      toast('Settings updated successfully.', 'success')
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to save email branding.',
      )
    }
  })

  return (
    <SettingsSectionCard
      title="Email branding"
      description="Display name and reply-to for invoice emails. The sending mailbox stays on the platform verified domain."
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? <Alert>{formError}</Alert> : null}

        <Input
          label="Sender name"
          placeholder="Quick Groceries"
          disabled={disabled}
          error={errors.senderName?.message}
          {...register('senderName', {
            required: 'Sender name is required',
            minLength: { value: 2, message: 'Enter at least 2 characters' },
          })}
        />
        <Input
          label="Reply-To email"
          type="email"
          placeholder="support@yourbusiness.com"
          disabled={disabled}
          error={errors.replyTo?.message}
          {...register('replyTo', {
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Enter a valid email',
            },
          })}
        />
        <p className="text-xs text-surface-500 dark:text-surface-400">
          Leave Reply-To blank to omit it from outgoing emails.
        </p>

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
            {isSubmitting || updateEmailBranding.isPending ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {isSubmitting || updateEmailBranding.isPending
              ? 'Saving…'
              : 'Save Email'}
          </Button>
        </div>
      </form>
    </SettingsSectionCard>
  )
}

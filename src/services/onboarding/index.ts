export {
  BUSINESS_TYPES,
  ONBOARDING_STEPS,
  emptyOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
  loadOnboardingStep,
  saveOnboardingStep,
  clearOnboardingSession,
  validateStrongPassword,
  getProfileCompletion,
  fileToDataUrl,
  dataUrlToFile,
} from '@/services/onboarding/types'
export type { OnboardingDraft, BusinessType } from '@/services/onboarding/types'
export {
  finishOnboarding,
  saveOnboardingProgress,
} from '@/services/onboarding/api'

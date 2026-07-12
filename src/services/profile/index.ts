export {
  fetchProfileVerification,
  markEmailVerified,
  dismissEmailVerifyBanner,
  sendEmailVerificationLink,
} from '@/services/profile/api'
export type { ProfileVerification } from '@/services/profile/api'
export {
  profileKeys,
  useProfileVerification,
  useDismissEmailVerifyBanner,
  useMarkEmailVerified,
  useSendEmailVerification,
} from '@/services/profile/hooks'

import { env } from '@/lib/env'

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const APP_NAME = env.appName

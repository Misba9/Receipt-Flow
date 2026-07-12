#!/usr/bin/env node
/**
 * Creates (or updates) the platform super-admin from ADMIN_* env vars.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API → service_role).
 * Never put the service role or admin password in VITE_* variables.
 *
 * Usage: npm run bootstrap:admin
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile(path) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(resolve(process.cwd(), '.env'))

const url = process.env.VITE_SUPABASE_URL?.trim()
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const fullName = process.env.ADMIN_FULL_NAME?.trim() || 'Platform Admin'

if (!url || !serviceRole) {
  console.error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.\n' +
      'Copy the service_role key from Supabase → Settings → API (keep it secret).',
  )
  process.exit(1)
}

if (!email || !password) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env.')
  process.exit(1)
}

if (password.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters.')
  process.exit(1)
}

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserIdByEmail(targetEmail) {
  let page = 1
  const perPage = 200
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const match = data.users.find(
      (user) => user.email?.toLowerCase() === targetEmail,
    )
    if (match) return match.id
    if (data.users.length < perPage) return null
    page += 1
  }
}

async function ensureSuperAdmin(userId) {
  const { data: existing, error: readError } = await admin
    .from('profiles')
    .select('id, is_super_admin, company_id')
    .eq('id', userId)
    .maybeSingle()

  if (readError) throw readError

  if (!existing) {
    const { error } = await admin.from('profiles').insert({
      id: userId,
      full_name: fullName,
      role: 'owner',
      is_super_admin: true,
    })
    if (error) throw error
    return
  }

  if (existing.is_super_admin) {
    await admin.from('profiles').update({ full_name: fullName }).eq('id', userId)
    return
  }

  // Service role has auth.uid() = null, so the lock trigger allows this update.
  const { error } = await admin
    .from('profiles')
    .update({ is_super_admin: true, full_name: fullName })
    .eq('id', userId)

  if (error) {
    console.warn(error.message)
    console.log('\nRun this in Supabase SQL Editor:')
    console.log(
      `update public.profiles set is_super_admin = true where id = '${userId}';`,
    )
    process.exit(1)
  }
}

async function main() {
  let userId = await findUserIdByEmail(email)

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        company_name: 'Platform Admin',
      },
    })
    if (error) throw error
    userId = data.user?.id ?? null
    console.log(`Created auth user: ${email}`)
  } else {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })
    if (error) throw error
    console.log(`Updated existing auth user: ${email}`)
  }

  if (!userId) {
    throw new Error('Unable to resolve admin user id.')
  }

  await ensureSuperAdmin(userId)

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, full_name, is_super_admin, company_id')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) throw profileError

  if (profile?.company_id) {
    const { error: companyError } = await admin
      .from('companies')
      .update({
        is_platform: true,
        name: 'Platform Admin',
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq('id', profile.company_id)

    if (companyError) {
      console.warn(
        'Could not mark company as platform workspace:',
        companyError.message,
      )
    }
  }

  if (!profile?.is_super_admin) {
    console.log('\nUser ready, but is_super_admin is still false.')
    console.log('Run this in Supabase SQL Editor:')
    console.log(
      `update public.profiles set is_super_admin = true where id = '${userId}';`,
    )
    process.exit(1)
  }

  console.log('\nSuper admin ready.')
  console.log(`  Email:    ${email}`)
  console.log('  Password: (ADMIN_PASSWORD from .env)')
  console.log('  Login:    /login  →  then open /admin')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

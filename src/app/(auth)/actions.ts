'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getUserByUsername, getUserFromSession } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'

import { loginSchema, signupSchema } from './schemas'

import type { SupabaseAuthErrorCode } from './error-codes'
import type { LoginSchema, SignupSchema } from './schemas'

export async function login(formData: LoginSchema) {
  const supabase = createServerClient()

  const parseResult = loginSchema.safeParse(formData)
  if (!parseResult.success) {
    return { success: false, fieldErrors: parseResult.error.flatten().fieldErrors }
  }

  const { identifier, password } = parseResult.data

  let email = identifier
  if (!identifier.includes('@')) {
    // Assume username was entered
    const { data, error, status } = await supabase
      .from('users')
      .select('email')
      .eq('username', identifier)
      .single()

    if (!!error || !data) {
      if (status === 406) {
        return { success: false, error: 'Invalid login credentials' }
      }
      // TODO: Handle specific errors here
      return { success: false }
    }

    email = data.email
  }

  const signInResult = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInResult.error) {
    // TODO: Handle specific errors here
    return { success: false, error: signInResult.error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(formData: SignupSchema) {
  const supabase = createServerClient()

  const parseResult = signupSchema.safeParse(formData)
  if (!parseResult.success) {
    return { success: false, fieldErrors: parseResult.error.flatten().fieldErrors }
  }

  const { email, username, password } = parseResult.data

  const userResult = await getUserByUsername(supabase, username)
  if (userResult.error) {
    // Let frontend handle generic error messaging
    return { success: false }
  }

  if (userResult.count) {
    // Note there is a unique constraint on the username column, so signup will fail on its
    // own with a 500 DB error, however, we can provide a more user-friendly messaging
    return { success: false, fieldErrors: { username: ['Username already exists'] } }
  }

  const signUpResult = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, avatar_url: null },
    },
  })

  console.info(signUpResult)

  if (!!signUpResult.error || signUpResult.data.session === null) {
    if (signUpResult.error?.status === 422) {
      // Supabase doesn't expose this so we need to assert this
      switch (signUpResult.error.code as SupabaseAuthErrorCode) {
        case 'email_exists': {
          return { success: false, fieldErrors: { email: ['Email already exists'] } }
          // return redirect('/login?message=Email already exists')
        }
        case 'user_already_exists':
        case 'identity_already_exists': {
          return { success: false, error: 'User already exists' }
        }
        case 'weak_password': {
          return { success: false, fieldErrors: { password: ['Password is too weak'] } }
        }
        default: {
          break
        }
      }
    }
    console.error(signUpResult)
    return { success: false }
  }

  // Must set session cookie to get user on redirect/revalidate
  await supabase.auth.setSession(signUpResult.data.session)

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signout() {
  const supabase = createServerClient()

  // Check if a user's logged in
  const { data: user } = await getUserFromSession(supabase)
  if (user) {
    // Logs out the user across all sessions and clears the cookies from the browser
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

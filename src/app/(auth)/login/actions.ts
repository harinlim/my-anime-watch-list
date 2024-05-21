'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getUserByUsername } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'

import type { SupabaseAuthErrorCode } from './error-codes'

export async function login(formData: FormData) {
  const supabase = createServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('email', email)
    .single()

  if (!!error || !data || data.username !== username) {
    return redirect('/login?message=Could not authenticate user')
  }

  const signInResult = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInResult.error) {
    return redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  return redirect('/profile')
}

export async function signup(formData: FormData) {
  const supabase = createServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!email) {
    return redirect('/login?message=Please enter an email')
  }

  if (!password) {
    return redirect('/login?message=Please enter a password')
  }

  if (!username) {
    return redirect('/login?message=Please enter a username')
  }

  const userResult = await getUserByUsername(supabase, username)
  if (userResult.error) {
    return redirect('/login?message=Failed to sign up')
  }

  if (userResult.count) {
    // Note there is a unique constraint on the username column, so signup will fail on its
    // own with a 500 DB error, however, we can provide a more user-friendly messaging
    return redirect('/login?message=Username already exists')
  }

  const signUpResult = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  console.info(signUpResult)

  if (signUpResult.error) {
    if (signUpResult.error.status === 422) {
      // Supabase doesn't expose this so we need to assert this
      switch (signUpResult.error.code as SupabaseAuthErrorCode) {
        case 'email_exists': {
          return redirect('/login?message=Email already exists')
        }
        case 'user_already_exists':
        case 'identity_already_exists': {
          return redirect('/login?message=User already exists')
        }
        case 'weak_password': {
          return redirect('/login?message=Password is too weak')
        }
        default: {
          return redirect('/login?message=Failed to sign up')
        }
      }
    }

    return redirect('/login?message=Failed to sign up')
  }

  revalidatePath('/', 'layout')
  return redirect('/signup/success')
}

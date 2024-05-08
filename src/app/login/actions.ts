'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerClient } from '@/lib/supabase/server'

import type { ErrorCode } from './error-codes'

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
  return redirect('/account')
}

export async function signup(formData: FormData) {
  const supabase = createServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const signUpResult = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (!!error || !data) {
    return redirect('/login?message=Failed to sign up')
  }

  console.log(signUpResult)

  if (signUpResult.error) {
    if (signUpResult.error.status === 422) {
      // Supabase doesn't expose this so we need to assert this
      switch (signUpResult.error.code as ErrorCode) {
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
  return redirect('/account')
}

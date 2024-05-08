import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { User } from './types'

export async function GET(): Promise<NextResponse<User>> {
  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json<User>(
      {
        id: null,
        email: null,
        username: null,
      },
      { status: 404 }
    )
  }

  const { data, error, status } = await supabase
    .from('users')
    .select(`username`)
    .eq('id', user.id)
    .single()

  if (error && status !== 406) {
    console.warn(error)
    return NextResponse.json<User>(
      {
        id: null,
        email: null,
        username: null,
      },
      { status }
    )
  }

  return NextResponse.json<User>({
    id: user.id,
    email: user.email ?? null,
    username: data ? data.username : null,
  })
}

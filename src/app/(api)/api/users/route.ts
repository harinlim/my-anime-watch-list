import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { User } from '@/types/users'

/* Get user information from given auth cookies. */
export async function GET() {
  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  const userResult = await supabase
    .from('users')
    .select(`username, email, avatar_url`, { count: 'exact' })
    .eq('id', user.id)
    .maybeSingle()

  if (userResult.error) {
    console.error(userResult)
    return NextResponse.json('Failed to fetch user', { status: 500 })
  }

  if (userResult.count === 0 || !userResult.data) {
    return NextResponse.json('User not found', { status: 404 })
  }

  return NextResponse.json<User>({
    id: user.id,
    ...userResult.data,
  })
}

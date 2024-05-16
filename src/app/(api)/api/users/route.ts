import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { User } from '@/types/users'

export async function GET() {
  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('User not found', { status: 404 })
  }

  const userQueryResult = await supabase
    .from('users')
    .select(`username, email`)
    .eq('id', user.id)
    .single()

  if (!!userQueryResult.error || !userQueryResult.data) {
    if (userQueryResult.status === 406) {
      return NextResponse.json('User not found', { status: 404 })
    }

    console.error(userQueryResult.error)
    return NextResponse.json(userQueryResult, { status: userQueryResult.status })
  }

  return NextResponse.json<User>({
    id: user.id,
    ...userQueryResult.data,
  })
}

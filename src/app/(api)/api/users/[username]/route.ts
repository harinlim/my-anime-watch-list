import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { username: string } }

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { username } = params
  const supabase = createServerClient()

  // Get user associated with username
  const {
    data: user,
    error,
    status,
  } = await supabase.from('users').select('id,username').eq('username', username).single()

  if (!!error || !user) {
    if (status === 406) {
      return NextResponse.json('User not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch user', { status })
  }

  return NextResponse.json<{ id: string; username: string }>(user)
}

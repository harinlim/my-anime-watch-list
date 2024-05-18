import { NextResponse } from 'next/server'

import { getUserByUsername } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { username: string } }

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { username } = params
  const supabase = createServerClient()

  // Get user associated with username
  const userResult = await getUserByUsername(supabase, username)

  if (userResult.error) {
    console.error(userResult)
    return NextResponse.json('Failed to fetch user', { status: 500 })
  }

  if (userResult.count === 0 || !userResult.data) {
    return NextResponse.json('User not found', { status: 404 })
  }

  return NextResponse.json<{ id: string; username: string }>({
    id: userResult.data.id,
    username: userResult.data.username,
  })
}

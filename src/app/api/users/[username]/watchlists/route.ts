import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { Watchlist } from './types'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { username: string } }

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { username } = params
  const supabase = createServerClient()

  // Get user associated with username
  const userQuery = await supabase.from('users').select('id').eq('username', username).single()

  if (userQuery.error) {
    if (userQuery.status === 406) {
      return NextResponse.json('User not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch user', { status: userQuery.status })
  }

  const userId = userQuery.data.id

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoggedInUser = user?.id === userId

  let watchlistsQuery = supabase.from('watchlists').select(`*, anime(*)`).eq('user_id', userId)
  if (!isLoggedInUser) {
    watchlistsQuery = watchlistsQuery.eq('is_public', true)
  }

  const { data, error, status } = await watchlistsQuery

  if (error) {
    return NextResponse.json('Failed to fetch watchlists', { status })
  }

  return NextResponse.json<Watchlist[]>(data)
}

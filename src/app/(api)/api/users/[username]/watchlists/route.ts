import { NextResponse } from 'next/server'

import { getUserByUsername } from '@/db/users'
import { queryWatchlistOverviews } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'

import type { WatchlistOverview } from '@/types/watchlists'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { username: string } }

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { username } = params
  const supabase = createServerClient()

  // Get user associated with username
  const userQuery = await getUserByUsername(supabase, username)
  if (userQuery.error) {
    if (userQuery.status === 406) {
      return NextResponse.json('User not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch user', { status: userQuery.status })
  }

  const watchlistIdsQueryResult = await supabase
    .from('watchlists_users')
    .select('watchlist_id')
    .eq('user_id', userQuery.data.id)
    .neq('role', 'viewer')

  if (watchlistIdsQueryResult.error) {
    console.error(watchlistIdsQueryResult)
    return NextResponse.json('Failed to fetch user watchlists IDs', {
      status: watchlistIdsQueryResult.status,
    })
  }

  const watchlistIds = [
    ...new Set(watchlistIdsQueryResult.data.map(({ watchlist_id }) => watchlist_id)),
  ]

  // Note: RLS will handle authorization checks
  const { data, error, status } = await queryWatchlistOverviews(supabase)
    .neq('watchlists_users.role', 'viewer')
    .in('id', watchlistIds)
    .returns<WatchlistOverview[]>()

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to fetch watchlists', { status })
  }

  return NextResponse.json<WatchlistOverview[]>(data)
}

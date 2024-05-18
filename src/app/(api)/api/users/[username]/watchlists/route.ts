import { NextResponse } from 'next/server'

import { getUserByUsername } from '@/db/users'
import { queryWatchlistsForUser, queryWatchlistOverviews } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'

import type { Watchlist, WatchlistOverview } from '@/types/watchlists'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { username: string } }

/**
 * Get watchlists associated with a user
 *
 * Accepts query params:
 * - editable: boolean - Return watchlists that the user can edit.
 *      If the requester is not the requested, this will always be true (outsiders cannot see watchlists for a viewer)
 * - overview: boolean - Return watchlist overviews instead of base watchlists
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { username } = params
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user associated with username
  const userResult = await getUserByUsername(supabase, username)
  if (userResult.error) {
    console.error(userResult)
    return NextResponse.json('Failed to fetch user', { status: 500 })
  }

  if (userResult.count === 0 || !userResult.data) {
    return NextResponse.json('User not found', { status: 404 })
  }

  const isLoggedInUser = user?.id === userResult.data.id

  // Only users should only be able to see their own watchlists with viewer roles
  const shouldReturnOnlyEditable =
    !isLoggedInUser || request.nextUrl.searchParams.get('editable') === 'true'

  const shouldReturnOverviews = request.nextUrl.searchParams.get('overview') === 'true'
  if (!shouldReturnOverviews) {
    // Note RLS will handle any private watchlists
    const watchlistsResult = await queryWatchlistsForUser(supabase, {
      userId: userResult.data.id,
      onlyEditable: shouldReturnOnlyEditable,
    }).order('updated_at', { ascending: false })

    if (watchlistsResult.error) {
      console.error(watchlistsResult)
      return NextResponse.json('Failed to fetch user watchlists', { status: 500 })
    }

    return NextResponse.json<Watchlist[]>(watchlistsResult.data)
  }

  let watchlistIdsQuery = supabase
    .from('watchlists_users')
    .select('watchlist_id')
    .eq('user_id', userResult.data.id)

  if (shouldReturnOnlyEditable) {
    watchlistIdsQuery = watchlistIdsQuery.neq('role', 'viewer')
  }

  const watchlistIdsQueryResult = await watchlistIdsQuery
  if (watchlistIdsQueryResult.error) {
    console.error(watchlistIdsQueryResult)
    return NextResponse.json('Failed to fetch user watchlists IDs', { status: 500 })
  }

  const watchlistIds = [
    ...new Set(watchlistIdsQueryResult.data.map(({ watchlist_id }) => watchlist_id)),
  ]

  // Note: RLS will handle authorization checks
  const overviewsResult = await queryWatchlistOverviews(supabase)
    .neq('watchlists_users.role', 'viewer') // Exclude other viewers in result
    .in('id', watchlistIds)
    .order('updated_at', { ascending: false })
    .returns<WatchlistOverview[]>()

  if (overviewsResult.error) {
    console.error(overviewsResult)
    return NextResponse.json('Failed to fetch watchlists', { status: 500 })
  }

  return NextResponse.json<WatchlistOverview[]>(overviewsResult.data)
}

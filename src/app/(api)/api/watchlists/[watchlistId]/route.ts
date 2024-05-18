import { NextResponse } from 'next/server'

import { getWatchlistById, getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'

import type { Watchlist } from '@/types/watchlists'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string } }

/**
 * Get a watchlist by ID
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()

  // Note authorization checks will be done via RLS, though it will be returning a 404
  const watchlistResult = await getWatchlistById(supabase, watchlistId)

  if (watchlistResult.error) {
    console.error(watchlistResult)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistResult.count === 0 || !watchlistResult.data) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  return NextResponse.json<Watchlist>(watchlistResult.data)
}

/**
 * Delete the watchlist with the given ID
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Get validation queries
  const [watchlistExistsResult, hasOwnerAccessResult] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    supabase.rpc('has_owner_access_to_watchlist', {
      _user_id: user.id,
      _watchlist_id: watchlistId,
    }),
  ])

  // Verify the watchlist belonging to the user exists
  if (watchlistExistsResult.error) {
    console.error(watchlistExistsResult.error)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistExistsResult.count === 0) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  if (hasOwnerAccessResult.error) {
    console.error(hasOwnerAccessResult.error)
    return NextResponse.json('Failed to verify user access to watchlist', { status: 500 })
  }

  const hasOwnerAccess = hasOwnerAccessResult.data
  if (!hasOwnerAccess) {
    return NextResponse.json('Watchlist does not belong to the user', { status: 403 })
  }

  // Delete the watchlist
  const { error, status, count } = await supabase
    .from('watchlists')
    .delete({ count: 'exact' })
    .eq('id', watchlistId)

  if (error) {
    console.error(error)
    return NextResponse.json(error, { status })
  }

  if (!count) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

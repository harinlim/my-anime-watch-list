import { NextResponse } from 'next/server'

import { getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string; animeId: string } }
/**
 * Remove an anime from a watchlist.
 * Body:
 *  - animeId: string | number
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const { animeId } = params

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Note authorization checks will be done via RLS, though it will be returning a 404
  const [watchlistExistsResult, hasEditAccessResult] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    supabase.rpc('has_edit_access_to_watchlist', {
      _user_id: user.id,
      _watchlist_id: watchlistId,
    }),
  ])

  if (!!watchlistExistsResult.error || watchlistExistsResult.count === 0) {
    if (watchlistExistsResult.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: watchlistExistsResult.status })
  }

  if (hasEditAccessResult.error) {
    console.error(hasEditAccessResult.error)
    return NextResponse.json('Failed to check if user has edit access to watchlist', {
      status: 500,
    })
  }

  const hasEditAccess = hasEditAccessResult.data
  if (!hasEditAccess) {
    return NextResponse.json('User does not have edit access to watchlist', { status: 403 })
  }

  // Remove anime from watchlist
  const deleteQuery = await supabase
    .from('watchlists_anime')
    .delete({ count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .eq('anime_id', animeId)

  if (deleteQuery.error) {
    return NextResponse.json(deleteQuery.error, { status: deleteQuery.status })
  }

  if (!deleteQuery.count) {
    return NextResponse.json('Anime not found in watchlist', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

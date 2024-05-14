import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string; animeId: string } }

const PERMITTED_ROLES = new Set(['owner', 'editor'])

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
  const watchlistQuery = await supabase
    .from('watchlists')
    .select('id, watchlists_users(role)')
    .eq('id', watchlistId)
    .eq('watchlists_users.user_id', user.id)
    .single()

  // Verify the watchlist belonging to the user exists
  if (!!watchlistQuery.error || !watchlistQuery.data) {
    if (watchlistQuery.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status: watchlistQuery.status })
  }

  // Verify user has permission to remove anime from watchlist
  const users = watchlistQuery.data.watchlists_users
  if (users.length === 0 || !PERMITTED_ROLES.has(users[0].role)) {
    return NextResponse.json('User is not permitted to modify watchlist', { status: 403 })
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

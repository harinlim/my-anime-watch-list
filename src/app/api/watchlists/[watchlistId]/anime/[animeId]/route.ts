import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string; animeId: string } }

/**
 * Remove an anime from a watchlist.
 * Body:
 *  - animeId: string | number
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

  const watchlistQuery = await supabase
    .from('watchlists')
    .select('*')
    .eq('id', watchlistId)
    .single()

  // Verify the watchlist belonging to the user exists
  if (!!watchlistQuery.error || !watchlistQuery.data) {
    if (watchlistQuery.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status: watchlistQuery.status })
  }

  const watchlist = watchlistQuery.data
  if (watchlist.user_id !== user.id) {
    return NextResponse.json('Watchlist does not belong to the user', { status: 403 })
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

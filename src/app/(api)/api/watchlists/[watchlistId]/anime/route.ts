import { NextResponse } from 'next/server'

import { getAnimeByWatchlist, getAnimeExistsById } from '@/db/anime'
import { getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { parseRequestBody } from '@/lib/zod/api'
import { transformAnimeByWatchlist } from '@/utils/watchlist-anime'

import { addWatchlistAnimeRequestBodySchema } from './schemas'

import type { AnimeByWatchlist } from '@/types/anime'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string } }

/**
 * Get a watchlist anime list
 *
 * TODO: add pagination and sort
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const watchlistResult = await getAnimeByWatchlist(supabase, { userId: user?.id, watchlistId })

  if (watchlistResult.error) {
    console.error(watchlistResult)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (!watchlistResult.data) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  return NextResponse.json<AnimeByWatchlist[]>(watchlistResult.data.map(transformAnimeByWatchlist))
}

/**
 * Add an anime to an existing watchlist.
 * Body:
 *  - animeId: string | number
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const body = await parseRequestBody(request, addWatchlistAnimeRequestBodySchema)
  if (body === null) {
    return NextResponse.json('Failed to parse request body', { status: 400 })
  }

  const animeId = `${body.animeId}`

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Get validation queries
  const [watchlistExistsResult, animeExistsResult] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    getAnimeExistsById(supabase, animeId),
  ])

  // Verify the watchlist exists
  if (watchlistExistsResult.error) {
    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistExistsResult.count === 0) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  // Verify anime exists in DB
  if (animeExistsResult.error) {
    console.error(animeExistsResult.error)
    return NextResponse.json('Failed to fetch anime from DB', { status: 500 })
  }

  if (animeExistsResult.count === 0) {
    return NextResponse.json('Anime not found', { status: 404 })
  }

  // Add anime to watchlist
  // Note anime conflict and permission checks are done via RLS
  const { error, status } = await supabase.from('watchlists_anime').insert({
    watchlist_id: watchlistId,
    anime_id: animeId,
  })

  if (error) {
    switch (status) {
      case 403: {
        return NextResponse.json('User is not allowed to add anime to this watchlist', { status })
      }
      case 409: {
        return NextResponse.json('Anime is already in watchlist', { status })
      }
      default: {
        console.error(error)
        return NextResponse.json('Failed to add anime to watchlist', { status })
      }
    }
  }

  return NextResponse.json({ watchlistId, animeId }, { status: 201 })
}

import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'
import { parseRequestBody } from '@/lib/zod/api'

import { watchlistAnimeRequestBodySchema } from './schemas'

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
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error, status } = await supabase
    .from('watchlists')
    .select('*, anime(*)')
    .eq('id', watchlistId)
    .single()

  if (!!error || !data) {
    if (status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status })
  }

  if (!data.is_public && (!user || user.id !== data.user_id)) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  return NextResponse.json<Watchlist>(data)
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

  const body = await parseRequestBody(request, watchlistAnimeRequestBodySchema)
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
  const [watchlistQuery, animeQuery, watchlistAnimeQuery] = await Promise.all([
    supabase.from('watchlists').select('*').eq('id', watchlistId).single(),
    supabase
      .from('anime')
      .select('kitsu_id', { head: true, count: 'exact' })
      .eq('kitsu_id', animeId),
    supabase
      .from('watchlists_anime')
      .select('*', { head: true, count: 'exact' })
      .eq('watchlist_id', watchlistId)
      .eq('anime_id', animeId),
  ])

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

  // Verify anime exists in DB
  if (!!animeQuery.error || !animeQuery.count) {
    if (animeQuery.status === 406) {
      return NextResponse.json('Anime not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch anime', { status: animeQuery.status })
  }

  // Verify anime is not already in the watchlist
  if (!!watchlistAnimeQuery.error && watchlistAnimeQuery.status !== 406) {
    return NextResponse.json('Failed to fetch watchlist anime', {
      status: watchlistAnimeQuery.status,
    })
  }

  if (watchlistAnimeQuery.count) {
    return NextResponse.json('Anime is already in watchlist', { status: 409 })
  }

  // Add anime to watchlist
  const { error, status } = await supabase.from('watchlists_anime').insert({
    watchlist_id: watchlistId,
    anime_id: animeId,
  })

  if (error) {
    return NextResponse.json('Failed to add anime to watchlist', { status })
  }

  return NextResponse.json({ watchlistId, animeId }, { status: 201 })
}

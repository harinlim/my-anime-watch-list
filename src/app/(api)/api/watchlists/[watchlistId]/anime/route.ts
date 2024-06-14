import { NextResponse } from 'next/server'

import { getAnimeByWatchlist, getAnimeExistsById } from '@/db/anime'
import { getUserFromSession } from '@/db/users'
import { getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { parseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'
import { transformAnimeByWatchlist } from '@/utils/watchlist-anime'

import { addWatchlistAnimeRequestBodySchema, getWatchlistAnimeQueryParamsSchema } from './schemas'

import type { GetWatchlistAnimeResponse } from './types'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string } }

/**
 * Get a watchlist anime list
 *
 * TODO: add sort
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const { searchParams } = request.nextUrl

  const queryParamsResult = getWatchlistAnimeQueryParamsSchema.safeParse({
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing -- account for empty string */
    // sort: searchParams.get('sort') || 'updated_at',
    // direction: searchParams.get('direction') || 'asc',
    page: searchParams.get('page') || 1, // yay magic numbers
    limit: searchParams.get('limit') || 10,
    /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
  })

  if (!queryParamsResult.success) {
    return NextResponse.json(transformZodValidationErrorToResponse(queryParamsResult.error), {
      status: 400,
    })
  }

  const queryParams = queryParamsResult.data

  const supabase = createServerClient()

  const { data: user } = await getUserFromSession(supabase)

  const currentOffset = (queryParams.page - 1) * queryParams.limit
  const nextOffset = currentOffset + queryParams.limit

  const searchResult = await getAnimeByWatchlist(supabase, {
    userId: user?.id,
    watchlistId,
  }).range(currentOffset, nextOffset - 1)

  if (searchResult.error) {
    console.error(searchResult)
    return NextResponse.json<GetWatchlistAnimeResponse>(
      {
        ok: false,
        data: null,
        error: searchResult.error,
        status: searchResult.status,
        message: 'Failed to fetch watchlist anime',
      },
      { status: searchResult.status }
    )
  }

  const total = searchResult.count ?? searchResult.data.length

  return NextResponse.json<GetWatchlistAnimeResponse>({
    data: searchResult.data.map(transformAnimeByWatchlist),
    ok: true,
    status: 200,
    meta: {
      total,
      limit: queryParams.limit,
      self: queryParams.page,
      prev: queryParams.page > 1 ? queryParams.page - 1 : undefined,
      next: nextOffset < total ? queryParams.page + 1 : undefined,
    },
  })
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

  const { data: user } = await getUserFromSession(supabase)
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

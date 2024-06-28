import { NextResponse } from 'next/server'

import { getAnimeByUserAssociation } from '@/db/anime'
import { getUserByUsername, getUserFromSession } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'
import { transformAnimeByUserAssociation } from '@/utils/user-anime'

import { getAnimeByUserQueryParamsSchema } from './schemas'
import { SORT_ANIME_COMPARATORS } from './utils'

import type { GetUserAnimeResponse } from './types'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { username: string } }

/**
 * Get anime associated with a user
 *
 * TODO: Make a view for the query to enable more efficient filter/sort operations
 * TODO: Add pagination and filtering, but not necessary for now
 *
 * Note: not going to worry about pagination or metadata here.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { username } = params

  const supabase = createServerClient()

  const { data: user } = await getUserFromSession(supabase)
  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Get user associated with username
  const userResult = await getUserByUsername(supabase, username)
  if (userResult.error) {
    console.error(userResult)
    return NextResponse.json('Failed to fetch user', { status: 500 })
  }

  if (userResult.count === 0 || !userResult.data) {
    return NextResponse.json('User not found', { status: 404 })
  }

  const userId = userResult.data.id

  const isLoggedInUser = user.id === userId
  if (!isLoggedInUser) {
    return NextResponse.json('User does not have access to this resource', { status: 403 })
  }

  // TODO: Add query params (filter: status, rating, sort, pagination)

  const { searchParams } = request.nextUrl

  const queryParamsResult = getAnimeByUserQueryParamsSchema.safeParse({
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing -- account for empty string */
    status: searchParams.get('status') || null,
    rating: searchParams.get('rating') || null,
    sort: searchParams.get('sort') || 'status',
    direction: searchParams.get('direction') || 'asc',
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

  const hasFilter = !!queryParams.status || !!queryParams.rating

  // 1. Get anime IDs from user_reviews and watchlists associated with the user

  let reviewsQuery = supabase.from('user_reviews').select(`anime_id`).eq('user_id', userId)

  if (queryParams.status) reviewsQuery = reviewsQuery.eq('status', queryParams.status)
  if (queryParams.rating) reviewsQuery = reviewsQuery.eq('rating', queryParams.rating)

  // When there's a filter, don't query for watchlists
  const watchlistsUsersQuery = hasFilter
    ? null
    : supabase
        .from('watchlists_anime')
        .select(
          `
          anime_id,
          watchlists(
            id,
            is_public,
            watchlists_users!inner(role, user_id, watchlist_id))
          `
        )
        .eq('watchlists.watchlists_users.user_id', userId)
        // For some reason, filtering on watchlists_users.user_id doesn't filter out watchlist_anime entries that don't have associated watchlists.
        // Look into this later.
        .not('watchlists', 'is', null)

  const [reviewedAnimeQueryResult, watchlistsUsersAnimeQueryResult] = await Promise.all([
    reviewsQuery,
    watchlistsUsersQuery,
  ])

  if (watchlistsUsersAnimeQueryResult?.error) {
    console.error(watchlistsUsersAnimeQueryResult)
    return NextResponse.json('Failed to fetch anime IDs of user-associated watchlists', {
      status: watchlistsUsersAnimeQueryResult.status,
    })
  }

  if (reviewedAnimeQueryResult.error) {
    console.error(reviewedAnimeQueryResult)
    return NextResponse.json('Failed to fetch anime IDs of user-reviewed animes', {
      status: reviewedAnimeQueryResult.status,
    })
  }

  // 2. Query for anime based on unique anime IDs

  const associatedAnimeIds = [
    ...new Set([
      ...(watchlistsUsersAnimeQueryResult?.data.map(watchlist => watchlist.anime_id) ?? []),
      ...reviewedAnimeQueryResult.data.map(review => review.anime_id),
    ]),
  ]

  const currentOffset = (queryParams.page - 1) * queryParams.limit
  const nextOffset = currentOffset + queryParams.limit

  const userAnimeResult = await getAnimeByUserAssociation(supabase, {
    userId,
    associatedAnimeIds,
  }).range(currentOffset, nextOffset - 1)

  if (userAnimeResult.error) {
    console.error(userAnimeResult)
    return NextResponse.json<GetUserAnimeResponse>(
      {
        ok: false,
        data: null,
        error: userAnimeResult.error,
        status: userAnimeResult.status,
        message: 'Failed to fetch user anime',
      },
      { status: userAnimeResult.status }
    )
  }

  const total = userAnimeResult.count ?? userAnimeResult.data.length

  return NextResponse.json<GetUserAnimeResponse>({
    data: userAnimeResult.data
      .map(transformAnimeByUserAssociation)
      // TEMPORARY SOLUTION UNTIL WE ESTABLISH A VIEW FOR THE USER ANIMES
      .toSorted(SORT_ANIME_COMPARATORS[queryParams.sort][queryParams.direction]),
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

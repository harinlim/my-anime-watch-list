import { NextResponse } from 'next/server'

import { getAnimeByUserAssociation } from '@/db/anime'
import { getUserByUsername } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'
import { transformAnimeByUserAssociation } from '@/utils/user-anime'

import { getAnimeByUserQueryParamsSchema } from './schemas'
import { SORT_ANIME_COMPARATORS } from './utils'

import type { GetAnimeByUserAssociationResponse } from './types'
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

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Get user associated with username
  const userQueryResult = await getUserByUsername(supabase, username)
  if (userQueryResult.error) {
    if (userQueryResult.status === 406) {
      return NextResponse.json('User not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch user', { status: userQueryResult.status })
  }

  const userId = userQueryResult.data.id

  const isLoggedInUser = user.id === userId
  if (!isLoggedInUser) {
    return NextResponse.json('User does not have access to this resource', { status: 403 })
  }

  // TODO: Add query params (filter: status, rating, sort, pagination)

  const { searchParams } = request.nextUrl

  const queryParamsResult = getAnimeByUserQueryParamsSchema.safeParse({
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
    status: searchParams.get('status') || null,
    rating: searchParams.get('rating') || null,
    sort: searchParams.get('sort') || 'status',
    direction: searchParams.get('direction') || 'asc',
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

  const userAnimeResult = await getAnimeByUserAssociation(supabase, {
    userId,
    associatedAnimeIds,
  })

  if (userAnimeResult.error) {
    console.error(userAnimeResult)
    return NextResponse.json('Failed to fetch anime', { status: userAnimeResult.status })
  }

  return NextResponse.json<GetAnimeByUserAssociationResponse>(
    transformAnimeByUserAssociation(userAnimeResult.data)
      // TEMPORARY SOLUTION UNTIL WE ESTABLISH A VIEW FOR THE USER ANIMES
      .toSorted(SORT_ANIME_COMPARATORS[queryParams.sort][queryParams.direction])
  )
}

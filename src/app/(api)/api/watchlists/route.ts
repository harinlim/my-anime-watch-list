import { NextResponse, type NextRequest } from 'next/server'

import { queryWatchlistOverviews } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { searchWatchlistsQueryParamsSchema, watchlistRequestBodySchema } from './schemas'

import type { SearchWatchlistsResponse } from './types'
import type { WatchlistOverview } from '@/types/watchlists'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const supabase = createServerClient()
  // Check if a user's logged in

  const queryParamsResult = searchWatchlistsQueryParamsSchema.safeParse({
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
    search: searchParams.get('search'),
    sort: searchParams.get('sort') || 'updated_at',
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

  // Note: RLS will filter out any watchlists that the user doesn't have access to, but will include any
  // private watchlists the user DOES have access to.
  let query = queryWatchlistOverviews(supabase)

  // TODO: set up RPC function to enable deeper search on watchlists via search_vector
  if (queryParams.search)
    query = query.textSearch('title', queryParams.search, {
      type: 'websearch',
      config: 'english',
    })

  // Handle order + pagination
  const currentOffset = (queryParams.page - 1) * queryParams.limit
  const nextOffset = currentOffset + queryParams.limit
  query = query
    .order(queryParams.sort, { ascending: queryParams.direction === 'asc' })
    .range(currentOffset, nextOffset - 1)

  const { data, count, status, error } = await query.returns<WatchlistOverview[]>()
  if (error) {
    return NextResponse.json<SearchWatchlistsResponse>(
      {
        ok: false,
        data: null,
        error,
        status,
        message: 'Failed to fetch watchlists',
      },
      { status }
    )
  }

  const total = count ?? data.length

  return NextResponse.json<SearchWatchlistsResponse>({
    data,
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

export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Validate request body
  const body = await safeParseRequestBody(request, watchlistRequestBodySchema)
  if (!body.success) {
    if (body.error) {
      return NextResponse.json(transformZodValidationErrorToResponse(body.error), { status: 422 })
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  const { title, description, isPublic } = body.data

  const { error, status } = await supabase.from('watchlists').insert({
    title,
    description,
    is_public: isPublic,
    user_id: user.id,
  })

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to create watchlist', { status })
  }

  return NextResponse.json({ title, description, isPublic, userId: user.id }, { status: 201 })
}

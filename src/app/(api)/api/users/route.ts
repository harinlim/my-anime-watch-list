import { NextResponse } from 'next/server'

import { getUserFromSession } from '@/db/users'
import { createServerClient } from '@/lib/supabase/server'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { MAX_USERS_LIMIT } from './constants'
import { searchUsersParamsSchema } from './schemas'

import type { UserSearchOptions } from './types'
import type { User, PublicUser } from '@/types/users'
import type { NextRequest } from 'next/server'

function prepareSearchOptions({
  search,
  excludeWatchlistId,
}: {
  search: string
  excludeWatchlistId?: number | null
}): UserSearchOptions {
  if (excludeWatchlistId) {
    return { prefix: search, exclude_watchlist_id: excludeWatchlistId }
  }
  return { prefix: search }
}

/**
 * Get user information from given auth cookies OR by search.
 * If no search query is provided, return the user's information aka ME
 * If a search query is provided, return all users that have usernames starting with the search query
 */
export async function GET(request: NextRequest) {
  const supabase = createServerClient()

  const { searchParams } = request.nextUrl

  const searchParamsResult = searchUsersParamsSchema.safeParse({
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
    search: searchParams.get('search'),
    limit: searchParams.get('limit') || null,
    excludeWatchlistId: searchParams.get('excludeWatchlistId') || null,
    /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
  })

  // If search params are invalid, return an error
  if (!searchParamsResult.success) {
    return NextResponse.json(
      {
        message: 'Invalid search params',
        ...transformZodValidationErrorToResponse(searchParamsResult.error),
      },
      { status: 400 }
    )
  }

  // If no search param is provided, return the current user's information aka ME
  if (searchParamsResult.data.search === null) {
    const { data: user } = await getUserFromSession(supabase)
    if (!user) {
      return NextResponse.json('Failed authorization', { status: 401 })
    }

    // TODO: is this even necessary?
    const userResult = await supabase
      .from('users')
      .select(`username, email, avatar_url`, { count: 'exact' })
      .eq('id', user.id)
      .maybeSingle()

    if (userResult.error) {
      console.error(userResult)
      return NextResponse.json('Failed to fetch user', { status: 500 })
    }

    if (userResult.count === 0 || !userResult.data) {
      return NextResponse.json('User not found', { status: 404 })
    }

    return NextResponse.json<User>({
      id: user.id,
      ...userResult.data,
    })
  }

  const { limit, search: searchValue, excludeWatchlistId } = searchParamsResult.data

  const searchOptions = prepareSearchOptions({
    search: searchValue,
    excludeWatchlistId,
  })

  // If a search query is provided, return all users that have usernames starting with the search query
  // RPC is ordered by length of username, then by username (alphabetically)
  const userSearchResults = await supabase
    .rpc('search_users', searchOptions)
    .select('id, username, avatar_url')
    .limit(limit ?? MAX_USERS_LIMIT)

  if (userSearchResults.error) {
    console.error(userSearchResults)
    return NextResponse.json('Failed to fetch users', { status: 500 })
  }

  return NextResponse.json<PublicUser[]>(userSearchResults.data, { status: 200 })
}

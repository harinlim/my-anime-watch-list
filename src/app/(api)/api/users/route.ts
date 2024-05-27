import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { MAX_USERS_LIMIT } from './constants'
import { searchUsersParamsSchema } from './schemas'

import type { User, PublicUser } from '@/types/users'
import type { NextRequest } from 'next/server'

/**  Get user information from given auth cookies OR by search.
 * If no search query is provided, return the user's information aka ME
 * If a search query is provided, return all users that have usernames starting with the search query
 */
export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  const { searchParams } = request.nextUrl

  const searchParamsResult = searchUsersParamsSchema.safeParse({
    /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
    search: searchParams.get('search'),
    limit: searchParams.get('limit') || null,
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

  // If no search query is provided, return the current user's information aka ME
  if (searchParamsResult.data.search === null) {
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

  const { limit, search: searchValue } = searchParamsResult.data

  // If an empty search query is provided, return all users
  if (searchValue === '') {
    const userSearchResults = await supabase
      .from('users')
      .select('id, username, avatar_url')
      .order('username')
      .limit(limit ?? MAX_USERS_LIMIT)

    if (userSearchResults.error) {
      console.error(userSearchResults.error)
      return NextResponse.json('Failed to fetch users', { status: 500 })
    }

    return NextResponse.json<PublicUser[]>(userSearchResults.data, { status: 200 })
  }

  // If a search query is provided, return all users that have usernames starting with the search query
  // RPC is ordered by length of username, then by username (alphabetically)
  const userSearchResults = await supabase
    .rpc('search_users_by_username_prefix', {
      prefix: searchValue,
    })
    .select('id, username, avatar_url')
    .limit(limit ?? MAX_USERS_LIMIT)

  if (userSearchResults.error) {
    console.error(userSearchResults)
    return NextResponse.json('Failed to fetch users', { status: 500 })
  }

  return NextResponse.json<PublicUser[]>(userSearchResults.data, { status: 200 })
}

import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

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
    search: searchParams.get('search'),
  })

  // If search params are invalid, return an error
  if (!searchParamsResult.success) {
    return NextResponse.json('Invalid search params', { status: 400 })
  }

  // If no search query is provided, return the user's information aka ME
  if (!searchParamsResult.data.search) {
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

  const searchValue = searchParamsResult.data.search

  // If a search query is provided, return all users that have usernames starting with the search query
  const usersResults = await supabase
    .rpc('search_users_by_username_prefix', {
      prefix: searchValue,
    })
    .limit(20)

  console.error(usersResults)

  if (usersResults.error) {
    console.error(usersResults.error)
    return NextResponse.json('Failed to fetch users', { status: 500 })
  }

  return NextResponse.json<PublicUser[]>(
    usersResults.data.map(({ id, username, avatar_url }) => ({
      id,
      username,
      avatar_url,
    })),
    { status: 200 }
  )
}

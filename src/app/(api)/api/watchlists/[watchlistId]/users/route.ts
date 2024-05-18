import { NextResponse } from 'next/server'

import { getUserExistsById } from '@/db/users'
import { getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { getWatchlistCollaborators } from './queries'
import { watchlistCollaboratorRequestBodySchema } from './schemas'

import type { GetWatchlistCollaboratorsResponse } from './types'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string } }

/**
 * Get watchlist collaborators by ID
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)

  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()

  // Note auth-based filters are applied via RLS
  const [collaboratorsQueryResult, watchlistExistsResult] = await Promise.all([
    getWatchlistCollaborators(supabase, watchlistId),
    getWatchlistExistsById(supabase, watchlistId),
  ])

  if (watchlistExistsResult.error) {
    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: watchlistExistsResult.status })
  }

  if (watchlistExistsResult.count === 0) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  if (!!collaboratorsQueryResult.error || !collaboratorsQueryResult.data) {
    return NextResponse.json('Failed to fetch watchlist users', {
      status: collaboratorsQueryResult.status,
    })
  }

  return NextResponse.json<GetWatchlistCollaboratorsResponse>(collaboratorsQueryResult.data)
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)

  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  const body = await safeParseRequestBody(request, watchlistCollaboratorRequestBodySchema)
  if (!body.success) {
    if (body.error) {
      return NextResponse.json(transformZodValidationErrorToResponse(body.error), { status: 422 })
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  const { userId: userToAddId, role } = body.data

  const [
    watchlistExistsResult,
    userExistsResult,
    isRequestedUserWatchlistCollaboratorResult,
    hasEditAccessResult,
  ] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    getUserExistsById(supabase, userToAddId),
    supabase.rpc('has_watchlist', {
      _user_id: userToAddId,
      _watchlist_id: watchlistId,
    }),
    supabase.rpc('has_edit_access_to_watchlist', {
      _user_id: user.id,
      _watchlist_id: watchlistId,
    }),
  ])

  if (watchlistExistsResult.error) {
    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistExistsResult.count === 0) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  if (userExistsResult.error) {
    console.error(userExistsResult)
    return NextResponse.json('Failed to fetch requested user', { status: 500 })
  }

  if (userExistsResult.count === 0) {
    // This is a 422 because the user ID is invalid
    return NextResponse.json('Requested user not found', { status: 422 })
  }

  if (isRequestedUserWatchlistCollaboratorResult.error) {
    console.error(isRequestedUserWatchlistCollaboratorResult.error)
    return NextResponse.json('Failed to verify requested user role for watchlist', { status: 500 })
  }

  const isRequestedUserWatchlistCollaborator = isRequestedUserWatchlistCollaboratorResult.data
  if (isRequestedUserWatchlistCollaborator) {
    return NextResponse.json('Requested user is already added to the watchlist', { status: 409 })
  }

  if (hasEditAccessResult.error) {
    console.error(hasEditAccessResult.error)
    return NextResponse.json('Failed to verify user access to watchlist', {
      status: 500,
    })
  }

  const hasEditAccess = hasEditAccessResult.data
  if (!hasEditAccess) {
    return NextResponse.json('User does not have edit access to watchlist', { status: 403 })
  }

  const { error } = await supabase.from('watchlists_users').insert({
    watchlist_id: watchlistId,
    user_id: userToAddId,
    role,
  })

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to add requested user as collaborator to watchlist', {
      status: 500,
    })
  }

  return NextResponse.json({ watchlistId, userId: userToAddId, role }, { status: 201 })
}

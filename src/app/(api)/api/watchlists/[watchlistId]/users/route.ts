import { NextResponse } from 'next/server'

import { getUsersExistByIds } from '@/db/users'
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

/**
 * Add a user as a collaborator to a watchlist
 *
 * - Only those with edit access to a watchlist can add collaborators.
 * - The user to be added must not already be a collaborator.
 * - Only editors/viewers can be added at this time.
 */
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

  // Validate request body
  const body = await safeParseRequestBody(request, watchlistCollaboratorRequestBodySchema)
  if (!body.success) {
    if (body.error) {
      console.error(body.error)
      return NextResponse.json(transformZodValidationErrorToResponse(body.error), { status: 422 })
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  const { data: usersToAdd } = body

  // Get validation queries

  const [
    watchlistExistsResult,
    hasEditAccessResult,
    usersExistResult,
    areRequestedUsersWatchlistCollaboratorResult,
  ] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    supabase.rpc('has_edit_access_to_watchlist', {
      _user_id: user.id,
      _watchlist_id: watchlistId,
    }),
    getUsersExistByIds(
      supabase,
      usersToAdd.map(userToAdd => userToAdd.userId)
    ),
    supabase.rpc('has_watchlist_batch', {
      _user_ids: usersToAdd.map(userToAdd => userToAdd.userId),
      _watchlist_id: watchlistId,
    }),
  ])

  // Verify the watchlist exists
  if (watchlistExistsResult.error) {
    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistExistsResult.count === 0) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  // Verify the user has edit access to the watchlist
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

  // Verify the user exists
  if (usersExistResult.error) {
    console.error(usersExistResult)
    return NextResponse.json('Failed to fetch requested users', {
      status: 500,
    })
  }

  if (usersExistResult.count === 0) {
    // This is a 422 because the user ID is invalid
    return NextResponse.json('Requested users not found', {
      status: 422,
    })
  }

  // Verify the requested user is not already a collaborator
  if (areRequestedUsersWatchlistCollaboratorResult.error) {
    console.error(areRequestedUsersWatchlistCollaboratorResult.error)
    return NextResponse.json('Failed to verify requested user role for watchlist with ID', {
      status: 500,
    })
  }

  const areRequestedUsersWatchlistCollaborator = areRequestedUsersWatchlistCollaboratorResult.data
  if (areRequestedUsersWatchlistCollaborator) {
    return NextResponse.json('Requested user is already added to the watchlist', {
      status: 409,
    })
  }

  // Add the user as a collaborator
  const { error } = await supabase.from('watchlists_users').insert(
    usersToAdd.map(userToAdd => ({
      watchlist_id: watchlistId,
      user_id: userToAdd.userId,
      role: userToAdd.role,
    }))
  )

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to add requested users as collaborators to watchlist', {
      status: 500,
    })
  }

  return NextResponse.json({ watchlistId, users: usersToAdd }, { status: 201 })
}

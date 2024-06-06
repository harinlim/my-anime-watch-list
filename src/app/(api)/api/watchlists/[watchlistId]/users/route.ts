import { NextResponse } from 'next/server'

import { getUserFromSession } from '@/db/users'
import { getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { getWatchlistCollaborators, getUsersByIds, getCollaboratorsByUserIds } from './queries'
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
 * Add a users as a collaborator to a watchlist
 *
 * Accepts two request body formats:
 * - Single user: { userId: string, role: 'editor' | 'viewer' }
 * - Multiple users: { users: [{ userId: string, role: 'editor' | 'viewer' }] }
 *
 * Notes:
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

  const { data: user } = await getUserFromSession(supabase)
  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Validate request body
  const body = await safeParseRequestBody(request, watchlistCollaboratorRequestBodySchema)
  if (!body.success) {
    if (body.error) {
      return NextResponse.json(
        transformZodValidationErrorToResponse(body.error, e => ({ errors: e.format() })),
        { status: 422 }
      )
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  const isRequestingMultiple = 'users' in body.data
  const usersToAdd = 'users' in body.data ? body.data.users : [body.data]

  const usersToAddIds = usersToAdd.map(userToAdd => userToAdd.userId)

  // Get validation queries
  const [
    watchlistExistsResult,
    hasEditAccessResult,
    requestedUsersResult,
    requestedUsersInWatchlistResult,
  ] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    supabase.rpc('has_edit_access_to_watchlist', {
      _user_id: user.id,
      _watchlist_id: watchlistId,
    }),
    getUsersByIds(supabase, usersToAddIds),
    getCollaboratorsByUserIds(supabase, { watchlistId, userIds: usersToAddIds }),
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
    return NextResponse.json('Failed to verify user access to watchlist', { status: 500 })
  }

  const hasEditAccess = hasEditAccessResult.data
  if (!hasEditAccess) {
    return NextResponse.json('User does not have edit access to watchlist', { status: 403 })
  }

  // Verify the user(s) exists
  if (!!requestedUsersResult.error || requestedUsersResult.count === null) {
    console.error(requestedUsersResult)

    const message = isRequestingMultiple
      ? 'Failed to fetch requested users'
      : 'Failed to fetch requested user'
    return NextResponse.json(message, { status: 500 })
  }

  // This is a 422 because the user ID is invalid
  if (requestedUsersResult.count !== usersToAdd.length) {
    if (!isRequestingMultiple) {
      return NextResponse.json(`Requested user does not exist: ${usersToAddIds[0]}`, {
        status: 422,
      })
    }

    const missingUserIds = usersToAddIds.filter(
      userId => !requestedUsersResult.data?.some(u => u.id === userId)
    )
    return NextResponse.json(`Requested users do not exist: [${missingUserIds.join(',')}]`, {
      status: 422,
    })
  }

  // Verify the requested user is not already a collaborator
  if (!!requestedUsersInWatchlistResult.error || requestedUsersInWatchlistResult.count === null) {
    console.error(requestedUsersInWatchlistResult)

    const message = isRequestingMultiple
      ? "Failed to verify requested users' roles in watchlist"
      : "Failed to verify requested user's role in watchlist"
    return NextResponse.json(message, { status: 500 })
  }

  if (requestedUsersInWatchlistResult.count > 0) {
    if (!isRequestingMultiple) {
      return NextResponse.json(
        `Requested user is already added to the watchlist: ${usersToAddIds[0]}`,
        { status: 409 }
      )
    }

    const existingUserIds = usersToAddIds.filter(userId =>
      requestedUsersInWatchlistResult.data?.some(u => u.user_id === userId)
    )
    return NextResponse.json(
      `Requested user are already added to the watchlist: [${existingUserIds.join(',')}]`,
      { status: 409 }
    )
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

import { NextResponse } from 'next/server'

import { getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { getWatchlistRoleForUser } from '../queries'

import {
  patchCollaboratorRoleRequestBodySchema,
  watchlistCollaboratorQueryParamsSchema,
} from './schemas'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { userId: string; watchlistId: string } }

/**
 * Update the watchlist collaborator with the given user ID and watchlist ID.
 *
 * Note: Only editors or owners of the watchlist can update collaborator roles, and owner roles cannot be updated.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const paramsResult = watchlistCollaboratorQueryParamsSchema.safeParse(params)
  if (!paramsResult.success) {
    return NextResponse.json(transformZodValidationErrorToResponse(paramsResult.error), {
      status: 400,
    })
  }

  const { userId: userToUpdateId, watchlistId } = paramsResult.data

  const supabase = createServerClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  const body = await safeParseRequestBody(request, patchCollaboratorRoleRequestBodySchema)
  if (!body.success) {
    if (body.error) {
      return NextResponse.json(transformZodValidationErrorToResponse(body.error), { status: 422 })
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  const { role } = body.data

  const [watchlistExistsResult, requestedUserRoleResult, hasEditAccessResult] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    getWatchlistRoleForUser(supabase, { watchlistId, userId: userToUpdateId }),
    supabase.rpc('has_edit_access_to_watchlist', {
      _user_id: user.id,
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

  if (hasEditAccessResult.error) {
    console.error(hasEditAccessResult.error)
    return NextResponse.json('Failed to verify user access to watchlist', { status: 500 })
  }

  const hasEditAccess = hasEditAccessResult.data
  if (!hasEditAccess) {
    return NextResponse.json('User does not have edit access to watchlist', { status: 403 })
  }

  if (requestedUserRoleResult.error) {
    console.error(requestedUserRoleResult.error)
    return NextResponse.json('Failed to check if requested user is a collaborator for watchlist', {
      status: 500,
    })
  }

  if (requestedUserRoleResult.count === 0 || !requestedUserRoleResult.data) {
    return NextResponse.json('Requested user is not a collaborator', { status: 404 })
  }

  const requestedUserRole = requestedUserRoleResult.data.role
  if (requestedUserRole === 'owner') {
    return NextResponse.json('Watchlist owner role cannot be changed', { status: 403 })
  }

  const { error } = await supabase
    .from('watchlists_users')
    .update({ role })
    .match({ watchlist_id: watchlistId, user_id: userToUpdateId })

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to update watchlist role for requested user', { status: 500 })
  }

  return new Response(null, { status: 204 })
}

/**
 * Delete the watchlist collaborator with the given user ID and watchlist ID.
 *
 * Note: Only the owner of the watchlist or the collaborator themselves can delete the collaborator.
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const paramsResult = watchlistCollaboratorQueryParamsSchema.safeParse(params)

  if (!paramsResult.success) {
    return NextResponse.json(transformZodValidationErrorToResponse(paramsResult.error), {
      status: 400,
    })
  }

  const { userId: userToDeleteId, watchlistId } = paramsResult.data

  const supabase = createServerClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Get validation queries
  const [watchlistExistsResult, hasOwnerAccessResult] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
    supabase.rpc('has_owner_access_to_watchlist', {
      _user_id: user.id,
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
  if (hasOwnerAccessResult.error) {
    console.error(hasOwnerAccessResult.error)
    return NextResponse.json('Failed to check if user has access to watchlist', {
      status: 500,
    })
  }

  const hasOwnerAccess = hasOwnerAccessResult.data

  // Owners cannot remove themselves from the watchlist
  if (userToDeleteId === user.id && hasOwnerAccess) {
    return NextResponse.json('Owners cannot remove themselves from the watchlist', { status: 400 })
  }

  // Verify the user has permission to remove the collaborator or themself
  if (userToDeleteId !== user.id && !hasOwnerAccess) {
    return NextResponse.json('User is not permitted to remove requested', { status: 403 })
  }

  // Delete the collaborator
  const deleteCollaboratorQueryResult = await supabase
    .from('watchlists_users')
    .delete({ count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .eq('user_id', userToDeleteId)

  if (deleteCollaboratorQueryResult.error) {
    console.error(deleteCollaboratorQueryResult.error)
    return NextResponse.json(deleteCollaboratorQueryResult.error, {
      status: deleteCollaboratorQueryResult.status,
    })
  }

  if (!deleteCollaboratorQueryResult.count) {
    return NextResponse.json('Collaborator not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

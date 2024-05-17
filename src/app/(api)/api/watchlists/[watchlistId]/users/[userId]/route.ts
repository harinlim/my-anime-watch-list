import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { getWatchlistById, getWatchlistRoleForUser } from '../queries'

import { patchCollaboratorRoleRequestBodySchema, watchlistCollaboratorParamSchema } from './schemas'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { userId: string; watchlistId: string } }

/**
 * Update the watchlist collaborator with the given user ID and watchlist ID.
 *
 * Note: Only editors or owners of the watchlist can update collaborator roles, and owner roles cannot be updated.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const paramsResult = watchlistCollaboratorParamSchema.safeParse(params)

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
    getWatchlistById(supabase, watchlistId),
    getWatchlistRoleForUser(supabase, { watchlistId, userId: userToUpdateId }),
    supabase.rpc('has_edit_access_to_watchlist', {
      _user_id: user.id,
      _watchlist_id: watchlistId,
    }),
  ])

  if (!!watchlistExistsResult.error || watchlistExistsResult.count === 0) {
    if (watchlistExistsResult.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: watchlistExistsResult.status })
  }

  if (hasEditAccessResult.error) {
    console.error(hasEditAccessResult.error)
    return NextResponse.json('Failed to check if user has edit access to watchlist', {
      status: 500,
    })
  }

  const hasEditAccess = hasEditAccessResult.data
  if (!hasEditAccess) {
    return NextResponse.json('User does not have edit access to watchlist', { status: 403 })
  }

  if (requestedUserRoleResult.error) {
    if (requestedUserRoleResult.status === 406) {
      return NextResponse.json('Requested user is not a collaborator', { status: 404 })
    }

    console.error(requestedUserRoleResult.error)
    return NextResponse.json('Failed to check if requested user is a collaborator for watchlist', {
      status: 500,
    })
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
    return NextResponse.json('Failed to update watchlist collaborator role for requested user', {
      status: 500,
    })
  }

  return new Response(null, { status: 204 })
}

/**
 * Delete the watchlist collaborator with the given user ID and watchlist ID.
 *
 * Note: Only the owner of the watchlist or the collaborator themselves can delete the collaborator.
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const paramsResult = watchlistCollaboratorParamSchema.safeParse(params)

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
  const [watchlistExistsResult, roleExistsResult] = await Promise.all([
    getWatchlistById(supabase, watchlistId),
    getWatchlistRoleForUser(supabase, { watchlistId, userId: user.id }),
  ])

  // Verify the watchlist exists
  if (!!watchlistExistsResult.error || !watchlistExistsResult.data) {
    if (watchlistExistsResult.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    console.error(watchlistExistsResult)
    return NextResponse.json('Failed to fetch watchlist', { status: watchlistExistsResult.status })
  }

  // Verify logged in user is a collaborator
  if (!!roleExistsResult.error || !roleExistsResult.data) {
    if (roleExistsResult.status === 406) {
      return NextResponse.json('User is not a collaborator', { status: 403 })
    }

    return NextResponse.json('Failed to fetch collaborator role', {
      status: roleExistsResult.status,
    })
  }

  // Verify the user has permission to delete the collaborator
  if (user.id !== userToDeleteId && roleExistsResult.data.role !== 'owner') {
    return NextResponse.json('User is not permitted to delete collaborator', { status: 403 })
  }

  // Delete the collaborator
  const deleteCollaboratorQueryResult = await supabase
    .from('watchlists_users')
    .delete({ count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .eq('user_id', userToDeleteId)

  if (deleteCollaboratorQueryResult.error) {
    return NextResponse.json(deleteCollaboratorQueryResult.error, {
      status: deleteCollaboratorQueryResult.status,
    })
  }

  if (!deleteCollaboratorQueryResult.count) {
    return NextResponse.json('Collaborator not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

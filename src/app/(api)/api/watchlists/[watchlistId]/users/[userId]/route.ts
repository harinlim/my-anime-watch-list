import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { getWatchlistById, getWatchlistRoleForUser } from '../queries'

import { watchlistCollaboratorParamSchema } from './schemas'

import type { NextRequest } from 'next/server'

type RouteParams = { params: { userId: string; watchlistId: string } }

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
  const [watchlistQueryResult, roleQueryResult] = await Promise.all([
    getWatchlistById(supabase, watchlistId),
    getWatchlistRoleForUser(supabase, { watchlistId, userId: user.id }),
  ])

  // Verify the watchlist exists
  if (!!watchlistQueryResult.error || watchlistQueryResult.count === 0) {
    if (watchlistQueryResult.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    console.error(watchlistQueryResult)
    return NextResponse.json('Failed to fetch watchlist', { status: watchlistQueryResult.status })
  }

  // Verify logged in user is a collaborator
  if (!!roleQueryResult.error || roleQueryResult.count === 0) {
    if (roleQueryResult.status === 406) {
      return NextResponse.json('User is not a collaborator', { status: 403 })
    }

    return NextResponse.json('Failed to fetch collaborator role', {
      status: roleQueryResult.status,
    })
  }

  // Verify the user has permission to delete the collaborator
  if (user.id !== userToDeleteId && roleQueryResult.data.role !== 'owner') {
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

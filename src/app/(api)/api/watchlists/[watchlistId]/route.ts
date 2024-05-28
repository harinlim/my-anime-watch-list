import { NextResponse } from 'next/server'

import { getUserFromSession } from '@/db/users'
import { getWatchlistById, getWatchlistExistsById } from '@/db/watchlists'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { watchlistRequestBodySchema } from '../schemas'

import type { Watchlist } from '@/types/watchlists'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string } }

/**
 * Get a watchlist by ID
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()

  // Note authorization checks will be done via RLS, though it will be returning a 404
  const watchlistResult = await getWatchlistById(supabase, watchlistId)

  if (watchlistResult.error) {
    console.error(watchlistResult)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistResult.count === 0 || !watchlistResult.data) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  return NextResponse.json<Watchlist>(watchlistResult.data)
}

/**
 * Update a watchlist with the given ID
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
  const body = await safeParseRequestBody(request, watchlistRequestBodySchema)
  if (!body.success) {
    if (body.error) {
      return NextResponse.json(transformZodValidationErrorToResponse(body.error), { status: 422 })
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  const { title, description, isPublic } = body.data

  // Get validation queries
  const [watchlistExistsResult, hasEditAccessResult] = await Promise.all([
    getWatchlistExistsById(supabase, watchlistId),
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

  // Verify the user has edit access to the watchlist
  if (hasEditAccessResult.error) {
    console.error(hasEditAccessResult.error)
    return NextResponse.json('Failed to verify user access to watchlist', { status: 500 })
  }

  const hasEditAccess = hasEditAccessResult.data
  if (!hasEditAccess) {
    return NextResponse.json('User does not have edit access to watchlist', { status: 403 })
  }

  // Update the watchlist
  const { error } = await supabase
    .from('watchlists')
    .update({ title, description, is_public: isPublic })
    .eq('id', watchlistId)
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to update watchlist', { status: 500 })
  }

  return new Response(null, { status: 204 })
}

/**
 * Delete the watchlist with the given ID
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()

  const { data: user } = await getUserFromSession(supabase)
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

  // Verify the watchlist belonging to the user exists
  if (watchlistExistsResult.error) {
    console.error(watchlistExistsResult.error)
    return NextResponse.json('Failed to fetch watchlist', { status: 500 })
  }

  if (watchlistExistsResult.count === 0) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  if (hasOwnerAccessResult.error) {
    console.error(hasOwnerAccessResult.error)
    return NextResponse.json('Failed to verify user access to watchlist', { status: 500 })
  }

  const hasOwnerAccess = hasOwnerAccessResult.data
  if (!hasOwnerAccess) {
    return NextResponse.json('Watchlist does not belong to the user', { status: 403 })
  }

  // Delete the watchlist
  const { error, status, count } = await supabase
    .from('watchlists')
    .delete({ count: 'exact' })
    .eq('id', watchlistId)

  if (error) {
    console.error(error)
    return NextResponse.json(error, { status })
  }

  if (!count) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

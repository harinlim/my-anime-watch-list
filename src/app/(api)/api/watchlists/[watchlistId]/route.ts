import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'
import { parseRequestBody } from '@/lib/zod/api'

import { watchlistAnimeRequestBodySchema } from './schemas'

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
  const { data, error, status } = await supabase
    .from('watchlists')
    .select('id, user_id, title, is_public, description, created_at, updated_at, anime(*)')
    .eq('id', watchlistId)
    .returns<Watchlist>()
    .single()

  if (!!error || !data) {
    if (status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status })
  }

  return NextResponse.json<Watchlist>(data)
}

/**
 * Add an anime to an existing watchlist.
 * Body:
 *  - animeId: string | number
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)
  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const body = await parseRequestBody(request, watchlistAnimeRequestBodySchema)
  if (body === null) {
    return NextResponse.json('Failed to parse request body', { status: 400 })
  }

  const animeId = `${body.animeId}`

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Get validation queries
  const [watchlistExistsResult, animeExistsResult] = await Promise.all([
    supabase.from('watchlists').select('id').eq('id', watchlistId).single(),
    supabase
      .from('anime')
      .select('kitsu_id', { head: true, count: 'exact' })
      .eq('kitsu_id', animeId)
      .single(),
  ])

  // Verify the watchlist belonging to the user exists
  if (!!watchlistExistsResult.error || !watchlistExistsResult.data) {
    if (watchlistExistsResult.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status: watchlistExistsResult.status })
  }

  // Verify anime exists in DB
  if (!!animeExistsResult.error || !animeExistsResult.count) {
    if (animeExistsResult.status === 406) {
      return NextResponse.json('Anime not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch anime', { status: animeExistsResult.status })
  }

  // Add anime to watchlist
  // Note anime conflict and permission checks are done via RLS
  const { error, status } = await supabase.from('watchlists_anime').insert({
    watchlist_id: watchlistId,
    anime_id: animeId,
  })

  if (error) {
    switch (status) {
      case 403: {
        return NextResponse.json('User is not allowed to add anime to this watchlist', { status })
      }
      case 409: {
        return NextResponse.json('Anime is already in watchlist', { status })
      }
      default: {
        console.error(error)
        return NextResponse.json('Failed to add anime to watchlist', { status })
      }
    }
  }

  return NextResponse.json({ watchlistId, animeId }, { status: 201 })
}

/**
 * Delete the watchlist with the given ID
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

  // Get validation queries
  const watchlistQuery = await supabase
    .from('watchlists')
    .select('*')
    .eq('id', watchlistId)
    .single()

  // Verify the watchlist belonging to the user exists
  if (!!watchlistQuery.error || !watchlistQuery.data) {
    if (watchlistQuery.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status: watchlistQuery.status })
  }

  const watchlist = watchlistQuery.data

  if (watchlist.user_id !== user.id) {
    return NextResponse.json('Watchlist does not belong to the user', { status: 403 })
  }

  // Delete the watchlist
  const { error, status, count } = await supabase
    .from('watchlists')
    .delete({ count: 'exact' })
    .eq('id', watchlistId)

  if (error) {
    return NextResponse.json(error, { status })
  }

  if (!count) {
    return NextResponse.json('Watchlist not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

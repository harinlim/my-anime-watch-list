import { NextResponse, type NextRequest } from 'next/server'

import { getAnimeExistsById, getAnimeByUserAssociation } from '@/db/anime'
import { getAnimeById } from '@/lib/kitsu/api'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'
import { transformAnimeByUserAssociation } from '@/utils/user-anime'

import { patchAnimeRequestSchema } from './schemas'

import type { GetAnimeByIdResponse } from './types'

type RouteParams = { params: { animeId: string } }

/**
 * Get an anime and associated user review and watchlists by ID
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
  const { animeId } = params

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Validate records exist while getting kitsu
  const [animeExistsResult, userAnimeResult, kitsuResponse] = await Promise.all([
    getAnimeExistsById(supabase, animeId),
    user ? getAnimeByUserAssociation(supabase, { userId: user.id, animeId }).maybeSingle() : null,
    getAnimeById(animeId),
  ])

  if (animeExistsResult.error) {
    console.error(animeExistsResult.error)
    return NextResponse.json('Failed to fetch anime from DB', { status: animeExistsResult.status })
  }

  if (userAnimeResult?.error) {
    console.error(userAnimeResult.error)
    return NextResponse.json('Failed to fetch associated user-anime data from DB', {
      status: userAnimeResult.status,
    })
  }

  if (!kitsuResponse.ok) {
    console.error(kitsuResponse)
    return NextResponse.json(kitsuResponse.message, { status: kitsuResponse.status })
  }

  const kitsuData = kitsuResponse.data

  // For now, keep this commented until we start using pictures
  if (animeExistsResult.count === 0) {
    // Add new anime record to our DB for watchlist search
    const { error } = await supabase.from('anime').upsert({
      kitsu_id: animeId,
      title: kitsuData.canonicalTitle,
      synopsis: kitsuData.synopsis,
      poster_image: kitsuData.posterImage,
    })

    // We can silently ignore errors here assuming the rest succeeded
    if (error) {
      console.error(error)
    }
  }

  const { review, watchlists } = userAnimeResult?.data
    ? transformAnimeByUserAssociation(userAnimeResult.data)
    : ({ review: null, watchlists: null } as const)

  return NextResponse.json<GetAnimeByIdResponse>({
    ...kitsuData,
    review,
    watchlists,
  })
}

/**
 * Upsert a user review for an anime.
 * Body:
 * - status: string
 * - rating: number
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { animeId } = params

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  const body = await safeParseRequestBody(request, patchAnimeRequestSchema)
  if (!body.success) {
    if (body.error) {
      return NextResponse.json(transformZodValidationErrorToResponse(body.error), { status: 422 })
    }
    return NextResponse.json(body.message, { status: 400 })
  }

  // Verify associated anime record exists in our DB before proceeding (otherwise, page must be viewed first)
  const animeExistsResult = await getAnimeExistsById(supabase, animeId)
  if (animeExistsResult.error) {
    console.error(animeExistsResult.error)
    return NextResponse.json('Failed to fetch anime from DB', { status: animeExistsResult.status })
  }

  if (animeExistsResult.count === 0) {
    return NextResponse.json('Anime not found', { status: 404 })
  }

  const { error } = await supabase.from('user_reviews').upsert({
    user_id: user.id,
    anime_id: animeId,
    ...body.data,
  })

  if (error) {
    console.error(error)
    return NextResponse.json('Failed to update user review', { status: 500 })
  }

  return new Response(null, { status: 204 })
}

/**
 * Delete a user review for an anime.
 */
export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const { animeId } = params

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json('Failed authorization', { status: 401 })
  }

  // Verify associated anime record exists in our DB before proceeding (otherwise, page must be viewed first)
  const animeExistsResult = await getAnimeExistsById(supabase, animeId)
  if (animeExistsResult.error) {
    console.error(animeExistsResult.error)
    return NextResponse.json('Failed to fetch anime from DB', { status: animeExistsResult.status })
  }

  if (animeExistsResult.count === 0) {
    return NextResponse.json('Anime not found', { status: 404 })
  }

  const deleteQuery = await supabase
    .from('user_reviews')
    .delete({ count: 'exact' })
    .eq('user_id', user.id)
    .eq('anime_id', animeId)

  if (deleteQuery.error) {
    console.error(deleteQuery.error)
    return NextResponse.json(deleteQuery.error, { status: deleteQuery.status })
  }

  if (!deleteQuery.count) {
    return NextResponse.json('Anime review not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

import { NextResponse, type NextRequest } from 'next/server'

import { getAnimeById } from '@/lib/kitsu/api'
import { createServerClient } from '@/lib/supabase/server'
import { safeParseRequestBody } from '@/lib/zod/api'
import { transformZodValidationErrorToResponse } from '@/lib/zod/validation'

import { patchAnimeRequestSchema } from './schemas'

import type { GetAnimeByIdResponse } from './types'

type RouteParams = { params: { animeId: string } }

/**
 * Get an anime by ID
 */
export async function GET(_: NextRequest, { params }: RouteParams) {
  const { animeId } = params

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [animeRecord, reviewRecord, watchlistRecord, kitsuResponse] = await Promise.all([
    supabase.from('anime').select('*').eq('kitsu_id', animeId).maybeSingle(),
    user
      ? supabase
          .from('user_reviews')
          .select('*')
          .eq('anime_id', animeId)
          .eq('user_id', user.id)
          .maybeSingle()
      : null,
    user
      ? supabase
          .from('watchlists_anime')
          .select(`watchlists!inner(*)`)
          .eq('anime_id', animeId)
          .eq('watchlists.user_id', user.id)
      : null,
    getAnimeById(animeId),
  ])

  if (!!animeRecord.error || !!reviewRecord?.error || !!watchlistRecord?.error) {
    console.error(animeRecord.error, reviewRecord?.error, watchlistRecord?.error)
    return NextResponse.json('Failed to fetch anime from DB', { status: animeRecord.status })
  }

  if (!kitsuResponse.ok) {
    return NextResponse.json(kitsuResponse.message, { status: kitsuResponse.status })
  }

  const { data: kitsuData } = kitsuResponse

  // For now, keep this commented until we start using pictures
  // if (!animeRecord.data) {
  // Add new anime record to our DB for watchlist search
  const { error } = await supabase.from('anime').upsert({
    kitsu_id: animeId,
    title: kitsuData.canonicalTitle,
    synopsis: kitsuData.synopsis,
    poster_image: kitsuData.posterImage,
  })

  if (error) {
    console.error(error)
    // We can silently ignore errors here assuming the rest succeeded
  }
  // }

  return NextResponse.json<GetAnimeByIdResponse>({
    ...kitsuData,
    review: reviewRecord?.data
      ? {
          status: reviewRecord.data.status,
          rating: reviewRecord.data.rating,
        }
      : null,
    watchlists: watchlistRecord?.data?.flatMap(list => list.watchlists) ?? null,
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

  const deleteQuery = await supabase
    .from('user_reviews')
    .delete({ count: 'exact' })
    .eq('user_id', user.id)
    .eq('anime_id', animeId)

  if (deleteQuery.error) {
    return NextResponse.json(deleteQuery.error, { status: deleteQuery.status })
  }

  if (!deleteQuery.count) {
    return NextResponse.json('Anime review not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}

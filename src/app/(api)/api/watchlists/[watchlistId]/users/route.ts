import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import { getWatchlistById, getWatchlistCollaborators } from './queries'

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
  const [collaboratorsQueryResult, watchlistQueryResult] = await Promise.all([
    getWatchlistCollaborators(supabase, watchlistId),
    getWatchlistById(supabase, watchlistId),
  ])

  if (!!watchlistQueryResult.error || watchlistQueryResult.count === 0) {
    if (watchlistQueryResult.status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    console.error(watchlistQueryResult)
    return NextResponse.json('Failed to fetch watchlist', { status: watchlistQueryResult.status })
  }

  if (!!collaboratorsQueryResult.error || !collaboratorsQueryResult.data) {
    return NextResponse.json('Failed to fetch watchlist users', {
      status: collaboratorsQueryResult.status,
    })
  }

  return NextResponse.json<GetWatchlistCollaboratorsResponse>(collaboratorsQueryResult.data)
}

import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

import type { Watchlist } from '@/types/watchlists'
import type { NextRequest } from 'next/server'

type RouteParams = { params: { watchlistId: string } }

export async function GET(_: NextRequest, { params }: RouteParams) {
  const watchlistId = Number(params.watchlistId)

  if (Number.isNaN(watchlistId) || watchlistId <= 0) {
    return NextResponse.json('Invalid watchlist ID', { status: 400 })
  }

  const supabase = createServerClient()
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error, status } = await supabase
    .from('watchlists')
    .select('*, anime(*)')
    .eq('id', watchlistId)
    .single()

  if (!!error || !data) {
    if (status === 406) {
      return NextResponse.json('Watchlist not found', { status: 404 })
    }

    return NextResponse.json('Failed to fetch watchlist', { status })
  }

  if (!data.is_public && (!user || user.id !== data.user_id)) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  return NextResponse.json<Watchlist>(data)
}

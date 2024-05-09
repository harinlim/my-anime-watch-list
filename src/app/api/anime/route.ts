import { NextResponse, type NextRequest } from 'next/server'

import { searchAnime } from '@/lib/kitsu/api'
import { createServerClient } from '@/lib/supabase/server'

import type { SearchAnimeQueryParams, SearchAnimeResponse } from './types'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  console.log(searchParams)

  const sort = searchParams.get('sort')
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')

  const supabase = createServerClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log(user)

  const searchResults = await searchAnime({ sort, page, limit } as SearchAnimeQueryParams)

  return NextResponse.json<SearchAnimeResponse>(searchResults, { status: searchResults.status })
}

import { NextResponse, type NextRequest } from 'next/server'

import { searchAnime } from '@/lib/kitsu/api'

import type { SearchAnimeQueryParams, SearchAnimeResponse } from './types'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const sort = searchParams.get('sort')
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const filter = searchParams.get('filter')

  const searchResults = await searchAnime({ sort, page, limit, filter } as SearchAnimeQueryParams)

  return NextResponse.json<SearchAnimeResponse>(searchResults, { status: searchResults.status })
}

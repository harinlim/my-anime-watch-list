import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { GET_ANIME_BY_ID_RESPONSE_MOCK } from '@/app/api/anime/[animeId]/mock'
import { fetchWithType, withBaseURL } from '@/lib/api'

import type { GetAnimeByIdResponse } from '@/api/anime/[animeId]/types'

export default async function AnimePage({ params }: { params: { animeId: string } }) {
  const { animeId } = params

  const animeResponse = await fetchWithType<GetAnimeByIdResponse>(
    withBaseURL(`/api/anime/${animeId}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: headers(),
    }
  )

  // Show not found for client errors
  if (animeResponse.status >= 400 && animeResponse.status < 500) {
    return notFound()
  }

  // Show 500 for all other errors
  if (!animeResponse.ok) {
    throw new Error('Failed to fetch anime')
  }

  // const data = animeResponse.data
  const data = GET_ANIME_BY_ID_RESPONSE_MOCK

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <h1>Anime</h1>
      <div>
        <pre className="items-left text-pretty">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

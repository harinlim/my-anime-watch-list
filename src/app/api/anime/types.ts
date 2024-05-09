import type { searchAnime } from '@/lib/kitsu/api'

export type SearchAnimeResponse = Awaited<ReturnType<typeof searchAnime>>

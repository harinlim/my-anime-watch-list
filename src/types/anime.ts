import type { transformAnimeByUserAssociation } from '@/utils/user-anime'
import type { transformAnimeByWatchlist } from '@/utils/watchlist-anime'

export type AnimeByUser = ReturnType<typeof transformAnimeByUserAssociation>[number]

export type AnimeByWatchlist = ReturnType<typeof transformAnimeByWatchlist>[number]

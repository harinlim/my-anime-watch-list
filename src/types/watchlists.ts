import type { ImageMetadata } from '@/lib/kitsu/types'
import type { Database } from '@/types/generated/supabase'

export type Watchlist = Database['public']['Tables']['watchlists']['Row'] & {
  anime: WatchlistAnime[]
}

export type WatchlistAnime = Database['public']['Tables']['anime']['Row'] & {
  poster_image: ImageMetadata
}

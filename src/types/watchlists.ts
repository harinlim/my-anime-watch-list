import type { ImageMetadata } from '@/lib/kitsu/types'
import type { Database } from '@/types/generated/supabase'
import type { ExpandDeep, ExpandTwo } from '@/types/utils'

export type Watchlist = ExpandTwo<
  Omit<Database['public']['Tables']['watchlists']['Row'], 'search_vector'> & {
    anime: WatchlistAnime[]
  }
>

export type WatchlistAnime = Omit<Database['public']['Tables']['anime']['Row'], 'poster_image'> & {
  poster_image: ImageMetadata
}

export type WatchlistCollaborators = Database['public']['Tables']['watchlists_users']['Row'] & {
  username: Database['public']['Tables']['users']['Row']['username']
  avatar_url: Database['public']['Tables']['users']['Row']['avatar_url']
}

/** Simplified overview type for watchlists including anime and collaborators */
export type WatchlistOverview = ExpandDeep<
  Omit<Watchlist, 'anime'> & {
    anime: Pick<WatchlistAnime, 'title' | 'kitsu_id' | 'poster_image'>[]
    watchlists_users: Pick<WatchlistCollaborators, 'role' | 'user_id' | 'username' | 'avatar_url'>[]
  }
>

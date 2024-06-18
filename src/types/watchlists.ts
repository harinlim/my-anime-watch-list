import type { ImageMetadata } from '@/lib/kitsu/types'
import type { Database } from '@/types/generated/supabase'
import type { Expand, ExpandDeep } from '@/types/utils'

export type Watchlist = Omit<Database['public']['Tables']['watchlists']['Row'], 'search_vector'>

/** Simplified view of anime in watchlist (not kitsu) */
export type WatchlistAnime = Omit<Database['public']['Tables']['anime']['Row'], 'poster_image'> & {
  poster_image: ImageMetadata
}

export type WatchlistUser = Expand<
  Pick<Database['public']['Tables']['watchlists_users']['Row'], 'user_id' | 'role'> &
    Pick<Database['public']['Tables']['users']['Row'], 'username' | 'avatar_url'>
>

export type CollaboratorRole = Database['public']['Enums']['collaborator_access']

/** Simplified overview type for watchlists including anime and collaborators */
export type WatchlistOverview = ExpandDeep<
  Omit<Watchlist, 'anime'> & {
    anime: Pick<WatchlistAnime, 'title' | 'kitsu_id' | 'poster_image'>[]
    watchlists_users: Pick<WatchlistUser, 'role' | 'user_id' | 'username' | 'avatar_url'>[]
  }
>

export type CreateWatchlistResponse = Pick<
  Database['public']['Tables']['watchlists']['Row'],
  'title' | 'description'
> & { userId: Database['public']['Tables']['watchlists']['Row']['user_id'] } & {
  isPublic: Database['public']['Tables']['watchlists']['Row']['is_public']
} & { watchlistId: Database['public']['Tables']['watchlists']['Row']['id'] }

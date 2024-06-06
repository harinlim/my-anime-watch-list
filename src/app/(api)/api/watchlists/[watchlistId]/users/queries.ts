import type { Database } from '@/types/generated/supabase'
import type { Equal, Expect } from '@/types/utils'
import type { WatchlistUser } from '@/types/watchlists'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getWatchlistCollaborators(supabase: SupabaseClient<Database>, watchlistId: number) {
  // Note authorization checks will be done via RLS, though it will be returning a 404
  // RLS on watchlists_users will ensure that only collaborators to private watchlists OR
  // public watchlists will be returned

  // RLS allows reads on rows where user has access to watchlist, or if the watchlist is public.
  // If the user is a non-contributor, disallow reads on viewer rows.
  // When read as a viewer, should not be able to see other viewers but themself.
  return supabase
    .from('watchlists_users')
    .select('user_id, role, ...users(username, avatar_url)', { count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .order('role') // sort on enum as follows: owner, editor, viewer
    .order('users(username)')
}

type _TestGetWatchlistCollaboratsReturn = Expect<
  Equal<NonNullable<Awaited<ReturnType<typeof getWatchlistCollaborators>>['data']>, WatchlistUser[]>
>

export function getWatchlistRoleForUser(
  supabase: SupabaseClient<Database>,
  { watchlistId, userId }: { watchlistId: number; userId: string }
) {
  return supabase
    .from('watchlists_users')
    .select('role', { count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .eq('user_id', userId)
    .maybeSingle()
}

export function getUsersByIds(supabase: SupabaseClient<Database>, userIds: string[]) {
  return supabase.from('users').select('id', { count: 'exact' }).in('id', userIds)
}

export function getCollaboratorsByUserIds(
  supabase: SupabaseClient<Database>,
  { watchlistId, userIds }: { watchlistId: number; userIds: string[] }
) {
  return supabase
    .from('watchlists_users')
    .select('user_id, role', { count: 'exact' })
    .eq('watchlist_id', watchlistId)
    .in('user_id', userIds)
}

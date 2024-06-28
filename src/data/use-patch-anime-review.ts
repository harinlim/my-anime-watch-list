import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type { HttpError } from '@/lib/api'
import type { WatchStatus } from '@/types/enums'

export function useUpdateAnimeStatus(animeId: string) {
  const queryClient = useQueryClient()
  const user = useCurrentUser()

  return useMutation<unknown, HttpError, WatchStatus>({
    mutationFn: async (status: WatchStatus) =>
      fetchWithError(
        `/api/anime/${animeId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: JSON.stringify({ status }),
        },
        {
          skipResult: true, // Returns a 204 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to update anime status`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    // TODO: expand on error handling here
    onError: (error, variables) => console.error(error.message, variables),

    // Naive way to invalidate all potential watchlists affected
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['watchlists', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['anime', user?.id, user?.username] }),
      ]),
  })
}

export function useUpdateAnimeRating(animeId: string) {
  const queryClient = useQueryClient()
  const user = useCurrentUser()

  return useMutation<unknown, HttpError, number>({
    mutationFn: async (rating: number) =>
      fetchWithError(
        `/api/anime/${animeId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: JSON.stringify({ rating }),
        },
        {
          skipResult: true, // Returns a 204 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to update anime rating`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    // TODO: expand on error handling here
    onError: (error, variables) => console.error(error.message, variables),

    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    // TODO: use query client and separate query for user-specific anime reviews
    onSuccess: async () =>
      Promise.all([
        // Naive way to invalidate all potential watchlists affected
        queryClient.invalidateQueries({ queryKey: ['watchlists', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['anime', user?.id, animeId] }),
        queryClient.invalidateQueries({ queryKey: ['anime', user?.id, user?.username] }),
      ]),
  })
}

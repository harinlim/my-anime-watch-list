import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

export function useRemoveWatchlistAnime() {
  const queryClient = useQueryClient()

  const userId = useCurrentUser()?.id

  return useMutation({
    mutationFn: async ({ watchlistId, animeId }: { watchlistId: number; animeId: string }) =>
      fetchWithError(
        `/api/watchlists/${watchlistId}/anime/${animeId}`,
        { method: 'DELETE', credentials: 'include' },
        {
          skipResult: true, // Returns a 204 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to remove anime from watchlist`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    // TODO: expand on error handling here
    onError: (error, variables) => console.error(error.message, variables),

    // TODO: use query client and separate query for user-specific anime reviews
    onSuccess: async (_, { watchlistId, animeId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['watchlists', userId, watchlistId] }),
        queryClient.invalidateQueries({ queryKey: ['anime', userId, animeId] }),
      ]),
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type { HttpError } from '@/lib/api'

export function useDeleteWatchlist(watchlistId: number) {
  const queryClient = useQueryClient()

  const user = useCurrentUser()

  return useMutation<unknown, HttpError>({
    mutationFn: async () =>
      fetchWithError(
        `/api/watchlists/${watchlistId}`,
        { method: 'DELETE', credentials: 'include' },
        {
          skipResult: true, // Returns a 204 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to delete watchlist`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    onError: (error: HttpError, variables) => console.error(error.message, variables),

    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['watchlists', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['anime', user?.id, user?.username] }),
      ]),
  })
}

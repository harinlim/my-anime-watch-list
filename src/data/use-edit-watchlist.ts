import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type { WatchlistRequestBody } from '@/api/watchlists/types'
import type { HttpError } from '@/lib/api'

export function useEditWatchlist(watchlistId: number) {
  const queryClient = useQueryClient()
  const user = useCurrentUser()

  return useMutation<unknown, HttpError, WatchlistRequestBody>({
    mutationFn: async (body: WatchlistRequestBody) =>
      fetchWithError(
        `/api/watchlists/${watchlistId}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify(body),
        },
        {
          skipResult: true, // Returns a 201 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to create watchlist`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    // TODO: expand on error handling here
    onError: (error, variables) => console.error(error.message, variables),

    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['watchlists', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['anime', user?.id, user?.username] }),
      ]),
  })
}

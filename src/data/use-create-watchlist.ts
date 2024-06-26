import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type { WatchlistRequestBody, CreateWatchlistResponse } from '@/api/watchlists/types'
import type { HttpError } from '@/lib/api'

export function useCreateWatchlist() {
  const queryClient = useQueryClient()
  const userId = useCurrentUser()?.id

  return useMutation<CreateWatchlistResponse, HttpError, WatchlistRequestBody>({
    mutationFn: async (body: WatchlistRequestBody) =>
      fetchWithError<false, CreateWatchlistResponse>(
        `/api/watchlists`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(body),
        },
        {
          skipResult: false, // Returns a 201 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to create watchlist`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    // TODO: expand on error handling here
    onError: (error: HttpError, variables) => console.error(error.message, variables),

    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['watchlists', userId] }),
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

export function useDeleteWatchlistCollaborator({ watchlistId }: { watchlistId: number }) {
  const queryClient = useQueryClient()

  const userId = useCurrentUser()?.id

  return useMutation({
    mutationFn: async ({ collaboratorId }: { collaboratorId: string; username: string }) =>
      fetchWithError(
        `/api/watchlists/${watchlistId}/users/${collaboratorId}`,
        { method: 'DELETE', credentials: 'include' },
        {
          skipResult: true, // Returns a 204 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to delete collaborator`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      ),

    // TODO: expand on error handling here
    onError: (error, variables) => console.error(error.message, variables),

    onSuccess: async (_, { collaboratorId, username }) => {
      if (collaboratorId === userId) {
        // Invalidate the watchlist query if the current user is removed
        return queryClient.invalidateQueries({
          queryKey: ['watchlists', userId],
        })
      }
      return queryClient.invalidateQueries({ queryKey: ['watchlists', userId, username] })
    },

    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['collaborators', { watchlistId, userId }] }),
        queryClient.invalidateQueries({ queryKey: ['users', userId] }),
      ]),
  })
}

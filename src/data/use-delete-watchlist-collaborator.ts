import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useUser } from '@/context/UserContext'

export function useDeleteWatchlistCollaborator({ watchlistId }: { watchlistId: number }) {
  const queryClient = useQueryClient()

  const userId = useUser()?.id

  return useMutation({
    mutationFn: async (collaboratorId: string) =>
      fetch(`/api/watchlists/${watchlistId}/users/${collaboratorId}`, {
        method: 'DELETE',
      }),
    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () =>
      queryClient.invalidateQueries({
        queryKey: ['collaborators', { watchlistId, userId }],
      }),
  })
}

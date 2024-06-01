import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type { PublicUser } from '@/types/users'
import type { CollaboratorRole } from '@/types/watchlists'

export function useAddWatchlistCollaborator({ watchlistId }: { watchlistId: number }) {
  const queryClient = useQueryClient()
  const userId = useCurrentUser()?.id

  return useMutation({
    mutationFn: async ({ users, role }: { users: PublicUser[]; role: CollaboratorRole }) => {
      const usersToAdd = users.map(({ id }) => ({ userId: id, role }))
      return fetchWithError(
        `/api/watchlists/${watchlistId}/users`,
        { method: 'POST', credentials: 'include', body: JSON.stringify(usersToAdd) },
        {
          skipResult: true, // Returns a 201 on success
          prefix: response =>
            `(${response.status} ${response.statusText}) Failed to add collaborator`,
          toMessage: response => response.clone().json() as unknown as string,
        }
      )
    },

    // TODO: expand on error handling here
    onError: (error, variables) => console.error(error.message, variables),

    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    // onSettled: () => [
    //   queryClient.invalidateQueries({
    //     queryKey: ['users', { watchlistId }],
    //   }),
    //   queryClient.invalidateQueries({
    //     queryKey: ['collaborators', { watchlistId, userId }],
    //   }),
    // ],
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['collaborators', { watchlistId, userId }],
      })
    },
  })
}

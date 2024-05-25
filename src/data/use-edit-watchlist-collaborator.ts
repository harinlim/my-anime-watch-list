import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'

import type { Role } from '@/types/collaborators'

export function useEditWatchlistCollaborator({ watchlistId }: { watchlistId: number }) {
  const queryClient = useQueryClient()

  const userId = useCurrentUser()?.id

  return useMutation({
    mutationFn: async ({ collaboratorId, role }: { collaboratorId: string; role: Role }) =>
      fetch(`/api/watchlists/${watchlistId}/users/${collaboratorId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    onSettled: async () =>
      queryClient.invalidateQueries({
        queryKey: ['collaborators', { watchlistId, userId }],
      }),
  })
}

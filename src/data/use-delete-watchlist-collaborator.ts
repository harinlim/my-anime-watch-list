'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useCurrentUser } from '@/context/UserContext'

type mutateDeleteParams = {
  collaboratorId: string
  isPublicWatchlist: boolean
}

export function useDeleteWatchlistCollaborator({ watchlistId }: { watchlistId: number }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const userId = useCurrentUser()?.id

  return useMutation({
    mutationFn: async ({ collaboratorId, isPublicWatchlist }: mutateDeleteParams) => {
      await fetch(`/api/watchlists/${watchlistId}/users/${collaboratorId}`, {
        method: 'DELETE',
      })

      return { collaboratorId, isPublicWatchlist }
    },

    // return { collaboratorId, isPublicWatchlist }
    onSuccess: ({ collaboratorId, isPublicWatchlist }: mutateDeleteParams) => {
      if (collaboratorId === userId && !isPublicWatchlist) {
        router.replace('/watchlists')
      }
    },
    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () =>
      queryClient.invalidateQueries({
        queryKey: ['collaborators', { watchlistId, userId }],
      }),
  })
}

import type { GetWatchlistCollaboratorsResponse } from './types'

export const GET_WATCHLIST_COLLABORATORS_MOCK = [
  {
    user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
    role: 'owner',
    username: 'harin50',
    avatar_url: null,
  },
  {
    user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
    role: 'editor',
    username: 'harins',
    avatar_url: null,
  },
] satisfies GetWatchlistCollaboratorsResponse

import type { WatchlistOverview } from '@/types/watchlists'

export const GET_WATCHLISTS_RESPONSE_MOCK = [
  {
    id: 3,
    user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
    title: "harin05's watchlist",
    is_public: true,
    description: 'hello',
    created_at: '2024-05-09T17:24:39.835502+00:00',
    updated_at: '2024-05-09T17:24:39.835502+00:00',
    anime: [],
    watchlists_users: [
      {
        role: 'editor',
        user_id: '5dbda134-4821-41a7-b05f-0ad17e985ebc',
        username: 'harinharinharin',
        avatar_url: null,
      },
      {
        role: 'owner',
        user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
        username: 'harin05',
        avatar_url: null,
      },
    ],
  },
] satisfies WatchlistOverview[]

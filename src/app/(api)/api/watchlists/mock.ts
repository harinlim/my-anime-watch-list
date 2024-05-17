import type { WatchlistOverview } from '@/types/watchlists'

export const QUERY_WATCHLIST_OVERVIEWS_MOCK = {
  error: null,
  data: [
    {
      id: 1,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'my anime list 1',
      is_public: true,
      description: 's',
      created_at: '2024-05-09T17:20:08.533816+00:00',
      updated_at: '2024-05-09T17:20:08.533816+00:00',
      anime: [
        {
          title: 'Kimetsu no Yaiba',
          kitsu_id: '41370',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/41370/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/41370/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/41370/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/41370/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/41370/original.jpg',
          },
        },
        {
          title: 'Attack on Titan',
          kitsu_id: '7442',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/7442/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/7442/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/7442/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/7442/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/7442/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: null,
        },
      ],
    },
    {
      id: 2,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'private watchlist',
      is_public: false,
      description: 's',
      created_at: '2024-05-09T17:24:06.874383+00:00',
      updated_at: '2024-05-09T17:24:06.874383+00:00',
      anime: [
        {
          title: 'Attack on Titan',
          kitsu_id: '7442',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/7442/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/7442/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/7442/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/7442/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/7442/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'viewer',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: null,
        },
      ],
    },
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
    {
      id: 6,
      user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
      title: "harin05's private watchlist",
      is_public: false,
      description: null,
      created_at: '2024-05-10T14:43:02.549767+00:00',
      updated_at: '2024-05-10T14:43:02.549767+00:00',
      anime: [
        {
          title: 'Cowboy Bebop',
          kitsu_id: '1',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/1/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/1/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/1/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/1/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/1/original.jpg',
          },
        },
        {
          title: 'Attack on Titan',
          kitsu_id: '7442',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/7442/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/7442/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/7442/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/7442/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/7442/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'owner',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: null,
        },
      ],
    },
    {
      id: 7,
      user_id: 'f08af685-f056-4446-810f-0bff4ef694fc',
      title: "harin52's public watchlsit",
      is_public: false,
      description: null,
      created_at: '2024-05-10T14:43:49.313716+00:00',
      updated_at: '2024-05-10T14:43:49.313716+00:00',
      anime: [],
      watchlists_users: [
        {
          role: 'viewer',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'owner',
          user_id: 'f08af685-f056-4446-810f-0bff4ef694fc',
          username: 'harin52',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: null,
        },
      ],
    },
    {
      id: 8,
      user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
      title: 'new watchlist',
      is_public: false,
      description: null,
      created_at: '2024-05-14T07:18:08.579901+00:00',
      updated_at: '2024-05-14T07:45:46.236739+00:00',
      anime: [
        {
          title: 'One Piece',
          kitsu_id: '12',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/12/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/12/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/12/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/12/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/12/original.png',
          },
        },
        {
          title: 'Tensei shitara Slime Datta Ken 2',
          kitsu_id: '42196',
          poster_image: {
            meta: {
              dimensions: {
                tiny: {
                  width: 110,
                  height: 156,
                },
                large: {
                  width: 550,
                  height: 780,
                },
                small: {
                  width: 284,
                  height: 402,
                },
                medium: {
                  width: 390,
                  height: 554,
                },
              },
            },
            tiny: 'https://media.kitsu.io/anime/poster_images/42196/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/42196/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/42196/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/42196/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/42196/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '794d13f4-fd64-4666-99f0-0981923764e3',
          username: 'animed',
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
    {
      id: 9,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'harin50 testing delete collaborators',
      is_public: true,
      description: null,
      created_at: '2024-05-16T22:47:32.891496+00:00',
      updated_at: '2024-05-16T22:47:32.891496+00:00',
      anime: [],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: null,
        },
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
      ],
    },
  ] satisfies WatchlistOverview[],
  count: 7,
  status: 200,
  statusText: 'OK',
}

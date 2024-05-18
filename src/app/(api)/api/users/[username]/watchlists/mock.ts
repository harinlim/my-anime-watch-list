import type { Watchlist, WatchlistOverview } from '@/types/watchlists'

export const GET_WATCHLISTS_FOR_USER_RESPONSE_MOCK = [
  {
    id: 1,
    user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
    title: 'my anime list 1',
    is_public: true,
    description:
      'Enter magical lands and fantastical universes with this collection of fantasy anime. Dragons, wizards, and mythical creatures await your exploration in these richly imagined worlds. Journey alongside heroes who wield powerful magic, uncover ancient secrets, and battle dark forces. These series are perfect for escaping reality and diving into adventures where anything is possible and the imagination knows no bounds.',
    created_at: '2024-05-09T17:20:08.533816+00:00',
    updated_at: '2024-05-18T08:40:21.830662+00:00',
  },
  {
    id: 2,
    user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
    title: 'private watchlist',
    is_public: false,
    description: 'rah',
    created_at: '2024-05-09T17:24:06.874383+00:00',
    updated_at: '2024-05-18T08:40:10.499108+00:00',
  },
] satisfies Watchlist[]

export const GET_WATCHLIST_OVERVIEWS_RESPONSE_MOCK = [
  {
    id: 8,
    user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
    title: 'new watchlist',
    is_public: false,
    description:
      'Dive into a world of puzzles, secrets, and suspense with these gripping mystery anime. Each series is crafted to keep you on the edge of your seat, weaving intricate plots that unravel slowly, revealing layers of complexity and depth. From detective dramas to supernatural enigmas, prepare to be drawn into stories where every clue matters, and every twist and turn keeps you guessing until the very end.',
    created_at: '2024-05-14T07:18:08.579901+00:00',
    updated_at: '2024-05-18T08:39:38.479708+00:00',
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
    id: 2,
    user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
    title: 'private watchlist',
    is_public: false,
    description: 'rah',
    created_at: '2024-05-09T17:24:06.874383+00:00',
    updated_at: '2024-05-18T08:40:10.499108+00:00',
    anime: [
      {
        title: 'Kimi no Na wa.',
        kitsu_id: '11614',
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
          tiny: 'https://media.kitsu.io/anime/poster_images/11614/tiny.jpg',
          large: 'https://media.kitsu.io/anime/poster_images/11614/large.jpg',
          small: 'https://media.kitsu.io/anime/poster_images/11614/small.jpg',
          medium: 'https://media.kitsu.io/anime/poster_images/11614/medium.jpg',
          original: 'https://media.kitsu.io/anime/poster_images/11614/original.jpg',
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
    ],
  },
  {
    id: 9,
    user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
    title: 'harin50 testing delete collaborators',
    is_public: true,
    description:
      'Get your heart racing with this selection of high-octane action anime. Expect intense battles, powerful heroes, and jaw-dropping fight scenes that will leave you breathless. These series are packed with explosive energy, featuring protagonists who rise to the occasion against formidable foes. If you crave non-stop excitement and epic showdowns, this watchlist is your ultimate source of adrenaline-pumping entertainment.',
    created_at: '2024-05-16T22:47:32.891496+00:00',
    updated_at: '2024-05-18T08:39:50.83461+00:00',
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
  {
    id: 1,
    user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
    title: 'my anime list 1',
    is_public: true,
    description:
      'Enter magical lands and fantastical universes with this collection of fantasy anime. Dragons, wizards, and mythical creatures await your exploration in these richly imagined worlds. Journey alongside heroes who wield powerful magic, uncover ancient secrets, and battle dark forces. These series are perfect for escaping reality and diving into adventures where anything is possible and the imagination knows no bounds.',
    created_at: '2024-05-09T17:20:08.533816+00:00',
    updated_at: '2024-05-18T08:40:21.830662+00:00',
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
] satisfies WatchlistOverview[]

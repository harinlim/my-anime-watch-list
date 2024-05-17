import type { GetAnimeByIdResponse } from './types'

export const GET_ANIME_BY_ID_RESPONSE_MOCK = {
  id: '7442',
  type: 'anime',
  links: {
    self: 'https://kitsu.io/api/edge/anime/7442',
  },
  slug: 'attack-on-titan',
  synopsis:
    "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.\n\nAfter witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls. Based on Hajime Isayama's award-winning manga, Shingeki no Kyojin follows Eren, along with his adopted sister Mikasa Ackerman and his childhood friend Armin Arlert, as they join the brutal war against the titans and race to discover a way of defeating them before the last walls are breached.\n\n(Source: MAL Rewrite)",
  titles: {
    en: 'Attack on Titan',
    en_jp: 'Shingeki no Kyojin',
    en_us: 'Attack on Titan',
    ja_jp: '進撃の巨人',
  },
  canonicalTitle: 'Attack on Titan',
  abbreviatedTitles: ['AoT'],
  averageRating: '84.83',
  userCount: 552_911,
  favoritesCount: 9211,
  startDate: '2013-04-07',
  endDate: '2013-09-29',
  popularityRank: 1,
  ratingRank: 18,
  ageRating: 'R',
  subtype: 'TV',
  status: 'finished',
  posterImage: {
    tiny: 'https://media.kitsu.io/anime/poster_images/7442/tiny.jpg',
    large: 'https://media.kitsu.io/anime/poster_images/7442/large.jpg',
    small: 'https://media.kitsu.io/anime/poster_images/7442/small.jpg',
    medium: 'https://media.kitsu.io/anime/poster_images/7442/medium.jpg',
    original: 'https://media.kitsu.io/anime/poster_images/7442/original.jpg',
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
  },
  coverImage: {
    tiny: 'https://media.kitsu.io/anime/cover_images/7442/tiny.jpg',
    large: 'https://media.kitsu.io/anime/cover_images/7442/large.jpg',
    small: 'https://media.kitsu.io/anime/cover_images/7442/small.jpg',
    original: 'https://media.kitsu.io/anime/cover_images/7442/original.png',
    meta: {
      dimensions: {
        tiny: {
          width: 840,
          height: 200,
        },
        large: {
          width: 3360,
          height: 800,
        },
        small: {
          width: 1680,
          height: 400,
        },
      },
    },
  },
  episodeCount: 25,
  episodeLength: 24,
  youtubeVideoId: 'LHtdKWJdif4',
  nsfw: false,
  categories: [
    'Post Apocalypse',
    'Violence',
    'Action',
    'Adventure',
    'Fantasy',
    'Alternative Past',
    'Angst',
    'Horror',
    'Drama',
    'Military',
    'Super Power',
    'Shounen',
  ],
  review: {
    rating: 2,
    status: 'planned',
    updated_at: '2024-05-09T05:15:46.971755+00:00',
  },
  watchlists: [
    {
      id: 1,
      title: 'my anime list 1',
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      is_public: true,
      role: 'owner',
    },
    {
      id: 2,
      title: 'private watchlist',
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      is_public: false,
      role: 'owner',
    },
    {
      id: 7,
      title: "harin52's public watchlsit",
      user_id: 'f08af685-f056-4446-810f-0bff4ef694fc',
      is_public: true,
      role: 'viewer',
    },
  ],
} satisfies GetAnimeByIdResponse

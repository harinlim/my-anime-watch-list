import type { GetAnimeByUserAssociationResponse } from './types'

export const GET_ANIME_BY_USER_RESPONSE_MOCK = [
  {
    kitsu_id: '12',
    title: 'One Piece',
    synopsis:
      'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.\nEnter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy’s reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.\n[Written by MAL Rewrite]',
    created_at: '2024-05-09T18:18:51.379367+00:00',
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
    review: null,
    watchlists: [
      {
        id: 8,
        title: 'new watchlist',
        user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
        is_public: false,
        role: 'editor',
      },
    ],
  },
  {
    kitsu_id: '41370',
    title: 'Kimetsu no Yaiba',
    synopsis:
      'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a “demon slayer” so that he can turn his sister back into a human, and kill the demon that massacred his family.\n\n(Source: Crunchyroll)',
    created_at: '2024-05-09T05:19:09.181564+00:00',
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
    review: null,
    watchlists: [
      {
        id: 1,
        title: 'my anime list 1',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        is_public: true,
        role: 'owner',
      },
    ],
  },
  {
    kitsu_id: '7442',
    title: 'Attack on Titan',
    synopsis:
      "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.\n\nAfter witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls. Based on Hajime Isayama's award-winning manga, Shingeki no Kyojin follows Eren, along with his adopted sister Mikasa Ackerman and his childhood friend Armin Arlert, as they join the brutal war against the titans and race to discover a way of defeating them before the last walls are breached.\n\n(Source: MAL Rewrite)",
    created_at: '2024-05-08T09:48:13.122013+00:00',
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
  },
  {
    kitsu_id: '1376',
    title: 'Death Note',
    synopsis:
      "A shinigami, as a god of death, can kill any person—provided they see their victim's face and write their victim's name in a notebook called a Death Note. One day, Ryuk, bored by the shinigami lifestyle and interested in seeing how a human would use a Death Note, drops one into the human realm.\n\nHigh school student and prodigy Light Yagami stumbles upon the Death Note and—since he deplores the state of the world—tests the deadly notebook by writing a criminal's name in it. When the criminal dies immediately following his experiment with the Death Note, Light is greatly surprised and quickly recognizes how devastating the power that has fallen into his hands could be.\n\nWith this divine capability, Light decides to extinguish all criminals in order to build a new world where crime does not exist and people worship him as a god. Police, however, quickly discover that a serial killer is targeting criminals and, consequently, try to apprehend the culprit. To do this, the Japanese investigators count on the assistance of the best detective in the world: a young and eccentric man known only by the name of L.\n\n(Source: MAL Rewrite)",
    created_at: '2024-05-09T18:17:42.936575+00:00',
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
      tiny: 'https://media.kitsu.io/anime/poster_images/1376/tiny.jpg',
      large: 'https://media.kitsu.io/anime/poster_images/1376/large.jpg',
      small: 'https://media.kitsu.io/anime/poster_images/1376/small.jpg',
      medium: 'https://media.kitsu.io/anime/poster_images/1376/medium.jpg',
      original: 'https://media.kitsu.io/anime/poster_images/1376/original.png',
    },
    review: {
      rating: 3,
      status: 'watching',
      updated_at: '2024-05-09T18:38:08.946498+00:00',
    },
    watchlists: [],
  },
  {
    kitsu_id: '42196',
    title: 'Tensei shitara Slime Datta Ken 2',
    synopsis:
      'The second season of Tensei shitara Slime Datta Ken.\n\nA country built by our main character Rimuru and the many monsters who look up to him – the Jura Tempest Federation –, through agreements and trade with neighbouring countries, is the ideal “country where humans and monsters can walk alongside."\n\nRimuru has a tendency to “feel kindly towards humans”, because of its former nature as a human being ...\n\nHowever, there is a clear "hostility toward demons" that exists in this world.\nWhen faced with that unreasonable reality, Rimuru makes its choice.\n\n"Is there something that you don\'t want to lose?"\n\n(Source: Muse Asia)',
    created_at: '2024-05-16T01:18:20.068562+00:00',
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
    review: {
      rating: 3,
      status: 'dropped',
      updated_at: '2024-05-16T21:48:34.039498+00:00',
    },
    watchlists: [
      {
        id: 8,
        title: 'new watchlist',
        user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
        is_public: false,
        role: 'editor',
      },
    ],
  },
] satisfies GetAnimeByUserAssociationResponse

export const QUERY_ANIME_BY_USER_RESPONSE_MOCK = [
  {
    kitsu_id: '12',
    title: 'One Piece',
    synopsis:
      'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.\nEnter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy’s reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.\n[Written by MAL Rewrite]',
    created_at: '2024-05-09T18:18:51.379367+00:00',
    poster_image: null,
    user_reviews: [],
    watchlists: [
      {
        id: 8,
        title: 'new watchlist',
        user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
        is_public: false,
        created_at: '2024-05-14T07:18:08.579901+00:00',
        updated_at: '2024-05-14T07:45:46.236739+00:00',
        description: null,
        watchlists_users: [
          {
            role: 'editor',
            user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
            created_at: '2024-05-16T00:51:44.100837+00:00',
            watchlist_id: 8,
          },
        ],
      },
    ],
  },
  {
    kitsu_id: '1376',
    title: 'Death Note',
    synopsis:
      "A shinigami, as a god of death, can kill any person—provided they see their victim's face and write their victim's name in a notebook called a Death Note. One day, Ryuk, bored by the shinigami lifestyle and interested in seeing how a human would use a Death Note, drops one into the human realm.\n\nHigh school student and prodigy Light Yagami stumbles upon the Death Note and—since he deplores the state of the world—tests the deadly notebook by writing a criminal's name in it. When the criminal dies immediately following his experiment with the Death Note, Light is greatly surprised and quickly recognizes how devastating the power that has fallen into his hands could be.\n\nWith this divine capability, Light decides to extinguish all criminals in order to build a new world where crime does not exist and people worship him as a god. Police, however, quickly discover that a serial killer is targeting criminals and, consequently, try to apprehend the culprit. To do this, the Japanese investigators count on the assistance of the best detective in the world: a young and eccentric man known only by the name of L.\n\n(Source: MAL Rewrite)",
    created_at: '2024-05-09T18:17:42.936575+00:00',
    poster_image: null,
    user_reviews: [
      {
        rating: 3,
        status: 'watching',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        anime_id: '1376',
        created_at: '2024-05-09T18:34:43.626358+00:00',
        updated_at: '2024-05-09T18:38:08.946498+00:00',
        review_text: null,
      },
    ],
    watchlists: [],
  },
  {
    kitsu_id: '41370',
    title: 'Kimetsu no Yaiba',
    synopsis:
      'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a “demon slayer” so that he can turn his sister back into a human, and kill the demon that massacred his family.\n\n(Source: Crunchyroll)',
    created_at: '2024-05-09T05:19:09.181564+00:00',
    poster_image: null,
    user_reviews: [],
    watchlists: [
      {
        id: 1,
        title: 'my anime list 1',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        is_public: true,
        created_at: '2024-05-09T17:20:08.533816+00:00',
        updated_at: '2024-05-09T17:20:08.533816+00:00',
        description: 's',
        watchlists_users: [
          {
            role: 'owner',
            user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
            created_at: '2024-05-14T07:31:58.616954+00:00',
            watchlist_id: 1,
          },
        ],
      },
    ],
  },
  {
    kitsu_id: '42196',
    title: 'Tensei shitara Slime Datta Ken 2',
    synopsis:
      'The second season of Tensei shitara Slime Datta Ken.\n\nA country built by our main character Rimuru and the many monsters who look up to him – the Jura Tempest Federation –, through agreements and trade with neighbouring countries, is the ideal “country where humans and monsters can walk alongside."\n\nRimuru has a tendency to “feel kindly towards humans”, because of its former nature as a human being ...\n\nHowever, there is a clear "hostility toward demons" that exists in this world.\nWhen faced with that unreasonable reality, Rimuru makes its choice.\n\n"Is there something that you don\'t want to lose?"\n\n(Source: Muse Asia)',
    created_at: '2024-05-16T01:18:20.068562+00:00',
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
    user_reviews: [
      {
        rating: 3,
        status: 'watching',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        anime_id: '42196',
        created_at: '2024-05-16T01:18:23.31845+00:00',
        updated_at: '2024-05-16T01:18:24.849329+00:00',
        review_text: null,
      },
    ],
    watchlists: [
      {
        id: 8,
        title: 'new watchlist',
        user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
        is_public: false,
        created_at: '2024-05-14T07:18:08.579901+00:00',
        updated_at: '2024-05-14T07:45:46.236739+00:00',
        description: null,
        watchlists_users: [
          {
            role: 'editor',
            user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
            created_at: '2024-05-16T00:51:44.100837+00:00',
            watchlist_id: 8,
          },
        ],
      },
    ],
  },
  {
    kitsu_id: '7442',
    title: 'Attack on Titan',
    synopsis:
      "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.\n\nAfter witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls. Based on Hajime Isayama's award-winning manga, Shingeki no Kyojin follows Eren, along with his adopted sister Mikasa Ackerman and his childhood friend Armin Arlert, as they join the brutal war against the titans and race to discover a way of defeating them before the last walls are breached.\n\n(Source: MAL Rewrite)",
    created_at: '2024-05-08T09:48:13.122013+00:00',
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
    user_reviews: [
      {
        rating: 2,
        status: 'planned',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        anime_id: '7442',
        created_at: '2024-05-09T05:12:38.336685+00:00',
        updated_at: '2024-05-09T05:15:46.971755+00:00',
        review_text: null,
      },
    ],
    watchlists: [
      {
        id: 1,
        title: 'my anime list 1',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        is_public: true,
        created_at: '2024-05-09T17:20:08.533816+00:00',
        updated_at: '2024-05-09T17:20:08.533816+00:00',
        description: 's',
        watchlists_users: [
          {
            role: 'owner',
            user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
            created_at: '2024-05-14T07:31:58.616954+00:00',
            watchlist_id: 1,
          },
        ],
      },
      {
        id: 2,
        title: 'private watchlist',
        user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
        is_public: false,
        created_at: '2024-05-09T17:24:06.874383+00:00',
        updated_at: '2024-05-09T17:24:06.874383+00:00',
        description: 's',
        watchlists_users: [
          {
            role: 'owner',
            user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
            created_at: '2024-05-14T07:32:10.297508+00:00',
            watchlist_id: 2,
          },
        ],
      },
    ],
  },
]

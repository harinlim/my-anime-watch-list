import type { GetAnimeByIdResponse } from '../types'

/** GET {{KITSU_API}}/anime/:anime_id?fields[categories]=title&include=categories&fields[anime]=slug,synopsis,titles,canonicalTitle,abbreviatedTitles,averageRating,userCount,favoritesCount,startDate,endDate,popularityRank,ratingRank,ageRating,status,posterImage,coverImage,episodeCount,episodeLength,youtubeVideoId,nsfw */
export const ANIME_RESOURCE_MOCK_JP = {
  data: {
    id: '7442',
    type: 'anime',
    links: {
      self: 'https://kitsu.io/api/edge/anime/7442',
    },
    attributes: {
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
      userCount: 552_278,
      favoritesCount: 9206,
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
    },
  },
  included: [
    {
      id: '197',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/197',
      },
      attributes: {
        title: 'Post Apocalypse',
      },
    },
    {
      id: '108',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/108',
      },
      attributes: {
        title: 'Violence',
      },
    },
    {
      id: '150',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/150',
      },
      attributes: {
        title: 'Action',
      },
    },
    {
      id: '157',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/157',
      },
      attributes: {
        title: 'Adventure',
      },
    },
    {
      id: '156',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/156',
      },
      attributes: {
        title: 'Fantasy',
      },
    },
    {
      id: '61',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/61',
      },
      attributes: {
        title: 'Alternative Past',
      },
    },
    {
      id: '153',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/153',
      },
      attributes: {
        title: 'Angst',
      },
    },
    {
      id: '158',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/158',
      },
      attributes: {
        title: 'Horror',
      },
    },
    {
      id: '184',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/184',
      },
      attributes: {
        title: 'Drama',
      },
    },
    {
      id: '207',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/207',
      },
      attributes: {
        title: 'Military',
      },
    },
    {
      id: '47',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/47',
      },
      attributes: {
        title: 'Super Power',
      },
    },
    {
      id: '243',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/243',
      },
      attributes: {
        title: 'Shounen',
      },
    },
  ],
} satisfies GetAnimeByIdResponse

export const ANIME_RESOURCE_MOCK_CN = {
  data: {
    id: '43905',
    type: 'anime',
    links: {
      self: 'https://kitsu.io/api/edge/anime/43905',
    },
    attributes: {
      slug: 'wu-liuqi-zhi-xuanwu-guo-pian',
      synopsis:
        'In order to protect the residents of Xiaoji Island and the peaceful life here, Wu Liuqi and his partners Dabao and Xiaofei embark on a journey to the Xuanwu Kingdom to find out the truth about his identity and a way to save the island. Waiting for them is more unknowns and adventures.\n\n(Source: bilibili, edited)',
      titles: {
        en: 'Scissor Seven Season 3',
        en_cn: 'Wu Liuqi Zhi Xuanwu Guo Pian',
        zh_cn: '伍六七之玄武国篇',
      },
      canonicalTitle: 'Wu Liuqi Zhi Xuanwu Guo Pian',
      abbreviatedTitles: ['Cike Wu Liuqi 3rd Season', 'Killer Seven 3rd Season'],
      averageRating: '81.7',
      userCount: 2948,
      favoritesCount: 15,
      startDate: '2021-01-27',
      endDate: '2021-05-05',
      popularityRank: 3654,
      ratingRank: 380,
      ageRating: 'PG',
      subtype: 'ONA',
      status: 'finished',
      posterImage: {
        tiny: 'https://media.kitsu.io/anime/poster_images/43905/tiny.jpg',
        large: 'https://media.kitsu.io/anime/poster_images/43905/large.jpg',
        small: 'https://media.kitsu.io/anime/poster_images/43905/small.jpg',
        medium: 'https://media.kitsu.io/anime/poster_images/43905/medium.jpg',
        original: 'https://media.kitsu.io/anime/poster_images/43905/original.png',
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
      coverImage: null,
      episodeCount: 10,
      episodeLength: 15,
      youtubeVideoId: null,
      nsfw: false,
    },
  },
  included: [
    {
      id: '150',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/150',
      },
      attributes: {
        title: 'Action',
      },
    },
    {
      id: '157',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/157',
      },
      attributes: {
        title: 'Adventure',
      },
    },
    {
      id: '160',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/160',
      },
      attributes: {
        title: 'Comedy',
      },
    },
    {
      id: '184',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/184',
      },
      attributes: {
        title: 'Drama',
      },
    },
    {
      id: '30',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/30',
      },
      attributes: {
        title: 'Martial Arts',
      },
    },
    {
      id: '234',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/234',
      },
      attributes: {
        title: 'Mystery',
      },
    },
    {
      id: '47',
      type: 'categories',
      links: {
        self: 'https://kitsu.io/api/edge/categories/47',
      },
      attributes: {
        title: 'Super Power',
      },
    },
  ],
} satisfies GetAnimeByIdResponse

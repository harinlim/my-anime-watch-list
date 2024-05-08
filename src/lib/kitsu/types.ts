type Dimensions = { width: number; height: number }

type Size = 'tiny' | 'small' | 'medium' | 'large'

type SizeRecord<TSize extends Size, T> = { [key in TSize]?: T }

type ImageMetadata<TSizes extends Size> = SizeRecord<TSizes, string | undefined> & {
  original: string
  meta: {
    // This doesn't cover conditional case where the corresponding dimension size
    // is only present when the record link exists, but we'll use this for now
    dimensions: SizeRecord<TSizes, Dimensions | undefined>
  }
}

type AnimeAttributes = {
  slug: string
  synopsis: string
  titles: {
    en: string
    [key: string]: string // For other locales
  }
  canonicalTitle: string
  abbreviatedTitles: string[]
  averageRating: string
  userCount: number
  favoritesCount: number
  startDate: string
  endDate: string
  popularityRank: number
  ratingRank: number
  ageRating: string
  subtype: 'ONA' | 'OVA' | 'TV' | 'movie' | 'music' | 'special'
  status: 'current' | 'finished' | 'tba' | 'unreleased' | 'upcoming'
  posterImage: ImageMetadata<Size> | null
  coverImage: ImageMetadata<Exclude<Size, 'medium'>> | null
  episodeCount: number
  episodeLength: number
  youtubeVideoId: string | null
  nsfw: boolean
}

export const ANIME_ATTRIBUTES = [
  'slug',
  'synopsis',
  'titles',
  'canonicalTitle',
  'abbreviatedTitles',
  'averageRating',
  'userCount',
  'favoritesCount',
  'startDate',
  'endDate',
  'popularityRank',
  'ratingRank',
  'ageRating',
  'status',
  'posterImage',
  'coverImage',
  'episodeCount',
  'episodeLength',
  'youtubeVideoId',
  'nsfw',
] as const satisfies (keyof AnimeAttributes)[]

type CategoryAttributes = {
  title: string
}

export const CATEGORY_ATTRIBUTES = ['title'] as const satisfies (keyof CategoryAttributes)[]

export type GetAnimeByIdResponse = {
  data: {
    id: string
    type: 'anime'
    attributes: AnimeAttributes
  }
  included?:
    | {
        id: string
        type: 'categories'
        attributes: CategoryAttributes
      }[]
    | null
}

export type GetAnimeByIdDeserialized = {
  data: {
    id: string
    type: 'anime'
    categories: string[] | null
  } & AnimeAttributes
}

/* 
{
  data: {
    id: '43905',
    type: 'anime',
    links: { self: 'https://kitsu.io/api/edge/anime/43905' },
    attributes: {
      slug: 'wu-liuqi-zhi-xuanwu-guo-pian',
      synopsis: 'In order to protect the residents of Xiaoji Island and the peaceful life here, Wu Liuqi and his partners Dabao and Xiaofei embark on a journey to the Xuanwu Kingdom to find out the truth about his identity and a way to save the island. Waiting for them is more unknowns and adventures.\n' +
        '\n' +
        '(Source: bilibili, edited)',
      coverImageTopOffset: 0,
      titles: [Object],
      canonicalTitle: 'Wu Liuqi Zhi Xuanwu Guo Pian',
      abbreviatedTitles: [Array],
      averageRating: '81.7',
      userCount: 2948,
      favoritesCount: 15,
      startDate: '2021-01-27',
      endDate: '2021-05-05',
      popularityRank: 3653,
      ratingRank: 379,
      ageRating: 'PG',
      status: 'finished',
      posterImage: [Object],
      coverImage: null,
      episodeCount: 10,
      episodeLength: 15,
      nsfw: false
    }
  },
  included: [
    {
      id: '150',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '157',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '160',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '184',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '30',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '234',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '47',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    }
  ]
}
{
  data: {
    id: '43905',
    type: 'anime',
    links: { self: 'https://kitsu.io/api/edge/anime/43905' },
    slug: 'wu-liuqi-zhi-xuanwu-guo-pian',
    synopsis: 'In order to protect the residents of Xiaoji Island and the peaceful life here, Wu Liuqi and his partners Dabao and Xiaofei embark on a journey to the Xuanwu Kingdom to find out the truth about his identity and a way to save the island. Waiting for them is more unknowns and adventures.\n' +
      '\n' +
      '(Source: bilibili, edited)',
    titles: {
      en: 'Scissor Seven Season 3',
      en_cn: 'Wu Liuqi Zhi Xuanwu Guo Pian',
      zh_cn: '伍六七之玄武国篇'
    },
    canonicalTitle: 'Wu Liuqi Zhi Xuanwu Guo Pian',
    abbreviatedTitles: [ 'Cike Wu Liuqi 3rd Season', 'Killer Seven 3rd Season' ],
    averageRating: '81.7',
    userCount: 2948,
    favoritesCount: 15,
    startDate: '2021-01-27',
    endDate: '2021-05-05',
    popularityRank: 3653,
    ratingRank: 379,
    ageRating: 'PG',
    status: 'finished',
    posterImage: {
      tiny: 'https://media.kitsu.io/anime/poster_images/43905/tiny.jpg',
      large: 'https://media.kitsu.io/anime/poster_images/43905/large.jpg',
      small: 'https://media.kitsu.io/anime/poster_images/43905/small.jpg',
      medium: 'https://media.kitsu.io/anime/poster_images/43905/medium.jpg',
      original: 'https://media.kitsu.io/anime/poster_images/43905/original.png',
      meta: [Object]
    },
    coverImage: null,
    episodeCount: 10,
    episodeLength: 15,
    nsfw: false
  }
}
*/

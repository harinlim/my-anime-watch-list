import type { GetUserWatchlistOverviewsResponse } from './types'
import type { Watchlist } from '@/types/watchlists'

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

export const GET_WATCHLIST_OVERVIEWS_RESPONSE_MOCK = {
  data: [
    {
      id: 8,
      user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
      title: 'Lots of collaborators :3 uwu',
      is_public: true,
      description:
        'Dive into a world of puzzles, secrets, and suspense with these gripping mystery anime. Each series is crafted to keep you on the edge of your seat, weaving intricate plots that unravel slowly, revealing layers of complexity and depth. From detective dramas to supernatural enigmas, prepare to be drawn into stories where every clue matters, and every twist and turn keeps you guessing until the very end.',
      created_at: '2024-05-14T07:18:08.579901+00:00',
      updated_at: '2024-06-26T19:14:28.698713+00:00',
      anime: [
        {
          title: 'Ansatsu Kyoushitsu 2nd Season',
          kitsu_id: '10877',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/10877/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/10877/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/10877/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/10877/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/10877/original.jpg',
          },
        },
        {
          title: 'Boku no Hero Academia',
          kitsu_id: '11469',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/11469/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/11469/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/11469/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/11469/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/11469/original.png',
          },
        },
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
          title: 'Boku no Hero Academia 2',
          kitsu_id: '12268',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/12268/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/12268/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/12268/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/12268/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/12268/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'editor',
          user_id: '155e499a-a395-4a61-bc0b-0d8e8e759afe',
          username: 'test2',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '2b151ac2-68ad-43a8-aced-d0c8681a55cf',
          username: 'harins6',
          avatar_url:
            'https://api.dicebear.com/8.x/fun-emoji/svg?seed=Toby&backgroundColor=d84be5,d1d4f9,c0aede,b6e3f4,71cf62,059ff2,d9915b,f6d594,fcbc34,ffd5dc,ffdfbf',
        },
        {
          role: 'editor',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '4a2df46d-880c-4b72-ba22-88e2de6d5922',
          username: 'harin07',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '66e90d70-5938-4813-a8eb-40937647ad04',
          username: 'test5',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '6b1064ea-2cbb-43cb-8134-c7d1598c92b0',
          username: 'test6',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '6d1342f9-c9c9-45ec-8cca-dcfb52761f97',
          username: 'test4',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'b9c993cd-3ce2-41ea-b74a-c531e116436f',
          username: 'harin10',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'ca336298-b48a-4cd8-9f75-583843b2d0f7',
          username: 'harin51',
          avatar_url:
            'https://kawaii-avatar.now.sh/api/avatar?username=hm&size=300&type=Planet&mood=lovestruck&color=orange&background=lavender',
        },
        {
          role: 'editor',
          user_id: 'cc4ddb24-fad1-4186-bc22-7ec01cef3955',
          username: 'test9',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'f08af685-f056-4446-810f-0bff4ef694fc',
          username: 'harin52',
          avatar_url:
            'https://kawaii-avatar.now.sh/api/avatar?username=hm&size=300&type=IceCream&mood=blissful&color=skyblue&background=gray',
        },
        {
          role: 'owner',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 19,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title:
        'me privato rawrrrra jfskfjldflsjfls ksdfjsadlfk  jsalfjasldfjsadlkfjslklsjflksajflkasjfds',
      is_public: false,
      description: '',
      created_at: '2024-05-25T19:32:38.106456+00:00',
      updated_at: '2024-06-25T16:35:27.704779+00:00',
      anime: [
        {
          title: 'Boku no Hero Academia',
          kitsu_id: '11469',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/11469/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/11469/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/11469/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/11469/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/11469/original.png',
          },
        },
        {
          title: 'Boku no Hero Academia 2',
          kitsu_id: '12268',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/12268/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/12268/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/12268/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/12268/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/12268/original.jpg',
          },
        },
        {
          title: 'Tokyo Ghoul',
          kitsu_id: '8271',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/8271/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/8271/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/8271/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/8271/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/8271/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'editor',
          user_id: '2b151ac2-68ad-43a8-aced-d0c8681a55cf',
          username: 'harins6',
          avatar_url:
            'https://api.dicebear.com/8.x/fun-emoji/svg?seed=Toby&backgroundColor=d84be5,d1d4f9,c0aede,b6e3f4,71cf62,059ff2,d9915b,f6d594,fcbc34,ffd5dc,ffdfbf',
        },
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '794d13f4-fd64-4666-99f0-0981923764e3',
          username: 'animed',
          avatar_url: 'https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=Baby',
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 64,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'sdfdasfxcx',
      is_public: true,
      description: '',
      created_at: '2024-06-18T03:31:31.289623+00:00',
      updated_at: '2024-06-25T16:35:22.393452+00:00',
      anime: [
        {
          title: 'Boku no Hero Academia',
          kitsu_id: '11469',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/11469/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/11469/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/11469/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/11469/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/11469/original.png',
          },
        },
        {
          title: 'Detective Conan',
          kitsu_id: '210',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/210/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/210/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/210/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/210/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/210/original.jpg',
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
        {
          title: 'Tokyo Ghoul',
          kitsu_id: '8271',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/8271/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/8271/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/8271/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/8271/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/8271/original.jpg',
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
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '794d13f4-fd64-4666-99f0-0981923764e3',
          username: 'animed',
          avatar_url: 'https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=Baby',
        },
        {
          role: 'editor',
          user_id: 'b9c993cd-3ce2-41ea-b74a-c531e116436f',
          username: 'harin10',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'ca336298-b48a-4cd8-9f75-583843b2d0f7',
          username: 'harin51',
          avatar_url:
            'https://kawaii-avatar.now.sh/api/avatar?username=hm&size=300&type=Planet&mood=lovestruck&color=orange&background=lavender',
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 1,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'mawl 1 sdfnkajnsdds',
      is_public: true,
      description:
        'Enter magical lands and fantastical universes with this collection of fantasy anime. Dragons, wizards, and mythical creatures await your exploration in these richly imagined worlds. Journey alongside heroes who wield powerful magic, uncover ancient secrets, and battle dark forces. These series are perfect for escaping reality and diving into adventures where anything is possible and the imagination knows no bounds.',
      created_at: '2024-05-09T17:20:08.533816+00:00',
      updated_at: '2024-06-13T18:06:16.476132+00:00',
      anime: [
        {
          title: 'Boku no Hero Academia',
          kitsu_id: '11469',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/11469/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/11469/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/11469/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/11469/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/11469/original.png',
          },
        },
        {
          title: 'Death Note',
          kitsu_id: '1376',
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
        },
        {
          title: 'Boku no Hero Academia 3',
          kitsu_id: '13881',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/13881/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/13881/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/13881/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/13881/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/13881/original.jpg',
          },
        },
        {
          title: 'Detective Conan',
          kitsu_id: '210',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/210/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/210/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/210/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/210/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/210/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'editor',
          user_id: '2b151ac2-68ad-43a8-aced-d0c8681a55cf',
          username: 'harins6',
          avatar_url:
            'https://api.dicebear.com/8.x/fun-emoji/svg?seed=Toby&backgroundColor=d84be5,d1d4f9,c0aede,b6e3f4,71cf62,059ff2,d9915b,f6d594,fcbc34,ffd5dc,ffdfbf',
        },
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '4a2df46d-880c-4b72-ba22-88e2de6d5922',
          username: 'harin07',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'b9c993cd-3ce2-41ea-b74a-c531e116436f',
          username: 'harin10',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'bc8d74a3-97d5-4bdc-a7ae-f89d5e0f7211',
          username: 'anime',
          avatar_url: 'https://kawaii-avatar.now.sh/api/avatar',
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'f08af685-f056-4446-810f-0bff4ef694fc',
          username: 'harin52',
          avatar_url:
            'https://kawaii-avatar.now.sh/api/avatar?username=hm&size=300&type=IceCream&mood=blissful&color=skyblue&background=gray',
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 13,
      user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
      title: 'new watchlist from post',
      is_public: true,
      description: 'my fav watchlist fr',
      created_at: '2024-05-25T17:35:21.226184+00:00',
      updated_at: '2024-06-12T20:21:55.630642+00:00',
      anime: [
        {
          title: 'Boku no Hero Academia',
          kitsu_id: '11469',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/11469/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/11469/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/11469/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/11469/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/11469/original.png',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'editor',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '4a2df46d-880c-4b72-ba22-88e2de6d5922',
          username: 'harin07',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'b9c993cd-3ce2-41ea-b74a-c531e116436f',
          username: 'harin10',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'bc8d74a3-97d5-4bdc-a7ae-f89d5e0f7211',
          username: 'anime',
          avatar_url: 'https://kawaii-avatar.now.sh/api/avatar',
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'f08af685-f056-4446-810f-0bff4ef694fc',
          username: 'harin52',
          avatar_url:
            'https://kawaii-avatar.now.sh/api/avatar?username=hm&size=300&type=IceCream&mood=blissful&color=skyblue&background=gray',
        },
        {
          role: 'owner',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 15,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'hello there my child',
      is_public: false,
      description: 'my 2nd fav',
      created_at: '2024-05-25T19:27:35.348355+00:00',
      updated_at: '2024-06-12T20:21:53.313857+00:00',
      anime: [
        {
          title: 'Boku no Hero Academia',
          kitsu_id: '11469',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/11469/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/11469/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/11469/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/11469/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/11469/original.png',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '4a2df46d-880c-4b72-ba22-88e2de6d5922',
          username: 'harin07',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '794d13f4-fd64-4666-99f0-0981923764e3',
          username: 'animed',
          avatar_url: 'https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=Baby',
        },
        {
          role: 'editor',
          user_id: 'b9c993cd-3ce2-41ea-b74a-c531e116436f',
          username: 'harin10',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'bc8d74a3-97d5-4bdc-a7ae-f89d5e0f7211',
          username: 'anime',
          avatar_url: 'https://kawaii-avatar.now.sh/api/avatar',
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 23,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'My favorite watchlist test create',
      is_public: true,
      description: 'hrslkfjasfj fklsjdfskf skfj;klfsaj  ; jfal j;  af;lfjasj;a',
      created_at: '2024-06-12T19:54:57.157131+00:00',
      updated_at: '2024-06-12T19:54:57.157131+00:00',
      anime: [],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'editor',
          user_id: '2b151ac2-68ad-43a8-aced-d0c8681a55cf',
          username: 'harins6',
          avatar_url:
            'https://api.dicebear.com/8.x/fun-emoji/svg?seed=Toby&backgroundColor=d84be5,d1d4f9,c0aede,b6e3f4,71cf62,059ff2,d9915b,f6d594,fcbc34,ffd5dc,ffdfbf',
        },
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '794d13f4-fd64-4666-99f0-0981923764e3',
          username: 'animed',
          avatar_url: 'https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=Baby',
        },
        {
          role: 'editor',
          user_id: 'bc8d74a3-97d5-4bdc-a7ae-f89d5e0f7211',
          username: 'anime',
          avatar_url: 'https://kawaii-avatar.now.sh/api/avatar',
        },
        {
          role: 'editor',
          user_id: 'ca336298-b48a-4cd8-9f75-583843b2d0f7',
          username: 'harin51',
          avatar_url:
            'https://kawaii-avatar.now.sh/api/avatar?username=hm&size=300&type=Planet&mood=lovestruck&color=orange&background=lavender',
        },
        {
          role: 'editor',
          user_id: 'e5b578e0-bda1-40cb-b4a4-eb7a66be2b3a',
          username: 'harins',
          avatar_url: 'https://api.dicebear.com/8.x/notionists-neutral/svg?seed=Gracie',
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 14,
      user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
      title: 'new watchlist from post 2',
      is_public: true,
      description: 'my fav watchlist fr',
      created_at: '2024-05-25T17:37:05.878023+00:00',
      updated_at: '2024-05-25T17:37:05.878023+00:00',
      anime: [],
      watchlists_users: [
        {
          role: 'owner',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 10,
      user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
      title: 'tsefdsafdsfasd',
      is_public: false,
      description:
        "HTTP 202 can also be returned by either operation and would imply that the instruction was accepted by the server, but not fully applied yet. It's possible that the operation fails later, so the client shouldn't fully assume that it was success.\n\nA client that receives a status code it doesn't recognize, but it's starting with 2 should treat it as a 200 OK.",
      created_at: '2024-05-18T23:49:37.854718+00:00',
      updated_at: '2024-05-22T22:25:22.378634+00:00',
      anime: [
        {
          title: 'One Punch Man',
          kitsu_id: '10740',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/10740/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/10740/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/10740/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/10740/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/10740/original.jpg',
          },
        },
        {
          title: 'Boku no Hero Academia 2',
          kitsu_id: '12268',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/12268/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/12268/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/12268/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/12268/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/12268/original.jpg',
          },
        },
        {
          title: 'Death Note',
          kitsu_id: '1376',
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
        },
        {
          title: 'Boku no Hero Academia 3',
          kitsu_id: '13881',
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
            tiny: 'https://media.kitsu.io/anime/poster_images/13881/tiny.jpg',
            large: 'https://media.kitsu.io/anime/poster_images/13881/large.jpg',
            small: 'https://media.kitsu.io/anime/poster_images/13881/small.jpg',
            medium: 'https://media.kitsu.io/anime/poster_images/13881/medium.jpg',
            original: 'https://media.kitsu.io/anime/poster_images/13881/original.jpg',
          },
        },
      ],
      watchlists_users: [
        {
          role: 'editor',
          user_id: '0e4c4e88-8544-4294-9515-1d36e219e735',
          username: 'harins3',
          avatar_url: 'https://api.dicebear.com/8.x/pixel-art-neutral/svg?seed=Jasmine',
        },
        {
          role: 'editor',
          user_id: '2b151ac2-68ad-43a8-aced-d0c8681a55cf',
          username: 'harins6',
          avatar_url:
            'https://api.dicebear.com/8.x/fun-emoji/svg?seed=Toby&backgroundColor=d84be5,d1d4f9,c0aede,b6e3f4,71cf62,059ff2,d9915b,f6d594,fcbc34,ffd5dc,ffdfbf',
        },
        {
          role: 'owner',
          user_id: '345c6204-61ce-4348-b7b6-7d6df14d4580',
          username: 'harin50',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '3717fc5a-5921-4902-8182-68f6e8cd9ad9',
          username: 'harin42',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: '4a2df46d-880c-4b72-ba22-88e2de6d5922',
          username: 'harin07',
          avatar_url: null,
        },
        {
          role: 'editor',
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
    {
      id: 3,
      user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
      title: "harin05's watchlist",
      is_public: true,
      description:
        'Embark on epic quests and thrilling journeys with this selection of adventure-filled anime series. From fantastical worlds teeming with mythical creatures to daring escapades that test the limits of our heroes, these stories are designed to fuel your sense of wonder and excitement. Prepare for an adrenaline rush as you dive into tales of courage, camaraderie, and exploration, where every episode brings a new and exhilarating challenge.',
      created_at: '2024-05-09T17:24:39.835502+00:00',
      updated_at: '2024-05-18T20:35:04.190157+00:00',
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
          user_id: 'fc53a10d-707b-4df9-9036-3dc4ec35e88a',
          username: 'harin05',
          avatar_url: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bubba',
        },
      ],
    },
  ],
  ok: true,
  status: 200,
  meta: {
    total: 11,
    limit: 10,
    self: 1,
    next: 2,
  },
} satisfies GetUserWatchlistOverviewsResponse

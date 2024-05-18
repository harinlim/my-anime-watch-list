import { Tooltip } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import styles from './AvatarGroup.module.css'

import type { WatchlistOverview } from '@/types/watchlists'

type WatchlistUser = WatchlistOverview['watchlists_users'][number]

function Avatar({ user }: { user: WatchlistUser }) {
  const a11yLabel = `${user.role}: ${user.username}`

  return (
    <Tooltip key={user.user_id} label={`@${user.username}`} position="top">
      <Link href={`/profile/${user.username}`} prefetch={false}>
        {user.avatar_url ? (
          <Image
            key={user.user_id}
            className={clsx(styles.ring, 'inline-block')}
            src={
              user.avatar_url ??
              'https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'
            }
            alt={a11yLabel}
          />
        ) : (
          <svg
            key={user.user_id}
            className={clsx(
              styles.ring,
              'inline-block h-8 w-8 rounded-full bg-zinc-300 text-gray-400 dark:bg-zinc-500'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-label={a11yLabel}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Link>
    </Tooltip>
  )
}

export function AvatarGroup({ watchlist_users }: { watchlist_users: WatchlistUser[] }) {
  const watchlistUsersOverview = watchlist_users.slice(0, 2)
  const remainingUsers = watchlist_users.length - watchlistUsersOverview.length

  return (
    <div className="flex -space-x-2">
      {watchlistUsersOverview.map(user => (
        <Avatar user={user} />
      ))}
      {remainingUsers > 0 && (
        <span
          aria-label={`And ${remainingUsers} more contributors`}
          className={clsx(
            styles.ring,
            'inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-600'
          )}
        >
          <span aria-hidden className="text-sm leading-none text-gray-600 dark:text-neutral-200">
            {remainingUsers}+
          </span>
        </span>
      )}
    </div>
  )
}

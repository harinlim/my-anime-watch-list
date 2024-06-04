import { Tooltip, Box, Image } from '@mantine/core'
import clsx from 'clsx'
import Link from 'next/link'

import styles from './AvatarGroup.module.css'

import type { PublicUser } from '@/types/users'
import type { WatchlistUser } from '@/types/watchlists'
import type { PropsWithChildren } from 'react'

type AvatarGroupProps = {
  watchlistId: number | string
  watchlist_users: WatchlistUser[]
  maxAvatars?: number
  onClickMore?: () => void
}

const DEFAULT_AVATARS_TO_SHOW = 3

function AvatarWrapper({
  asLink,
  href,
  className,
  children,
}: PropsWithChildren<{ asLink: true; href: string } | { asLink: false; href?: string }> & {
  className?: string
}) {
  if (asLink) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {children}
      </Link>
    )
  }

  return <div className={className}>{children}</div>
}

export function Avatar({
  user,
  size = 8,
  asLink = false,
}: {
  user: WatchlistUser | PublicUser
  size?: number
  asLink?: boolean
}) {
  const a11yLabel = 'role' in user ? `${user.role}: ${user.username}` : user.username
  const key = 'user_id' in user ? user.user_id : user.id

  return (
    <Tooltip label={`@${user.username}`} position="top">
      <AvatarWrapper asLink={asLink} href={`/profile/${user.username}`} className="shrink-0">
        {user.avatar_url ? (
          <Image
            key={key}
            className={clsx(styles.ring, 'inline-block size-8 bg-white dark:bg-zinc-700')}
            src={user.avatar_url}
            alt={a11yLabel}
          />
        ) : (
          <svg
            key={key}
            className={clsx(
              styles.ring,
              `size-${size}`,
              'inline-block size-8 bg-zinc-300 text-gray-400 dark:bg-zinc-500'
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
      </AvatarWrapper>
    </Tooltip>
  )
}

export function AvatarGroup({
  watchlistId,
  watchlist_users,
  maxAvatars = DEFAULT_AVATARS_TO_SHOW,
  onClickMore,
}: AvatarGroupProps) {
  // Show at most `maxAvatar` avatars. If there is an overflow, use the last "avatar" to show remaining users.
  const watchlistUsersOverview =
    watchlist_users.length > maxAvatars ? watchlist_users.slice(0, maxAvatars - 1) : watchlist_users
  const remainingUsers = watchlist_users.length - watchlistUsersOverview.length

  const remainingUsersButtonProps = onClickMore
    ? ({ onClick: onClickMore, type: 'button' } as const)
    : undefined

  const remainingUsersLabel = `And ${remainingUsers} more ${remainingUsers > 1 ? 'contributors' : 'contributor'}`

  return (
    <div className="flex -space-x-2">
      {watchlistUsersOverview.map(user => (
        <Avatar key={`${watchlistId}:avatar-${user.user_id}`} asLink user={user} />
      ))}
      {remainingUsers > 0 && (
        <Tooltip label={remainingUsersLabel} position="top">
          <Box
            component={onClickMore ? 'button' : 'span'}
            aria-label={remainingUsersLabel}
            className={clsx(
              styles.ring,
              'inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-600'
            )}
            {...remainingUsersButtonProps}
          >
            <span aria-hidden className="text-sm leading-none text-gray-600 dark:text-neutral-200">
              {remainingUsers}+
            </span>
          </Box>
        </Tooltip>
      )}
    </div>
  )
}

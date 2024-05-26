'use client'

import { Group, LoadingOverlay, Text } from '@mantine/core'
import clsx from 'clsx'
import { memo } from 'react'

import { Avatar } from '@/components/watchlists/AvatarGroup'

import { CollaboratorRoleDropdown } from './CollaboratorRoleDropdown'

import type { WatchlistUser } from '@/types/watchlists'

type Props = {
  collaborator: WatchlistUser
  canEdit: boolean
  canDelete: boolean
  isSelf?: boolean
  isPending?: boolean
  onChange: (collaboratorId: string, option: 'editor' | 'viewer' | 'remove') => void
  className?: string
}

const arePropsEqual = (prevProps: Props, nextProps: Props) =>
  prevProps.collaborator === nextProps.collaborator ||
  (prevProps.collaborator.user_id === nextProps.collaborator.user_id &&
    prevProps.collaborator.role === nextProps.collaborator.role &&
    prevProps.collaborator.username === nextProps.collaborator.username &&
    prevProps.collaborator.avatar_url === nextProps.collaborator.avatar_url &&
    prevProps.canEdit === nextProps.canEdit &&
    prevProps.canDelete === nextProps.canDelete &&
    prevProps.isPending === nextProps.isPending &&
    prevProps.isSelf === nextProps.isSelf &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.className === nextProps.className)

export const CollaboratorListItem = memo(
  ({ collaborator, canEdit, canDelete, isPending, isSelf, onChange, className }: Props) => (
    <li className={clsx('relative flex h-14 items-center justify-between gap-3 pl-3', className)}>
      <LoadingOverlay visible={isPending} loaderProps={{ children: ' ' }} />

      <Group wrap="nowrap">
        <Avatar user={collaborator} />
        <Text className="overflow-x-auto text-ellipsis text-nowrap text-sm sm:text-base">
          @{collaborator.username}
          {isSelf ? ' (You)' : ''}
        </Text>
      </Group>

      {canEdit || canDelete ? (
        <CollaboratorRoleDropdown
          canEdit={canEdit}
          canDelete={canDelete}
          isDisabled={isPending}
          onChange={onChange}
          collaborator={collaborator}
        />
      ) : (
        <Text className="pl-4 pr-8 text-sm capitalize italic opacity-60">{collaborator.role}</Text>
      )}
    </li>
  ),
  arePropsEqual
)

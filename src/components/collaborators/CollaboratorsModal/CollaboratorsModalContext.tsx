'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext, useMemo } from 'react'

import type { ReactNode } from 'react'

const EditCollaboratorsModalContext = createContext<ReturnType<typeof useDisclosure> | null>(null)

const noop = () => {}

/** Use the override if it exists. Otherwise, use the context */
export function useEditCollaboratorsModal(
  override?: Readonly<{
    isOpen?: boolean
    open?: () => void
    close?: () => void
    toggle?: () => void
  }>
) {
  const context = useContext(EditCollaboratorsModalContext)

  const overrideDisclosure = useMemo(
    () =>
      [
        override?.isOpen ?? false,
        {
          open: override?.open ?? noop,
          close: override?.close ?? noop,
          toggle: override?.toggle ?? noop,
        },
      ] as const,
    [override?.close, override?.isOpen, override?.open, override?.toggle]
  )
  if (override) {
    return overrideDisclosure
  }

  if (!context) {
    throw new Error(
      'useEditCollaboratorsModal must be used within a EditCollaboratorsModalProvider or pass default props'
    )
  }
  return context
}

export function EditCollaboratorsModalProvider({
  initialOpened,
  onOpen,
  onClose,
  children,
}: {
  initialOpened?: boolean
  onOpen?: () => void
  onClose?: () => void
  children: ReactNode
}) {
  const value = useDisclosure(initialOpened, { onOpen, onClose })

  return (
    <EditCollaboratorsModalContext.Provider value={value}>
      {children}
    </EditCollaboratorsModalContext.Provider>
  )
}

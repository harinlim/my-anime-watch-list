'use client'

import { createContext, useContext } from 'react'

import type { User } from '@/types/users'

// Use `undefined` as the default `nil` value as a user may be null if not signed in
export const UserContext = createContext<User | null | undefined>(undefined)

export function useCurrentUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

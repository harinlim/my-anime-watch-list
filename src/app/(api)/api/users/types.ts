import type { searchUsersParamsSchema } from './schemas'
import type { Database } from '@/types/generated/supabase'
import type { z } from 'zod'

export type UserSearchOptions = Exclude<
  Database['public']['Functions']['search_users']['Args'],
  { querying_user_id: string }
>
export type UserSearchOptionsSchema = z.infer<typeof searchUsersParamsSchema>

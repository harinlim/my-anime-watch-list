import { userSchema } from '@/types/users.schemas'

import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getUserFromAuth(supabase: SupabaseClient<Database>, jwt?: string) {
  const result = await supabase.auth.getUser(jwt)
  if (result.error) {
    return { data: null, error: result.error }
  }

  const parseResult = userSchema.safeParse({
    id: result.data.user.id,
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    email: result.data.user.email ?? result.data.user.user_metadata.email,
    username: result.data.user.user_metadata.username,
    avatar_url: result.data.user.user_metadata.avatar_url,
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  })

  if (!parseResult.success) {
    return { data: null, error: parseResult.error }
  }

  return { data: parseResult.data, error: null }
}

export function getUserExistsById(supabase: SupabaseClient<Database>, userId: string) {
  return supabase.from('users').select(undefined, { count: 'exact', head: true }).eq('id', userId)
}

export function getUsersExistByIds(supabase: SupabaseClient<Database>, userIds: string[]) {
  return supabase.from('users').select(undefined, { count: 'exact', head: true }).in('id', userIds)
}

export function getUserByUsername(supabase: SupabaseClient<Database>, username: string) {
  return supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('username', username)
    .maybeSingle()
}

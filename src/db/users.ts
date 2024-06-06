import { userSchema } from '@/types/users.schemas'

import type { Database } from '@/types/generated/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns the user associated with the current session, refreshing it if necessary. As cookies are
 * validated via the middleware, this function should be used to get the user data from the `auth`.
 *
 * If no session is found, the function will return `null` for the user data.
 */
export async function getUserFromSession(supabase: SupabaseClient<Database>) {
  const result = await supabase.auth.getSession()
  if (result.error) {
    return { data: null, error: result.error }
  }

  const { session } = result.data
  if (session === null) {
    return { data: null, error: null }
  }

  const parseResult = userSchema.safeParse({
    id: session.user.id,
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    email: session.user.email ?? session.user.user_metadata.email,
    username: session.user.user_metadata.username,
    avatar_url: session.user.user_metadata.avatar_url,
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  })

  if (!parseResult.success) {
    return { data: null, error: parseResult.error }
  }

  return { data: parseResult.data, error: null }
}

/**
 * @deprecated As sessions are now completely managed via middleware, this function is no longer needed,
 * as it adds latency to the request for no benefit. Please use `getUserFromSession` instead unless
 * it is ABSOLUTELY necessary to get the latest user data from the `auth` table (which is rare).
 *
 * Calls the `getUser` method from the `@supabase/supabase-js` library to get the user from the JWT.
 * Makes a request to the Supabase API to get the user to validate and get the latest user data.
 */
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

export function getUserByUsername(supabase: SupabaseClient<Database>, username: string) {
  return supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('username', username)
    .maybeSingle()
}

import type { userSchema } from './users.schemas'
import type { z } from 'zod'

export type User = z.infer<typeof userSchema>

export type PublicUser = Omit<User, 'email'>

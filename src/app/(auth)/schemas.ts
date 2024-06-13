import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Please enter a username or email'),
  password: z.string().min(1, 'Please enter a password'),
})

export type LoginSchema = z.infer<typeof loginSchema>

// Note zod validations are done in the OPPOSITE order they are defined
export const signupSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  username: z
    .string()
    .trim()
    .regex(/^\w+$/, 'Username can only contain letters, numbers, and underscores')
    .min(4, 'Username must be at least 4 characters')
    .min(1, 'Please enter a username'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Please enter a password'),
})

export type SignupSchema = z.infer<typeof signupSchema>

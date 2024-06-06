import type { ZodError } from 'zod'

export function transformZodValidationErrorToResponse(
  error: ZodError,
  format?: (error: ZodError) => object
) {
  if (format) {
    return format(error)
  }

  return {
    errors: error.flatten().fieldErrors,
  }
}

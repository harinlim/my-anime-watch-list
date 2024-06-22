'use server'

import { revalidatePath } from 'next/cache'

export const revalidate = (path: string) => {
  try {
    if (path) {
      revalidatePath(path)
    }
  } catch (error) {
    console.error('revalidate=>', error)
  }
}

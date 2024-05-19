export function getAnimeRatingColor(
  rating: number
): `text-${string}-${number} dark:text-${string}-${number}` {
  if (rating >= 80) {
    return 'text-emerald-600 dark:text-emerald-400'
  }
  if (rating >= 70) {
    return 'text-lime-700 dark:text-lime-400'
  }
  if (rating >= 60) {
    return 'text-yellow-600 dark:text-yellow-400'
  }
  if (rating >= 50) {
    return 'text-orange-600 dark:text-orange-400'
  }
  return 'text-red-600 dark:text-red-400'
}

export const WATCH_STATUS = ['planned', 'watching', 'completed', 'dropped'] as const
export type WatchStatus = (typeof WATCH_STATUS)[number]

export type ResponseWithData<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; data: null }

export type PaginationMetadata = {
  total: number
  limit: number
  prev?: number
  next?: number
}

export type ResponseWithDataPaginated<T> =
  | { ok: true; status: number; data: T; meta: PaginationMetadata }
  | { ok: false; status: number; data: null; meta?: never }

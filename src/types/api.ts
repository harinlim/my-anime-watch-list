export type ResponseWithData<T> =
  | { ok: true; status: number; data: T; message?: never }
  | { ok: false; status: number; data: null; message?: string }

export type PaginationMetadata = {
  total: number
  limit: number
  prev?: number
  next?: number
}

export type ResponseWithDataPaginated<T> =
  | { ok: true; status: number; data: T; message?: never; meta: PaginationMetadata }
  | { ok: false; status: number; data: null; message?: string; meta?: never }
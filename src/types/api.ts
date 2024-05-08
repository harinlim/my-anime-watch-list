export type ResponseWithData<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; data: null }

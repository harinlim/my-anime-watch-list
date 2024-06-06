import type { ResponseWithData } from '@/types/api'

export async function fetchWithType<T extends object>(
  url: string | URL | Request,
  init: RequestInit = {},
  toMessage: (
    errorResponse: Response
  ) => string | undefined | Promise<string | undefined> = response => response.statusText
): Promise<ResponseWithData<T>> {
  const response = await fetch(url, init)
  if (!response.ok) {
    return {
      data: null,
      message: await toMessage(response),
      status: response.status,
      ok: response.ok,
    }
  }

  return {
    data: (await response.json()) as T,
    status: response.status,
    ok: response.ok,
  }
}

type HttpErrorProps<T = unknown> = {
  response: Response
  body?: T
  message?: string
  prefix?: string
}

export class HttpError<T = unknown> extends Error {
  response: Response

  body?: T

  constructor({
    response,
    message = `${response.status} ${response.statusText}`,
    body,
    prefix,
  }: HttpErrorProps<T>) {
    super(`${prefix ? `${prefix}: ` : ''}${message}`)

    this.name = 'HttpError'
    this.response = response
    this.body = body
  }
}

export async function fetchWithError<
  SkipResult extends boolean = false,
  TData = SkipResult extends false ? object : undefined,
  TError = string,
>(
  url: string | URL | Request,
  init: RequestInit = {},
  props?: {
    skipResult?: SkipResult
    logResponse?: boolean
    toBody?: (errorResponse: Response) => TError | Promise<TError>
    toMessage?: (errorResponse: Response) => string | undefined | Promise<string | undefined>
    prefix?: string | ((errorResponse: Response) => string | Promise<string>)
  }
): Promise<TData> {
  const response = await fetch(url, init)
  if (!response.ok) {
    const errorBody = props?.toBody ? await props.toBody(response) : await response.clone().json()

    if (props?.logResponse) {
      console.error(errorBody)
    }

    throw new HttpError({
      response: response.clone(),
      body: errorBody,
      message: props?.toMessage ? await props.toMessage(response) : undefined,
      prefix: props?.prefix
        ? typeof props.prefix === 'string'
          ? props.prefix
          : await props.prefix(response)
        : undefined,
    })
  }

  // TODO: I want to link the status with this skipResult without affecting the end result json
  if (response.status === 204 || props?.skipResult) {
    return undefined as TData
  }

  return response.json() as Promise<TData>
}

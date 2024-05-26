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

export async function fetchWithError<TData = void, TError = string>(
  url: string | URL | Request,
  init: RequestInit = {},
  errorProps?: {
    toBody?: (errorResponse: Response) => TError | Promise<TError>
    toMessage?: (errorResponse: Response) => string | undefined | Promise<string | undefined>
    prefix?: string | ((errorResponse: Response) => string | Promise<string>)
  }
): Promise<TData> {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new HttpError({
      response: response.clone(),
      body: errorProps?.toBody ? await errorProps.toBody(response) : await response.clone().json(),
      message: errorProps?.toMessage ? await errorProps.toMessage(response) : undefined,
      prefix: errorProps?.prefix
        ? typeof errorProps.prefix === 'string'
          ? errorProps.prefix
          : await errorProps.prefix(response)
        : undefined,
    })
  }

  return (await response.json()) as TData
}

export interface ApiResult<T> {
  code: string
  message: string
  data: T
}

export interface PageParams {
  page: number
  size: number
  sort?: string | string[]
}

export interface PageData<T> {
  totalPages: number
  totalElements: number
  number: number
  size: number
  numberOfElements: number
  content: T[]
  first: boolean
  last: boolean
  empty?: boolean
  sort?: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  pageable?: {
    size: number
    page: number
    sort: string[]
  }
}

export type PageResponse<T> = ApiResult<PageData<T>>

export interface BusinessError {
  isBusinessError: true
  data: ApiResult<unknown>
}

export function isBusinessError(err: unknown): err is BusinessError {
  return Boolean(err && typeof err === 'object' && 'isBusinessError' in err)
}

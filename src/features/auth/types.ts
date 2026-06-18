export interface AdminSelf {
  avatar: string | null
  userName: string
  authorities: string[]
}

export interface LoginRequest {
  username: string
  code: string
}

/** 后端统一返回格式 Result<T> */
export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

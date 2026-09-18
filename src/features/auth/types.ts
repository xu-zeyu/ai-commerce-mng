export interface AdminSelf {
  avatar: string | null
  userName: string
}

export interface LoginRequest {
  username: string
  password: string
  smsCode: string
}

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface AdminSelf {
  avatar: string | null
  userName: string
  authorities: string[]
}

export interface AdminRole {
  id: number
  rname: string
  description: string
  updatedTime: string
  createdTime: string
}

export interface AdminInfo {
  id: number
  username: string
  realName: string
  phone: string
  avatar: string | null
  createdTime: string
  lastLoginTime: string | null
  updatedTime: string
  role: AdminRole
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

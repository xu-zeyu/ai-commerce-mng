import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { API_BASE_URL } from './env'

const PUBLIC_PATHS = ['/login/sms', '/public/captcha', '/public/file/upload', '/public/file/batchUpload']

const isPublic = (url: string) => PUBLIC_PATHS.some(p => url.includes(p))

export const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url || ''

  if (!isPublic(url) && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('jh-auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        const token = parsed?.state?.token
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    } catch { /* ignore */ }
  }

  return config
})

request.interceptors.response.use(
  res => {
    const data = res.data
    if (data && data.code && data.code !== '200') {
      toast.error(data.message || '请求失败')
      return Promise.reject({ isBusinessError: true, data })
    }
    return data
  },
  async (error: AxiosError<{ message?: string }>) => {
    let message = '网络错误，请稍后重试'
    if (error.response) {
      const status = error.response.status

      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jh-auth')
          if (window.location.pathname !== '/login') {
            const redirect = encodeURIComponent(window.location.pathname + window.location.search)
            window.location.href = `/login?redirect=${redirect}`
          }
        }
        return Promise.reject(error)
      }

      const map: Record<number, string> = {
        400: '请求参数错误',
        403: '没有权限访问',
        404: '请求的资源不存在',
        500: '服务器错误',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
      }
      message = error.response.data?.message || map[status] || message
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时'
    } else if (!error.response) {
      message = '网络连接失败'
    }
    toast.error(message)
    return Promise.reject(error)
  },
)

export type { AxiosRequestConfig }

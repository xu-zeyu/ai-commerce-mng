import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res: ApiResult<string> = await request.post('/public/file/upload', formData, {
    timeout: 60000,
  })

  return res.data
}

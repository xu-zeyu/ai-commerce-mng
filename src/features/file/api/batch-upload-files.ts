import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function batchUploadFiles(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const res: ApiResult<string[]> = await request.post('/public/file/batchUpload', formData, {
    timeout: 90000,
  })

  return res.data
}

import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function updatePermission(data: { id: number; name?: string; code?: string }): Promise<void> {
  await request.post<ApiResult<void>>('/admin/permission/update', data)
}

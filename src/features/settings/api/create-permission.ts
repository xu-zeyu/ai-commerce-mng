import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function createPermission(data: { name: string; code: string }): Promise<void> {
  await request.post<ApiResult<void>>('/admin/permission/create', data)
}

import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function updateRole(data: { id: number; rname?: string; description?: string }): Promise<void> {
  await request.post<ApiResult<void>>('/admin/role/update', data)
}

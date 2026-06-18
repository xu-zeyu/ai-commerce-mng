import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function createRole(data: { rname: string; description?: string }): Promise<void> {
  await request.post<ApiResult<void>>('/admin/role/create', data)
}

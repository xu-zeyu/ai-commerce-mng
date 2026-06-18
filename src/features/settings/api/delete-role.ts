import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteRole(id: number): Promise<void> {
  await request.post<ApiResult<void>>('/admin/role/delete', { id })
}

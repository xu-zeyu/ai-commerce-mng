import { request } from '@/services/request'
import type { AdminPermission } from '../types'
import type { ApiResult } from '@/services/types'

export async function getRolePermissions(roleId: number): Promise<AdminPermission[]> {
  const res: ApiResult<AdminPermission[]> = await request.get(`/admin/role/${roleId}/permissions`)
  return res.data
}

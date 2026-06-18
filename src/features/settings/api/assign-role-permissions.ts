import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function assignRolePermissions(data: {
  roleId: number
  permissionIds: number[]
}): Promise<void> {
  await request.post<ApiResult<void>>('/admin/role/assignPermissions', data)
}

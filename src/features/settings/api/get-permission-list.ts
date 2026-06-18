import { request } from '@/services/request'
import type { AdminPermission } from '../types'
import type { ApiResult } from '@/services/types'

export async function getPermissionList(): Promise<AdminPermission[]> {
  const res: ApiResult<AdminPermission[]> = await request.get('/admin/permission/list')
  return res.data
}

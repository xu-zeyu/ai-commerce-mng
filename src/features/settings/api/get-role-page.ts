import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { RolePageParams, RolePageResult } from '../types'

export async function getRolePage(params: RolePageParams): Promise<RolePageResult> {
  const res: ApiResult<RolePageResult> = await request.get('/admin/role/page', { params })
  return res.data
}

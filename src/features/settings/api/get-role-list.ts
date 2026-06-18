import { request } from '@/services/request'
import type { AdminRole } from '../types'
import type { ApiResult } from '@/services/types'

export async function getRoleList(): Promise<AdminRole[]> {
  const res: ApiResult<AdminRole[]> = await request.get('/admin/role/list')
  return res.data
}

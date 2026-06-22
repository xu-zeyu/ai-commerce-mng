import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { AdminRole } from '../types'

export async function getRoleById(id: number): Promise<AdminRole> {
  const res: ApiResult<AdminRole> = await request.get(`/admin/role/${id}`)
  return res.data
}

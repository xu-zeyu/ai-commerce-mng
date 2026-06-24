import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteSupplier(id: number): Promise<void> {
  const res: ApiResult<void> = await request.delete(`/supplier/${id}`)
  return res.data
}

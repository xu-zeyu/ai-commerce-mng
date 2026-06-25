import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteSupplierBrand(id: number): Promise<void> {
  const res: ApiResult<void> = await request.delete(`/supplier/brand/${id}`)
  return res.data
}

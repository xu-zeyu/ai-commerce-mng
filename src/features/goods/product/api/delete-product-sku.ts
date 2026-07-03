import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteProductSku(id: number): Promise<void> {
  const res: ApiResult<void> = await request.delete(`/product/sku/${id}`)
  return res.data
}

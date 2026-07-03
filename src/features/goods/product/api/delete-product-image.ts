import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'

export async function deleteProductImage(id: number): Promise<void> {
  const res: ApiResult<void> = await request.delete(`/product/image/${id}`)
  return res.data
}

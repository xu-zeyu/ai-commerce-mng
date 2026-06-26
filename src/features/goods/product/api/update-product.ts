import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductSpu, UpdateProductPayload } from '../types'

export async function updateProduct({
  id,
  ...data
}: { id: number } & UpdateProductPayload): Promise<ProductSpu> {
  const res: ApiResult<ProductSpu> = await request.put(`/product/${id}`, data)
  return res.data
}

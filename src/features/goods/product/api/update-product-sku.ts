import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductSku, UpdateProductSkuPayload } from '../types'

export async function updateProductSku({
  id,
  ...data
}: { id: number } & UpdateProductSkuPayload): Promise<ProductSku> {
  const res: ApiResult<ProductSku> = await request.put(`/product/sku/${id}`, data)
  return res.data
}

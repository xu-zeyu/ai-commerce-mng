import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductSpuImage, ProductImagePayload } from '../types'

export async function updateProductImage({
  id,
  ...data
}: { id: number } & ProductImagePayload): Promise<ProductSpuImage> {
  const res: ApiResult<ProductSpuImage> = await request.put(`/product/image/${id}`, data)
  return res.data
}

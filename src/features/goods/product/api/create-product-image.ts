import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductImagePayload } from '../types'

export async function createProductImage(data: ProductImagePayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/product/image/create', data)
  return res.data
}

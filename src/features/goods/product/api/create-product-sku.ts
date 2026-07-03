import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CreateProductSkuPayload } from '../types'

export async function createProductSku(data: CreateProductSkuPayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/product/sku/create', data)
  return res.data
}

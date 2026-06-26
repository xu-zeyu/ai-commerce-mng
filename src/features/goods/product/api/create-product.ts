import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CreateProductPayload } from '../types'

export async function createProduct(data: CreateProductPayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/product/create', data)
  return res.data
}

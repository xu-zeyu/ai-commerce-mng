import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CreateBrandPayload } from '../types'

export async function createBrand(data: CreateBrandPayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/goods/brand/create', data)
  return res.data
}

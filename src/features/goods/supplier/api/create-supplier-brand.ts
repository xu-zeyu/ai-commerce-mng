import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CreateSupplierBrandPayload } from '../types'

export async function createSupplierBrand(data: CreateSupplierBrandPayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/supplier/brand/create', data)
  return res.data
}

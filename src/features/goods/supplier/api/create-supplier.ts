import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { CreateSupplierPayload } from '../types'

export async function createSupplier(data: CreateSupplierPayload): Promise<number> {
  const res: ApiResult<number> = await request.post('/supplier/create', data)
  return res.data
}

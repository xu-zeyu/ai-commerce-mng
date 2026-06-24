import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { SupplierPageParams, SupplierPageResult } from '../types'

export async function getSupplierPage(params: SupplierPageParams): Promise<SupplierPageResult> {
  const res: ApiResult<SupplierPageResult> = await request.get('/supplier/page', { params })
  return res.data
}

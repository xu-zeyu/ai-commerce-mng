import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { SupplierBrandPageParams, SupplierBrandPageResult } from '../types'

export async function getSupplierBrandPage(
  params: SupplierBrandPageParams,
): Promise<SupplierBrandPageResult> {
  const res: ApiResult<SupplierBrandPageResult> = await request.get('/supplier/brand/page', {
    params,
  })
  return res.data
}

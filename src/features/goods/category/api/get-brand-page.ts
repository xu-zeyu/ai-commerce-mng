import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { BrandPageParams, BrandPageResult } from '../types'

export async function getBrandPage(params: BrandPageParams): Promise<BrandPageResult> {
  const res: ApiResult<BrandPageResult> = await request.get('/goods/brand/page', { params })
  return res.data
}

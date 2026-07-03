import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductSkuPageParams, ProductSkuPageResult } from '../types'

export async function getProductSkuPage(params: ProductSkuPageParams): Promise<ProductSkuPageResult> {
  const res: ApiResult<ProductSkuPageResult> = await request.get('/product/sku/page', { params })
  return res.data
}

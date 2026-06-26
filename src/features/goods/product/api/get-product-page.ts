import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductPageParams, ProductPageResult } from '../types'

export async function getProductPage(params: ProductPageParams): Promise<ProductPageResult> {
  const res: ApiResult<ProductPageResult> = await request.get('/product/page', { params })
  return res.data
}

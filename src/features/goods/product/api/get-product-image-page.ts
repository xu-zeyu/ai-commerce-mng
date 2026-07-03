import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductImagePageParams, ProductImagePageResult } from '../types'

export async function getProductImagePage(
  params: ProductImagePageParams,
): Promise<ProductImagePageResult> {
  const res: ApiResult<ProductImagePageResult> = await request.get('/product/image/page', { params })
  return res.data
}

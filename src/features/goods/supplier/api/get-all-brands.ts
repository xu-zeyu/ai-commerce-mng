import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { GoodsBrand } from '@/features/goods/category/types'

interface AllBrandsResult {
  records: GoodsBrand[]
  total: number
}

/**
 * 获取所有品牌（用于供应商品牌关联选择）
 */
export async function getAllBrands(): Promise<GoodsBrand[]> {
  const res: ApiResult<AllBrandsResult> = await request.get('/goods/brand/page', {
    params: { page: 1, size: 1000 },
  })
  return res.data.records ?? []
}

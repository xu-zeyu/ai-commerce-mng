import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { UpdateBrandPayload } from '../types'

export async function updateBrand({ id, ...data }: { id: number } & UpdateBrandPayload): Promise<void> {
  await request.put<ApiResult<void>>(`/goods/brand/${id}`, data)
}

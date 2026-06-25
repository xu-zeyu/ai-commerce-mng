import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { SupplierBrand, CreateSupplierBrandPayload } from '../types'

export async function updateSupplierBrand({
  id,
  ...data
}: { id: number } & CreateSupplierBrandPayload): Promise<SupplierBrand> {
  const res: ApiResult<SupplierBrand> = await request.put(`/supplier/brand/${id}`, data)
  return res.data
}

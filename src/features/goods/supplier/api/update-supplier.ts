import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { Supplier, UpdateSupplierPayload } from '../types'

export async function updateSupplier({
  id,
  ...data
}: { id: number } & UpdateSupplierPayload): Promise<Supplier> {
  const res: ApiResult<Supplier> = await request.put(`/supplier/${id}`, data)
  return res.data
}

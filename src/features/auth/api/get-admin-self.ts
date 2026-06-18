import { request } from '@/services/request'
import type { AdminSelf } from "../types"
import type { ApiResult } from "@/services/types"

export async function getAdminSelf(): Promise<AdminSelf> {
  const res: ApiResult<AdminSelf> = await request.get("/admin/self")
  return res.data
}

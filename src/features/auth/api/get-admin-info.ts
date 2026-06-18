import { request } from '@/services/request'
import type { AdminInfo } from "../types"
import type { ApiResult } from "@/services/types"

export async function getAdminInfo(): Promise<AdminInfo> {
  const res: ApiResult<AdminInfo> = await request.get("/admin/info")
  return res.data
}

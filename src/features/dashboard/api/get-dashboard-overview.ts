import { request } from '@/services/request'
import type { DashboardOverview } from "../types"
import type { ApiResult } from "@/services/types"

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const res: ApiResult<DashboardOverview> = await request.get("/api/dashboard/overview")
  return res.data
}

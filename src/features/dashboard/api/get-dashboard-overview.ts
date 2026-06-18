import { api } from "@/services/api-client";

import type { DashboardOverview } from "../types";

/**
 * 获取仪表盘概览数据。
 * base_url 由 services/env 按运行环境注入（dev/test -> http://8.163.103.108/）。
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  return api.get<DashboardOverview>("/api/dashboard/overview");
}
